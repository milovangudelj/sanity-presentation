import { Card } from "@repo/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card title="Docs" href="https://nextjs.org/docs">
        Visit Next.js&apos; docs
      </Card>
    </main>
  );
}
