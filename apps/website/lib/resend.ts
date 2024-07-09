import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const getContacts = async () => {
  const contacts = await resend.contacts.list({
    audienceId: process.env.RESEND_AUDIENCE_ID!,
  });

  return contacts.data?.data;
};
