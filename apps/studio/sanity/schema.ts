import { type SchemaPluginOptions } from "sanity";

import author from "./schemaTypes/author";
import blockContent from "./schemaTypes/block-content";
import category from "./schemaTypes/category";
import marketingEmail from "./schemaTypes/marketing-email";
import post from "./schemaTypes/post";
import emailCampaign from "./schemaTypes/email-campaign";
import transactionalEmail from "./schemaTypes/transactional-email";
import emailCampaignTemplate from "./schemaTypes/email-campaign-template";

export const schema: SchemaPluginOptions = {
  types: [
    post,
    author,
    category,
    emailCampaign,
    emailCampaignTemplate,
    transactionalEmail,
    marketingEmail,
    blockContent,
  ],
  // templates: [
  //   {
  //     id: "ectTemplate",
  //     title: "Email Campaign Template - Initial Data",
  //     schemaType: "emailCampaignTemplate",
  //     parameters: [
  //       {
  //         name: "title",
  //         type: "string",
  //       },
  //     ],
  //     value: (parameters: any) => ({
  //       title: parameters.title,
  //     }),
  //   },
  // ],
};
