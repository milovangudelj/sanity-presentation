import { Envelope } from "@phosphor-icons/react";
import { defineField, defineType } from "sanity";

import emailBlockContent from "~/sanity/schemaTypes/email-block-content";

export default defineType({
  name: "marketingEmail",
  title: "Marketing Email",
  type: "document",
  icon: Envelope,
  readOnly: ({ document }) => {
    // Only allow editing an email if it's not yet published
    return document?.status !== "draft" && document?.publishedAt !== undefined;
  },
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      hidden: true,
      initialValue: "draft",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      hidden: true,
    }),
    defineField({
      name: "campaign",
      title: "Campaign",
      type: "reference",
      to: { type: "emailCampaign" },
      readOnly: true,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
    }),
    defineField({
      name: "preview",
      title: "Preview",
      type: "string",
    }),
    defineField({
      ...emailBlockContent,
      name: "body",
      title: "Body",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subject: "subject",
    },
    prepare({ title, subject }) {
      return { title, subtitle: subject };
    },
  },
});
