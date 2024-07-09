export const baseUrl =
  process.env.NODE_ENV !== "development"
    ? `https://sanity-presentation-website.vercel.app`
    : "http://localhost:3000";
