import { type ReactNode } from "react";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="w-full max-w-[var(--container-inner-width)] mx-auto">
      <div className={className}>{children}</div>
    </div>
  );
}
