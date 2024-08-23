import { defineArrayMember, defineField, defineType } from "sanity";
import { ArticleNyTimes } from "@phosphor-icons/react";

import { ContentPlaceholder } from "~/sanity/components/content-placeholder";
import emailBlockContent from "~/sanity/schemaTypes/email-block-content";
import { PortableTextBlock } from "next-sanity";

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
  validation: (rule) =>
    rule.custom((fields) => {
      if (!fields) return true;
      const body = fields.body as PortableTextBlock[];

      const hasPlaceholder = body.some(
        (block) => block._type === "placeholder"
      );
      const hasMultiplePlaceholders =
        body.filter((block) => block._type === "placeholder").length > 1;

      if (!hasPlaceholder) return "You must have at least one placeholder";
      if (hasMultiplePlaceholders) return "You can only have one placeholder";
      return true;
    }),
  preview: {
    select: {
      title: "title",
    },
  },
});
