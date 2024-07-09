import { Container } from "~/components/container";

export default async function UnsubscribedPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main>
      <section className="py-16 px-4">
        <Container className="flex flex-col gap-8">
          <h1>Unsubscribed! {params.id}</h1>
        </Container>
      </section>
    </main>
  );
}
