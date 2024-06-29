import type { ClientPerspective, QueryParams } from "next-sanity";
import { draftMode } from "next/headers";

import { client } from "~/sanity/lib/client";
import { token } from "~/sanity/lib/token";

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  perspective = draftMode().isEnabled ? "previewDrafts" : "published",
  stega = perspective === "previewDrafts" ||
    process.env.VERCEL_ENV === "preview",
}: {
  query: string;
  params?: QueryParams;
  perspective?: Omit<ClientPerspective, "raw">;
  stega?: boolean;
}) {
  if (perspective === "previewDrafts") {
    return client.fetch<QueryResponse>(query, params, {
      stega,
      perspective: "previewDrafts",
      token,
      useCdn: false,
      next: { revalidate: 0 },
    });
  }
  return client.fetch<QueryResponse>(query, params, {
    stega,
    perspective: "published",
    useCdn: true,
    next: { revalidate: 60 },
  });
}
