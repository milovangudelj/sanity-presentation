import { handleResendContactSync } from "~/lib/email/contacts/handle-resend-contact-sync";
import { handleSanityContactSync } from "~/lib/email/contacts/handle-sanity-contact-sync";
import { handleMarketingEmailPublish } from "~/lib/email/marketing/handle-email-publish";

import { headers } from "next/headers";

type RequestHandler = (body: string) => Promise<Response>;

type WebhookSource =
  | "sanity.contact-sync"
  | "sanity.marketing-email"
  | "resend.contact-sync";

// Analyze headers and the request body and return the source of the request. Can be contact synchronisation from either Sanity or Resend, or a marketing email publish event from Sanity.
// If it's coming from Sanity it has a header "request-source" with the value "sanity". If it's coming from Resend that header is not set.
// If it's a marketing email publish event from Sanity it contains a "_type" field in the request body with the value "marketingEmail", for contact sync that field is equal to "contact".
async function getRequestSource(body: string): Promise<WebhookSource> {
  const headersList = headers();
  const source = headersList.get("request-source");

  if (!source) return "resend.contact-sync";

  if (JSON.parse(body)._type === "contact") return "sanity.contact-sync";

  return "sanity.marketing-email";
}

const handlers: {
  [key in WebhookSource]: RequestHandler;
} = {
  "resend.contact-sync": handleResendContactSync,
  "sanity.contact-sync": handleSanityContactSync,
  "sanity.marketing-email": handleMarketingEmailPublish,
};

export async function POST(req: Request) {
  const body = await req.text();
  const source = await getRequestSource(body);

  const handler = handlers[source];

  return handler(body);
}
