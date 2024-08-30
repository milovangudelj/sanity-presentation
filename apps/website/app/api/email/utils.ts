import { createClient } from "next-sanity";
import { z } from "zod";

import { apiVersion, dataset, projectId } from "~/sanity/env";
import { resend } from "~/lib/resend";

export const audienceId = process.env.RESEND_AUDIENCE_ID!;

export const sanity = createClient({
  apiVersion,
  dataset,
  projectId,
  token: process.env.SANITY_ADMIN_AUTH_TOKEN,
  useCdn: false,
});

export const SanityContactSchema = z.nullable(
  z.object({
    _id: z.string(),
    email: z.string().email(),
    firstName: z.nullable(z.string()),
    lastName: z.nullable(z.string()),
    audienceId: z.string(),
    subscribed: z.boolean(),
  })
);
export type SanityContact = z.infer<typeof SanityContactSchema>;

export async function getSanityContact(id: string) {
  return sanity.fetch<SanityContact>(
    `*[_id == $id][0]{
    _id,
    email,
    firstName,
    lastName,
    audienceId,
    subscribed
  }`,
    {
      id,
    }
  );
}

export const ResendContactSchema = z.nullable(
  z.object({
    id: z.string(),
    email: z.string().email(),
    first_name: z.nullable(z.string()),
    last_name: z.nullable(z.string()),
    created_at: z.string().datetime({ precision: 3 }),
    unsubscribed: z.boolean(),
  })
);
export type ResendContact = z.infer<typeof ResendContactSchema>;

export async function getResendContact(id: string) {
  const response = await resend.contacts.get({
    id,
    audienceId,
  });

  return response.data as ResendContact;
}

export function dataChanged(
  sanityContact: SanityContact,
  resendContact: ResendContact
) {
  if (resendContact === null || sanityContact === null) {
    return true;
  }

  return (
    sanityContact.email !== resendContact.email ||
    sanityContact.firstName !== resendContact.first_name ||
    sanityContact.lastName !== resendContact.last_name ||
    sanityContact.subscribed !== !resendContact.unsubscribed
  );
}
