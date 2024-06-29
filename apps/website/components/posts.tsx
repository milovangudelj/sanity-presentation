import { type SanityDocument } from "next-sanity";
import Link from "next/link";

export default function Posts({ posts }: { posts: SanityDocument[] }) {
  return (
    <div className="container mx-auto grid grid-cols-1 divide-y divide-black/20">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Link key={post._id} href={post.slug.current as string}>
            <h2 className="p-4 hover:bg-black/10">{post.title}</h2>
          </Link>
        ))
      ) : (
        <div className="p-4 text-red-500">No posts found</div>
      )}
    </div>
  );
}
