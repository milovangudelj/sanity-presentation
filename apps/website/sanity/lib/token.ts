import "server-only";

import { experimental_taintUniqueValue as taintUniqueValue } from "react"; // Not yet available in React's latest stable release (18.3.1)

export const token = process.env.SANITY_API_READ_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_API_READ_TOKEN");
}

taintUniqueValue(
  "Do not pass the sanity API read token to the client.",
  process,
  token
);
