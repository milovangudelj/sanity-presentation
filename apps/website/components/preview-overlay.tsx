"use client";

import { useEffect, useState, type ReactNode } from "react";

export function PreviewOverlay({
  children,
  isDraftMode,
}: {
  children: ReactNode;
  isDraftMode: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window !== parent) return;

    setVisible(isDraftMode);
    document.body.style.overflowY = isDraftMode ? "hidden" : "auto";
  }, [isDraftMode]);

  return visible ? (
    <div className="absolute inset-0 p-2 bg-[#13141b] flex flex-col gap-2">
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-zinc-100">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
      <div className="flex flex-none select-none items-center justify-between bg-[#13141b] font-geist text-[14px]/[16px] text-white">
        <div className="flex items-center">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <span className="ml-2 inline-block">Preview</span>
        </div>
        <a
          className="inline-flex h-8 items-center rounded-md bg-[hsla(0,0%,93%,1)] px-1.5 font-medium text-[#0a0a0a] transition hover:bg-[#ccc]"
          href="/api/disable-draft"
        >
          <span className="inline-block px-1.5">Exit preview</span>
        </a>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}
