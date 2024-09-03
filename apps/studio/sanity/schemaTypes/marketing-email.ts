import { Envelope } from "@phosphor-icons/react";
import { defineField, defineType } from "sanity";

import { apiVersion } from "~/sanity/env";
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
      validation: (rule) =>
        rule.required().error("Every email must be part of a campaign"),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) =>
        rule.required().error("Every email must have a title"),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
      validation: (rule) =>
        rule.required().error("Every email must have an author"),
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
      validation: (rule) =>
        rule.required().error("Every email must have a subject"),
    }),
    defineField({
      name: "preview",
      title: "Preview",
      type: "string",
      validation: (rule) =>
        rule.required().error("Every email must have a preview"),
    }),
    defineField({
      ...emailBlockContent,
      name: "body",
      title: "Body",
      validation: (rule) =>
        rule.required().error("Every email must have a body"),
    }),
  ],
  validation: (Rule) =>
    Rule.custom((document, context) => {
      if (!document) return true;

      const client = context.getClient({ apiVersion });

      const campaign = document.campaign as DocumentReference | undefined;

      if (!campaign) return "Every email must be part of a campaign";

      const templateId = `${campaign._ref.replace("drafts.", "")}_template`;

      const template = client.getDocument(templateId);

      if (!template) return "The campaign must have a published template";

      return true;
    }),
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

interface DocumentReference {
  _ref: string;
  _type: "reference";
}