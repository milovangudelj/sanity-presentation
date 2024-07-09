import { renderAsync } from "@react-email/components";
import { NextResponse } from "next/server";

import { UnsubscribedEmail } from "@repo/email";

import { getContacts, resend } from "~/lib/resend";

interface Params {
  id: string;
}

export async function GET(request: Request, context: { params: Params }) {
  return unsubscribe(request, context);
}
export async function POST(request: Request, context: { params: Params }) {
  return unsubscribe(request, context);
}

async function unsubscribe(request: Request, context: { params: Params }) {
  console.log(await getContacts());

  const contact = (await getContacts())?.find(
    ({ id }) => id === context.params.id
  );

  if (!contact) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { error } = await resend.contacts.update({
    id: contact.id,
    audienceId: process.env.RESEND_AUDIENCE_ID!,
    unsubscribed: true,
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/unsubscribed?error=missing-contact`, request.url)
    );
  }

  await resend.emails.send({
    from: "Milo <m@tldr.milovangudelj.com>",
    to: [contact.email],
    subject: "Unsubscribed!",
    html: await renderAsync(<UnsubscribedEmail id={contact.id} />),
  });

  return NextResponse.redirect(
    new URL(`/unsubscribed/${contact.id}`, request.url)
  );
}
