"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeContact(
  prevState: {
    status: "idle" | "success" | "failed";
    message: string;
  },
  formData: FormData
): Promise<{
  status: "idle" | "success" | "failed";
  message: string;
}> {
  const schema = z.object({
    email: z.string().min(1).email(),
  });
  const parse = schema.safeParse({
    email: formData.get("email"),
  });

  if (!parse.success) {
    return { status: "failed", message: "Invalid email address." };
  }

  const { email } = parse.data;

  const contacts = await resend.contacts.list({
    audienceId: process.env.RESEND_AUDIENCE_ID!,
  });

  if (
    contacts.data &&
    contacts.data.data.some((contact) => contact.email === email)
  ) {
    return {
      status: "failed",
      message: "You're already subscribed to the mailing list.",
    };
  }

  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    audienceId: process.env.RESEND_AUDIENCE_ID!,
  });

  if (!error) {
    await resend.emails.send({
      from: "Milo <m@tldr.milovangudelj.com>",
      to: [email],
      subject: "Subscribed! 🎉",
      text: "Congratulations! You have successfully subscribed to our newsletter.",
    });

    revalidatePath("/");
    return { status: "success", message: `Subscribed!` };
  }

  return {
    status: "failed",
    message: "We couldn't subscribe you. Try again later.",
  };
}
