import { Envelope } from "@phosphor-icons/react";
import { defineField, defineType } from "sanity";
import emailBlockContent from "~/sanity/schemaTypes/email-block-content";

export default defineType({
  name: "transactionalEmail",
  title: "Transactional Email",
  type: "document",
  icon: Envelope,
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
