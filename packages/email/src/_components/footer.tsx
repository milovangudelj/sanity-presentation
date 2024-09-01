import { Link, Text } from "@react-email/components";

export function Footer({
  id,
  canUnsubscribe = false,
}: {
  id: string;
  canUnsubscribe?: boolean;
}) {
  return (
    <>
      {canUnsubscribe ? (
        <Text className="text-onyx/40 text-[12px]/[1.1]">
          You are receiving this email because you opted-in to receive updates
          from Quill. If you no longer wish to receive these emails, you can{" "}
          <Link
            href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/unsubscribe/${id}`}
          >
            Unsubscribe
          </Link>
          .
        </Text>
      ) : null}
      <Text className="text-onyx/40 text-[12px]/[1.1]">Quill, Italy</Text>
    </>
  );
}
