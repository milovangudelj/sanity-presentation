import React from "react";
import { headers } from "next/headers";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { createClient, PortableTextBlock } from "next-sanity";
import { render } from "@react-email/components";
import { z } from "zod";

import { EmailTemplate } from "@repo/email";

import { apiVersion, dataset, projectId } from "~/sanity/env";
import { urlForImage } from "~/sanity/lib/image";
import { resend } from "~/lib/resend";

const secret = process.env.SANITY_WEBHOOK_SECRET!;

const sanity = createClient({
  apiVersion,
  dataset,
  projectId,
  token: process.env.SANITY_ADMIN_AUTH_TOKEN,
  useCdn: false,
});

const SanityMarketingPayloadShema = z.object({
  _id: z.string(),
  _type: z.literal("marketingEmail"),
});

const MarketingEmailPayloadSchema = z.object({
  _id: z.string().uuid(),
  _rev: z.string(),
  _type: z.literal("marketingEmail"),
  _createdAt: z.string().datetime({ precision: 0 }),
  _updatedAt: z.string().datetime({ precision: 0 }),
  publishedAt: z.string().datetime({ precision: 3 }),
  status: z.enum(["draft", "published"]),
  campaign: z.object({
    _ref: z.string().uuid(),
    _type: z.literal("reference"),
  }),
  author: z.object({
    _ref: z.string().uuid(),
    _type: z.literal("reference"),
  }),
  title: z.string(),
  subject: z.string(),
  preview: z.string(),
  body: z.custom<PortableTextBlock>().array(),
});

const AuthorSchema = z.object({
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _id: z.string(),
  _rev: z.string(),
  _type: z.literal("author"),
  firstName: z.string(),
  lastName: z.string(),
  slug: z.object({
    current: z.string(),
    _type: z.literal("slug"),
  }),
  role: z.string(),
  bio: z.custom<PortableTextBlock>().array(),
  image: z.object({
    asset: z
      .object({
        _ref: z.string(),
        _type: z.literal("reference"),
      })
      .nullable(),
    _type: z.literal("image"),
    alt: z.string().nullable(),
  }),
});

const TemplateSchema = z.object({
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _id: z.string(),
  _rev: z.string(),
  _type: z.literal("emailCampaignTemplate"),
  body: z.custom<PortableTextBlock>().array(),
  description: z.string(),
  title: z.string(),
});

const ContacsListPayloadSchema = z.object({
  object: z.literal("list"),
  data: z
    .object({
      id: z.string(),
      created_at: z.string(),
      email: z.string().email(),
      unsubscribed: z.boolean(),
      first_name: z.string().nullable(),
      last_name: z.string().nullable(),
    })
    .array(),
});

export async function handleMarketingEmailPublish(body: string) {
  const signature = headers().get(SIGNATURE_HEADER_NAME);

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return Response.json(
      { status: "failed", message: "Invalid signature" },
      {
        status: 401,
      }
    );
  }

  const payload = SanityMarketingPayloadShema.parse(JSON.parse(body));

  const marketingEmail = MarketingEmailPayloadSchema.parse(
    await sanity.fetch(`*[_id == $id][0]`, {
      id: payload._id,
    })
  );

  if (!marketingEmail) {
    return Response.json(
      { status: "failed", message: "Marketing email not found" },
      {
        status: 404,
      }
    );
  }

  const author = await getAuthor(marketingEmail.author._ref);
  const template = await getTemplate(marketingEmail.campaign._ref);

  const { data } = ContacsListPayloadSchema.parse(
    (
      await resend.contacts.list({
        audienceId: process.env.RESEND_AUDIENCE_ID!,
      })
    ).data
  );

  const contacts = data.filter((contact) => !contact.unsubscribed);

  const emails = [];

  for (const contact of contacts) {
    const email = await renderEmail({
      data: marketingEmail,
      author,
      template,
      contactId: contact.id,
    });

    emails.push({
      contactId: contact.id,
      email,
    });
  }

  const results = await batchSend(contacts, emails, {
    from: "Quill <quill@tldr.milovangudelj.com>",
    subject: marketingEmail.subject,
  });

  const erroredResult = results.find(({ error }) => error);
  if (erroredResult?.error) {
    return Response.json(
      { status: "failed", message: erroredResult.error },
      {
        status: 500,
      }
    );
  }

  return Response.json(
    {
      status: "received",
    },
    {
      status: 200,
    }
  );
}

async function getAuthor(id: string) {
  return AuthorSchema.parse(
    await sanity.fetch(`*[_type == "author" && _id == $id][0]`, {
      id,
    })
  );
}

async function getTemplate(catId: string) {
  return TemplateSchema.parse(
    await sanity.fetch(`*[_type == "emailCampaignTemplate" && _id == $id][0]`, {
      id: `${catId}_template`,
    })
  );
}

async function batchSend(
  contacts: z.infer<typeof ContacsListPayloadSchema>["data"],
  emails: {
    contactId: string;
    email: string;
  }[],
  { from, subject }: { from: string; subject: string }
) {
  const batches = [];

  for (let i = 0; i < contacts.length; i += 100) {
    batches.push(contacts.slice(i, i + 100));
  }

  const results = await Promise.all(
    batches.map((batch) => {
      const payload = batch.map((contact) => ({
        from,
        to: [contact.email],
        subject,
        html: emails.find(({ contactId }) => contactId === contact.id)!.email,
      }));

      return resend.batch.send(payload);
    })
  );

  return results;
}

async function renderEmail({
  data,
  author,
  template,
  contactId,
}: {
  data: z.infer<typeof MarketingEmailPayloadSchema>;
  author: z.infer<typeof AuthorSchema>;
  template: z.infer<typeof TemplateSchema>;
  contactId: string;
}) {
  const authorName = `${author.firstName} ${author.lastName.split("")[0].toUpperCase()}.`;
  const authorImage = author.image
    ? urlForImage(author.image.asset!)
    : undefined;

  const body = applyTemplate(data.body, template.body);

  const email = render(
    <EmailTemplate
      id={contactId}
      author={authorName}
      authorImage={authorImage}
      preview={data.preview}
      body={body}
      canUnsubscribe={true}
      server={true}
    />
  );

  return email;
}

function applyTemplate(
  body: PortableTextBlock[],
  template: PortableTextBlock[]
) {
  if (!template) return body;

  let placeholderIndex = 0;
  template.forEach((block, index) => {
    placeholderIndex = block._type === "placeholder" ? index : placeholderIndex;
  });

  if (!body) return template.filter((block) => block._type !== "placeholder");

  return [
    template.slice(0, placeholderIndex),
    body,
    template.slice(placeholderIndex + 1),
  ].flat();
}
