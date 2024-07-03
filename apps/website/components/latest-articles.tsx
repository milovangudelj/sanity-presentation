import { type SanityDocument } from "next-sanity";
import Image from "next/image";

import { sanityFetch } from "~/sanity/lib/fetch";
import { imageBuilder, urlForImage } from "~/sanity/lib/image";
import { POSTS_QUERY } from "~/sanity/lib/queries";

export async function LatestArticlesList() {
  const posts = await sanityFetch<SanityDocument[]>({
    query: POSTS_QUERY,
  });

  return (
    <ul className="flex gap-8">
      {posts.map((post) => (
        <li key={post._id} className="flex-1">
          <Article data={post} />
        </li>
      ))}
    </ul>
  );
}

function Article({ data }: { data: SanityDocument }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[300px] bg-[#523015] rounded-2xl overflow-hidden object-center object-cover">
        <span className="inline-block bg-black text-white absolute bottom-0 left-0 rounded-tr-2xl py-1.5 px-3 font-medium text-[12px]/[1.5]">
          {data.category}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-[32px]/[1.5]">{data.title}</span>
        <div className="flex gap-2">
          <Image
            src={imageBuilder
              .image(data.author.image)
              .fit("crop")
              .width(64)
              .height(64)
              .quality(100)
              .url()}
            alt={data.author.image.alt}
            quality={100}
            blurDataURL={data.author.image.asset.metadata.lqip}
            placeholder="blur"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-[12px]/[1.5] text-black/70">
              {data.author.firstName} {data.author.lastName.split("")[0]}.
            </span>
            <span className="text-[12px]/[1.1] text-black/40">
              {data.author.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
