import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "~/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
  stega: {
    enabled: false,
    studioUrl: process.env.NEXT_PUBLIC_STUDIO_URL,
  },
});
