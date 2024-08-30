import { headers } from "next/headers";

import { handleSanityWebhook } from "./handleSanityWebhook";
import { handleResendWebhook } from "./handleResendWebhook";

export async function POST(req: Request) {
  // return Response.json(
  //   { status: "received" },
  //   {
  //     status: 200,
  //   }
  // );

  const headersList = headers();
  const source = headersList.get("request-source");

  if (source === "sanity") {
    return handleSanityWebhook(await req.json());
  } else {
    return handleResendWebhook(await req.json());
  }
}
