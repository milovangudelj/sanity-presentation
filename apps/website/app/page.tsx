import { type SanityDocument } from "next-sanity";

import { sanityFetch } from "~/sanity/lib/fetch";
import { POSTS_QUERY } from "~/sanity/lib/queries";

import Posts from "~/components/posts";
import { Container } from "~/components/container";

export default async function Home() {
  const posts = await sanityFetch<SanityDocument[]>({
    query: POSTS_QUERY,
  });

  return (
    <main>
      <section className="py-16 px-4">
        <Container className="flex flex-col gap-8">
          <h1 className="font-semibold text-[80px]/[1.5]">
            Unleash your creativity with Quill
          </h1>
          <div className="relative pb-[248px]">
            <div className="bg-amber-950 absolute inset-0 rounded-[32px]" />
            <div className="relative bg-[#F0ECE7] flex flex-col gap-8 pr-8 pb-8 rounded-br-[32px] w-fit">
              <p className="font-semibold text-[24px]/[1.5] inline-block max-w-[450px]">
                Discover eco-friendly, artisanal stationery for all your
                creative needs
              </p>
              <button
                className="bg-black rounded-full px-4 py-2 font-bold text-[16px]/[1.5] text-white inline-block w-fit"
                type="button"
              >
                Shop now
              </button>
            </div>
          </div>
        </Container>
      </section>
      <section className="py-16 px-4">
        <Container className="flex flex-col gap-8">
          <h2>Featured</h2>
        </Container>
      </section>
      <section className="py-16 px-4">
        <Container className="flex flex-col gap-8">
          <Posts posts={posts} />
        </Container>
      </section>
    </main>
  );
}
