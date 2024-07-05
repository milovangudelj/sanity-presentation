"use client";

import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import { ArrowRight, Check, Spinner } from "~/components/icons";
import { subscribeContact } from "~/lib/actions";

function SubmitIcon({
  status,
  pending,
}: {
  status: "idle" | "success" | "failed";
  pending: boolean;
}) {
  if (pending) {
    return <Spinner size={16} className="animate-spin" />;
  }

  if (status === "success") {
    return <Check size={16} className="text-green-500" />;
  }

  return <ArrowRight size={16} />;
}

const initialState: {
  status: "idle" | "success" | "failed";
  message: string;
} = {
  status: "idle",
  message: "",
};

function SubmitButton({
  variant = "normal",
  status,
}: {
  variant?: "normal" | "inverted";
  status: "idle" | "success" | "failed";
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className={clsx(
        "p-3 rounded-full border focus-visible:outline-none transition",
        {
          "text-black/40 border-black/10 hover:border-black/40 focus-visible:border-black/40 hover:text-black":
            variant === "normal",
          "text-white/40 border-white/10 hover:border-white/40 focus-visible:border-white/40 hover:text-white":
            variant === "inverted",
        }
      )}
    >
      <span className="sr-only">
        {pending ? "Subscribing..." : "Subscribe"}
      </span>
      <SubmitIcon status={status} pending={pending} />
    </button>
  );
}

export function MailingListForm({
  variant = "normal",
}: {
  variant?: "normal" | "inverted";
}) {
  const [status, setStatus] = useState<"idle" | "success" | "failed">("idle");
  const [state, formAction] = useFormState(subscribeContact, initialState);

  useEffect(() => {
    setStatus(state.status);
  }, [state.status]);

  useEffect(() => {
    if (status === "success") {
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  }, [status]);

  return (
    <form action={formAction} className="max-w-[360px] w-full">
      <div
        className={clsx(
          "relative flex border w-full p-1.5 rounded-full transition",
          {
            "bg-[var(--color-bg)] text-black border-black/10":
              variant === "normal",
            "bg-transparent text-white border-white/10": variant === "inverted",
          }
        )}
      >
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          type="email"
          name="email"
          className={clsx(
            "bg-transparent mx-3 text-[16px]/[1.1] focus-visible:outline-none font-normal flex-1 transition",
            {
              "placeholder-black/40": variant === "normal",
              "placeholder-white/40": variant === "inverted",
            }
          )}
          placeholder="E-mail"
        />
        <SubmitButton variant={variant} status={status} />
      </div>
      <AnimatePresence>
        {status !== "idle" ? (
          <motion.p
            aria-live="polite"
            role="status"
            initial={{ height: 0, opacity: 0 }}
            exit={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
          >
            <span
              className={clsx("text-[12px]/[1.1] mx-3 pt-1.5 px-1.5", {
                "text-green-500": status === "success",
                "text-red-500": status === "failed",
              })}
            >
              {state.message}
            </span>
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
