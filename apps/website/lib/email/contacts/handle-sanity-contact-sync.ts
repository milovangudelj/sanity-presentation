import { headers } from "next/headers";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { z } from "zod";

import {
  audienceId,
  dataChanged,
  getResendContact,
  getSanityContact,
} from "~/lib/email/contacts/utils";
import { resend } from "~/lib/resend";

const secret = process.env.SANITY_WEBHOOK_SECRET!;

const SanityPayloadSchema = z.object({
  _id: z.string(),
  _type: z.literal("contact"),
});
type SanityPayload = z.infer<typeof SanityPayloadSchema>;

export async function handleSanityContactSync(req: Request) {
  const signature = headers().get(SIGNATURE_HEADER_NAME);
  const body = await req.json();

  if (
    !signature ||
    !(await isValidSignature(JSON.stringify(body), signature, secret))
  ) {
    return Response.json(
      { status: "failed", message: "Invalid signature" },
      {
        status: 401,
      }
    );
  }

  const payload = SanityPayloadSchema.parse(body);

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
      return createOrUpdateResendContact(payload);

    case "delete":
      return deleteResendContact(payload._id);

    default:
      return Response.json(
        { status: "skipped" },
        {
          status: 400,
        }
      );
  }
}

function getOperation() {
  const headersList = headers();
  const operation = headersList.get("sanity-operation");

  return operation;
}

async function createOrUpdateResendContact(payload: SanityPayload) {
  const sanityContact = await getSanityContact(payload._id);
  const resendContact = await getResendContact(payload._id);

  if (!sanityContact || !dataChanged(sanityContact, resendContact)) {
    return Response.json(
      { status: "skipped" },
      {
        status: 200,
      }
    );
  }

  let response;
  if (resendContact !== null) {
    response = await resend.patch(
      `/audiences/${audienceId}/contacts/${sanityContact._id}`,
      {
        email: sanityContact.email,
        first_name: sanityContact.firstName,
        last_name: sanityContact.lastName,
        unsubscribed: !sanityContact.subscribed,
      }
    );
  } else {
    response = await resend.post(`/audiences/${audienceId}/contacts`, {
      id: sanityContact._id,
      email: sanityContact.email,
      first_name: sanityContact.firstName,
      last_name: sanityContact.lastName,
      unsubscribed: !sanityContact.subscribed,
    });
  }

  return Response.json(
    { status: response.error ? "failed" : "success" },
    {
      status: response.error ? 500 : 200,
    }
  );
}

async function deleteResendContact(id: string) {
  const contact = await getResendContact(id);

  if (contact === null) {
    return Response.json(
      { status: "skipped" },
      {
        status: 200,
      }
    );
  }

  const response = await resend.delete(
    `/audiences/${audienceId}/contacts/${id}`
  );

  return Response.json(
    { status: response.error ? "failed" : "success" },
    {
      status: response.error ? 500 : 200,
    }
  );
}
