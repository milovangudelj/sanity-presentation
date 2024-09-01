import { headers } from "next/headers";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { createClient, PortableTextBlock } from "next-sanity";
import { z } from "zod";

import { render } from "@react-email/components";
import { EmailTemplate } from "@repo/email";

import { apiVersion, dataset, projectId } from "~/sanity/env";
import { resend } from "~/lib/resend";
import React from "react";
import { urlForImage } from "~/sanity/lib/image";

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

export async function POST(request: Request) {
  const signature = headers().get(SIGNATURE_HEADER_NAME);
  const body = await request.json();

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

  const payload = SanityMarketingPayloadShema.parse(body);

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

  const email = await renderEmail({
    data: marketingEmail,
    author,
    template,
  });

  const { data: contacts } = ContacsListPayloadSchema.parse(
    (
      await resend.contacts.list({
        audienceId: process.env.RESEND_AUDIENCE_ID!,
      })
    ).data
  );

  const results = await batchSend(contacts, {
    from: "Quill <quill@tldr.milovangudelj.com>",
    subject: marketingEmail.subject,
    html: email,
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

async function renderEmail({
  data,
  author,
  template,
}: {
  data: z.infer<typeof MarketingEmailPayloadSchema>;
  author: z.infer<typeof AuthorSchema>;
  template: z.infer<typeof TemplateSchema>;
}) {
  const authorName = `${author.firstName} ${author.lastName.split("")[0].toUpperCase()}.`;
  const authorImage = author.image
    ? urlForImage(author.image.asset!)
    : undefined;

  const body = applyTemplate(data.body, template.body);

  const email = render(
    <EmailTemplate
      id={data._id}
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

async function batchSend(
  contacts: z.infer<typeof ContacsListPayloadSchema>["data"],
  { from, subject, html }: { from: string; subject: string; html: string }
) {
  const batches = [];

  for (let i = 0; i < contacts.length; i += 100) {
    batches.push(contacts.slice(i, i + 100));
  }

  const results = await Promise.all(
    batches.map(async (batch) =>
      resend.batch.send(
        batch.map((contact) => ({
          from,
          to: [contact.email],
          subject,
          html,
        }))
      )
    )
  );

  return results;
}
