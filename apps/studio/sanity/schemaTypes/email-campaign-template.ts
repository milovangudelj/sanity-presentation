import { defineArrayMember, defineField, defineType } from "sanity";
import { ArticleNyTimes } from "@phosphor-icons/react";

import { ContentPlaceholder } from "~/sanity/components/content-placeholder";
import emailBlockContent from "~/sanity/schemaTypes/email-block-content";

export default defineType({
  name: "emailCampaignTemplate",
  title: "Campaign Template",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Template",
      hidden: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      ...emailBlockContent,
      name: "body",
      title: "Body",
      of: [
        ...emailBlockContent.of,
        defineArrayMember({
          name: "placeholder",
          title: "Placeholder",
          type: "object",
          icon: ArticleNyTimes,
          fields: [
            {
              type: "string",
              name: "content",
              initialValue: "Content",
            },
          ],
          components: {
            input: ContentPlaceholder,
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
