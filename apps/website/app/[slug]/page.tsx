import { type QueryParams, type SanityDocument } from "next-sanity";
import { notFound } from "next/navigation";

import { POSTS_QUERY, POST_QUERY } from "~/sanity/lib/queries";
import { sanityFetch } from "~/sanity/lib/fetch";

import Post from "~/components/post";

export async function generateStaticParams() {
  const posts = await sanityFetch<SanityDocument[]>({
    query: POSTS_QUERY,
    perspective: "published",
    stega: false,
  });

  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

export default async function Page({ params }: { params: QueryParams }) {
  const post = await sanityFetch<SanityDocument | null>({
    query: POST_QUERY,
    params,
  });

  if (!post) {
    return notFound();
  }

  return <Post post={post} />;
}
