import { Megaphone } from "@phosphor-icons/react";
import { defineType } from "sanity";

export default defineType({
  name: "emailCampaign",
  title: "Email Campaign",
  type: "document",
  icon: Megaphone,
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "string",
    },
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
