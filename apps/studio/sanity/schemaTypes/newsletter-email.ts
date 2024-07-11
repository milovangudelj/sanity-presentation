import { Envelope } from "@phosphor-icons/react";
import { defineField, defineType } from "sanity";

// Email schma for the newsletter
export default defineType({
  name: "newsletterEmail",
  title: "Newsletter Email",
  type: "document",
  icon: Envelope,
  readOnly: ({ document }) => {
    // Only allow editing a book if it does not have the `im-locked` document ID
    return !document?._id.startsWith("drafts.");
  },
  fields: [
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
      name: "body",
      title: "Body",
      type: "emailBlockContent",
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
