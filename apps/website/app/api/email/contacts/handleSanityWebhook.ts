import { z } from "zod";
import {
  audienceId,
  dataChanged,
  getResendContact,
  getSanityContact,
} from "./utils";
import { resend } from "~/lib/resend";
import { headers } from "next/headers";

const SanityPayloadSchema = z.object({
  _id: z.string(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  audienceId: z.string(),
  subscribed: z.boolean(),
});
type SanityPayload = z.infer<typeof SanityPayloadSchema>;

export async function handleSanityWebhook(data: any) {
  const payload = SanityPayloadSchema.parse(data);

  const operation = getOperation();

  if (!operation) {
    return Response.json(
      { status: "skipped" },
      {
        status: 400,
      }
    );
  }

  switch (operation) {
    case "create":
    case "update":
      await createOrUpdateResendContact(payload);
      break;
    case "delete":
      await deleteResendContact(payload._id);
      break;
  }

  return Response.json(
    { status: "received" },
    {
      status: 200,
    }
  );
}

function getOperation() {
  const headersList = headers();
  const operation = headersList.get("sanity-operation");

  return operation;
}

async function createOrUpdateResendContact(data: SanityPayload) {
  const contact = await getResendContact(data._id);

  if (!dataChanged(data, contact)) {
    return;
  }

  if (contact !== null) {
    const response = await resend.patch(
      `/audiences/${audienceId}/contacts/${data._id}`,
      {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        unsubscribed: !data.subscribed,
      }
    );

    console.log(
      "Update status:",
      response.error ? `failed. ${response.error.name}` : "success."
    );
  } else {
    const response = await resend.post(`/audiences/${audienceId}/contacts`, {
      id: data._id,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      unsubscribed: !data.subscribed,
    });

    console.log(
      "Create status:",
      response.error ? `failed. ${response.error.name}` : "success."
    );
  }
}

async function deleteResendContact(id: string) {
  const contact = await getResendContact(id);

  if (contact === null) {
    return;
  }

  const response = await resend.delete(
    `/audiences/${audienceId}/contacts/${id}`
  );

  console.log(
    "Delete status:",
    response.error ? `failed. ${response.error.name}` : "success."
  );
}
