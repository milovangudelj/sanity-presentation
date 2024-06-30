import { type SanityDocument } from "next-sanity";

import { sanityFetch } from "~/sanity/lib/fetch";
import { POSTS_QUERY } from "~/sanity/lib/queries";

import Posts from "~/components/posts";

export default async function Home() {
  const posts = await sanityFetch<SanityDocument[]>({
    query: POSTS_QUERY,
  });

  return (
    <main className="flex flex-col items-center justify-center p-24">
      <Posts posts={posts} />
      <Posts posts={posts} />
      <Posts posts={posts} />
      <Posts posts={posts} />
      <Posts posts={posts} />
      <Posts posts={posts} />
      <Posts posts={posts} />
      <Posts posts={posts} />
      <Posts posts={posts} />
    </main>
  );
}
