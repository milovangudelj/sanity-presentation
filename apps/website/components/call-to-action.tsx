import { Container } from "~/components/container";
import { MailingListForm } from "~/components/mailing-list-form";

export function CallToAction() {
  return (
    <section className="py-16 px-4 before:bg-planes before:absolute before:inset-0 before:-z-10 before:opacity-50 relative">
      <Container className="flex flex-col gap-8 items-center">
        <h2 className="font-medium text-[48px]/[1.1]">Stay in touch</h2>
        <p className="font-normal text-[16px]/[1.1] text-black/70">
          Be the first to know about special offers, new product launches, and
          events.
        </p>
        <MailingListForm />
      </Container>
    </section>
  );
}
