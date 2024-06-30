"use client";

import { useEffect, useState, type ReactNode } from "react";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";

export function PreviewOverlay({ children }: { children: ReactNode }) {
  const isDraftMode = draftMode().isEnabled;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window === parent) setVisible(true);
  }, []);

  return isDraftMode && visible ? (
    <div className="absolute bottom-2 left-2 right-2 top-2 flex flex-col gap-2">
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-zinc-100">
        <div className="flex-1 overflow-y-auto">{children}</div>
        <VisualEditing />
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
