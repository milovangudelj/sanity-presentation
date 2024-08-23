import { PortableTextBlock } from "next-sanity";

export interface Author {
  _createdAt: string;
  _updatedAt: string;
  _id: string;
  _rev: string;
  _type: "author";
  firstName: string | null;
  lastName: string | null;
  slug: {
    current: string;
    _type: "slug";
  } | null;
  role: string | null;
  bio: PortableTextBlock[] | null;
  image: {
    asset: {
      _ref: string;
      _type: "reference";
    } | null;
    _type: "image";
    alt: string | null;
  } | null;
}

export interface Template {
  _createdAt: string;
  _updatedAt: string;
  _id: string;
  _rev: string;
  _type: "emailCampaignTemplate";
  body: PortableTextBlock[] | null;
  description: string | null;
  title: string | null;
}

export type PreviewData = {
  _createdAt: string;
  _updatedAt: string;
  _id: string;
  _rev: string;
  author: {
    _ref: string;
    _type: "reference";
  } | null;
  body: PortableTextBlock[] | null;
  preview: string | null;
  subject: string | null;
  title: string | null;
} & (
  | {
      _type: "marketingEmail";
      campaign: {
        _ref: string;
        _type: "reference";
      } | null;
    }
  | {
      _type: "transactionalEmail";
    }
);
