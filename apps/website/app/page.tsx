import { Container } from "~/components/container";
import { FeaturedProductsList } from "~/components/fetured-products";
import { LatestArticlesList } from "~/components/latest-articles";
import { CallToAction } from "~/components/call-to-action";

export default async function Home() {
  return (
    <main>
      <section className="py-16 px-4">
        <Container className="flex flex-col gap-8">
          <h1 className="font-semibold text-[80px]/[1.5]">
            Unleash your creativity with Quill
          </h1>
          <div className="relative pb-[248px]">
            <div className="bg-[#523015] absolute inset-0 rounded-3xl" />
            <div className="relative bg-[#F0ECE7] before:absolute before:top-0 before:left-full before:bg-transparent before:w-12 before:h-12 before:rounded-full before:shadow-[-1.5rem_-1.5rem_0_0_#F0ECE7] after:absolute after:top-full after:left-0 after:bg-transparent after:w-12 after:h-12 after:rounded-full after:shadow-[-1.5rem_-1.5rem_0_0_#F0ECE7] flex flex-col gap-8 pr-8 pb-8 rounded-br-3xl w-fit">
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
          <h2 className="font-medium text-[48px]/[1.1]">Featured</h2>
          <FeaturedProductsList />
        </Container>
      </section>
      <section className="py-16 px-4">
        <Container className="flex flex-col gap-8">
          <h2 className="font-medium text-[48px]/[1.1]">Latest articles</h2>
          <LatestArticlesList />
        </Container>
      </section>
      <CallToAction />
    </main>
  );
}
