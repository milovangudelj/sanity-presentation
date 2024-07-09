import { Link, Text } from "@react-email/components";

import { baseUrl } from "../_lib";

export function Unsubscribe({ id }: { id: string }) {
  return (
    <>
      <Text className="text-onyx/40 text-[12px]/[1.1]">
        You are receiving this email because you opted-in to receive updates
        from Quill. If you no longer wish to receive these emails, you can{" "}
        <Link href={`${baseUrl}/unsubscribe/${id}`}>Unsubscribe</Link>.
      </Text>
      <Text className="text-onyx/40 text-[12px]/[1.1]">Quill, Italy</Text>
    </>
  );
}
