import { Webhook } from "svix";
import { z } from "zod";
import { Transaction } from "next-sanity";

import {
  dataChanged,
  getSanityContact,
  sanity,
} from "~/lib/email/contacts/utils";
import { headers } from "next/headers";

const ResendPayloadSchema = z.object({
  created_at: z.string().datetime({ precision: 3 }),
  data: z.object({
    id: z.string(),
    created_at: z.string().datetime({ precision: 3 }),
    updated_at: z.string().datetime({ precision: 3 }),
    audience_id: z.string(),
    email: z.string().email(),
    unsubscribed: z.boolean(),
    first_name: z.string().optional().nullable(),
    last_name: z.string().optional().nullable(),
  }),
  type: z.enum(["contact.created", "contact.updated", "contact.deleted"]),
});
type ResendPayload = z.infer<typeof ResendPayloadSchema>;

export async function handleResendContactSync(body: string) {
  const headersList = headers();
  const svix_id = headersList.get("svix-id") ?? "";
  const svix_timestamp = headersList.get("svix-timestamp") ?? "";
  const svix_signature = headersList.get("svix-signature") ?? "";

  const svix = new Webhook(process.env.RESEND_WEBHOOK_SECRET!);

  try {
    svix.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return Response.json(
      {
        status: "failed",
        message: "Invalid signature",
      },
      { status: 401 }
    );
  }

  const payload = ResendPayloadSchema.parse(JSON.parse(body));

  try {
    const transaction = sanity.transaction();

    const operation = getOperation(payload.type);

    switch (operation) {
      case "create":
      case "update":
        await createOrUpdateSanityContact(transaction, payload.data);
        break;
      case "delete":
        await deleteSanityContact(transaction, payload.data.id);
        break;
    }

    await transaction.commit();
  } catch (err) {
    return Response.json(
      { status: "failed", message: (err as Error).message },
      {
        status: 500,
      }
    );
  }

  return Response.json(
    { status: "received" },
    {
      status: 200,
    }
  );
}

function getOperation(
  type: ResendPayload["type"]
): "create" | "update" | "delete" {
  return type.split(".")[1].slice(0, -1) as "create" | "update" | "delete";
}

async function createOrUpdateSanityContact(
  transaction: Transaction,
  data: ResendPayload["data"]
) {
  const existingContact = await getSanityContact(data.id);

  if (!dataChanged(existingContact, data)) {
    return;
  }

  const draftDocumentId = `drafts.${data.id}`;

  const existingDrafts = await sanity.fetch<(string | null)[]>(
    `*[_id == $id]._id`,
    {
      id: draftDocumentId,
    }
  );

  const document = {
    _id: data.id,
    _type: "contact",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    email: data.email,
    firstName:
      !data.first_name || data.first_name?.localeCompare("") === 0
        ? "-"
        : data.first_name,
    lastName:
      !data.last_name || data.last_name?.localeCompare("") === 0
        ? "-"
        : data.last_name,
    audienceId: data.audience_id,
    subscribed: !data.unsubscribed,
  };
  const draftId = `drafts.${document._id}`;

  transaction
    .createIfNotExists(document)
    .patch(document._id, (patch) => patch.set(document));

  if (existingDrafts.includes(draftId)) {
    transaction.patch(draftId, (patch) =>
      patch.set({
        ...document,
        _id: draftId,
      })
    );
  }
}

async function deleteSanityContact(transaction: Transaction, id: string) {
  transaction.delete(id).delete(`drafts.${id}`);
}
