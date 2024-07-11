import { type SchemaTypeDefinition } from "sanity";

import author from "./schemaTypes/author";
import blockContent from "./schemaTypes/block-content";
import category from "./schemaTypes/category";
import emailBlockContent from "./schemaTypes/email-block-content";
import newsletterEmail from "./schemaTypes/newsletter-email";
import post from "./schemaTypes/post";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    author,
    category,
    newsletterEmail,
    blockContent,
    emailBlockContent,
  ],
};
