import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
export default config;
