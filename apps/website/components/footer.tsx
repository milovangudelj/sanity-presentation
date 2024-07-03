import Link from "next/link";
import { Container } from "~/components/container";
import { MailingListForm } from "~/components/mailing-list-form";
import { Feather } from "~/components/icons";

export async function Footer() {
  return (
    <footer className="bg-[#523015] text-white">
      <section className="py-16 px-4">
        <Container className="flex flex-col gap-16">
          <div className="flex gap-[128px]">
            <div className="flex-1 max-w-[360px] flex flex-col gap-8">
              <Link href={"/"} className="flex gap-4 items-center">
                <Feather size={48} />
                <span className="font-medium text-[60px]/[1.1]">Quill</span>
              </Link>
              <span className="font-normal text-[16px]/[1.1] text-white/70">
                Be the first to know about special offers, new product launches,
                and events.
              </span>
              <MailingListForm variant="inverted" />
            </div>
            <nav className="flex-1">nav</nav>
          </div>
          <div className="font-medium text-white/40 text-[12px]/[1.1]">
            &copy; {new Date().getFullYear()} Quill Inc. ・{" "}
            <Link href={"/tos"} className="hover:text-white/70 transition">
              Terms of Service
            </Link>{" "}
            ・{" "}
            <Link href={"/privacy"} className="hover:text-white/70 transition">
              Privacy Policy
            </Link>
          </div>
        </Container>
      </section>
    </footer>
  );
}