import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";

import { geist, inter } from "~/styles/fonts";
import "~/styles/globals.css";

import { PreviewOverlay } from "~/components/preview-overlay";
import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        data-preview={draftMode().isEnabled ? "true" : "false"}
        className={`${inter.variable} ${geist.variable} min-h-dvh flex flex-col overflow-x-hidden hide-scrollbar bg-[#F0ECE7] font-sans text-black antialiased`}
      >
        <PreviewOverlay isDraftMode={draftMode().isEnabled}>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <VisualEditing />
        </PreviewOverlay>
      </body>
    </html>
  );
}
