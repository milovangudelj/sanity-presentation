import { type SchemaPluginOptions } from "sanity";

import author from "./schemaTypes/author";
import blockContent from "./schemaTypes/block-content";
import category from "./schemaTypes/category";
import contact from "./schemaTypes/contact";
import emailCampaign from "./schemaTypes/email-campaign";
import emailCampaignTemplate from "./schemaTypes/email-campaign-template";
import marketingEmail from "./schemaTypes/marketing-email";
import post from "./schemaTypes/post";
import transactionalEmail from "./schemaTypes/transactional-email";

export const schema: SchemaPluginOptions = {
  types: [
    author,
    blockContent,
    category,
    contact,
    emailCampaign,
    emailCampaignTemplate,
    marketingEmail,
    post,
    transactionalEmail,
  ],
  templates: [
    {
      id: "meTemplate",
      title: "Marketing Email - Initial Data",
      schemaType: "marketingEmail",
      parameters: [
        {
          name: "campaignId",
          type: "string",
        },
      ],
      value: (parameters: any) => ({
        campaign: {
          _type: "reference",
          _ref: parameters.campaignId,
        },
      }),
    },
  ],
};
