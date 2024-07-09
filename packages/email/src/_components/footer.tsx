import { Link, Text } from "@react-email/components";

import { baseUrl } from "../_lib";

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
          <Link href={`${baseUrl}/unsubscribe/${id}`}>Unsubscribe</Link>.
        </Text>
      ) : null}
      <Text className="text-onyx/40 text-[12px]/[1.1]">Quill, Italy</Text>
    </>
  );
}
