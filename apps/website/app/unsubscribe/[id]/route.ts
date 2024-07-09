import { NextResponse } from "next/server";
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

  console.log(
    `Unsubscribing contact with id ${contact.id} and email ${contact.email}`
  );
  await resend.contacts.update({
    id: contact.id,
    audienceId: process.env.RESEND_AUDIENCE_ID!,
    unsubscribed: true,
  });

  return NextResponse.redirect(
    new URL(`/unsubscribed/${contact.id}`, request.url)
  );
}
