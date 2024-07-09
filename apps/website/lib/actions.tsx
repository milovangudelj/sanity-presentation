"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { renderAsync } from "@react-email/components";

import { WelcomeEmail } from "@repo/email";

import { resend } from "./resend";

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

  if (!contacts.data) {
    return {
      status: "failed",
      message: "We couldn't subscribe you. Try again later.",
    };
  }

  const contact = contacts.data.data.find(
    ({ email: _email }) => _email === email
  );

  if (contact && !contact.unsubscribed) {
    return {
      status: "failed",
      message: "You're already subscribed to the mailing list.",
    };
  }

  if (contact) {
    const { error } = await resend.contacts.update({
      id: contact.id,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
    });

    if (!error) {
      await resend.emails.send({
        from: "Quill <quill@tldr.milovangudelj.com>",
        to: [contact.email],
        subject: "Subscribed! 🎉",
        html: await renderAsync(<WelcomeEmail id={contact.id} resubscribed />),
      });

      revalidatePath("/");
      return { status: "success", message: `Subscribed!` };
    }
  }

  const { error, data } = await resend.contacts.create({
    email,
    unsubscribed: false,
    audienceId: process.env.RESEND_AUDIENCE_ID!,
  });

  if (!error && data) {
    await resend.emails.send({
      from: "Quill <quill@tldr.milovangudelj.com>",
      to: [email],
      subject: "Subscribed! 🎉",
      html: await renderAsync(<WelcomeEmail id={data.id} />),
    });

    revalidatePath("/");
    return { status: "success", message: `Subscribed!` };
  }

  return {
    status: "failed",
    message: "We couldn't subscribe you. Try again later.",
  };
}
