import clsx from "clsx";

import { ArrowRight } from "~/components/icons";

export function MailingListForm({
  variant = "normal",
}: {
  variant?: "normal" | "inverted";
}) {
  return (
    <form
      className={clsx(
        "flex gap-3  border max-w-[360px] w-full p-1.5 rounded-full transition",
        {
          "bg-[var(--color-bg)] text-black border-black/10":
            variant === "normal",
          "bg-transparent text-white border-white/10": variant === "inverted",
        }
      )}
    >
      <input
        type="email"
        className={clsx(
          "bg-transparent ml-3 text-[16px]/[1.1] focus-visible:outline-none font-normal flex-1 transition",
          {
            "placeholder-black/40": variant === "normal",
            "placeholder-white/40": variant === "inverted",
          }
        )}
        placeholder="E-mail"
      />
      <button
        type="submit"
        className={clsx("p-3 rounded-full border transition", {
          "text-black/40 border-black/10 hover:border-black/40 hover:text-black":
            variant === "normal",
          "text-white/40 border-white/10 hover:border-white/40 hover:text-white":
            variant === "inverted",
        })}
      >
        <span className="sr-only">Subscribe</span>
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
