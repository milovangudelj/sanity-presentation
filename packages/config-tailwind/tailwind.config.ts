import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        planes:
          "linear-gradient(to bottom, var(--color-bg), transparent 25% 75%, var(--color-bg)), url('/images/planes-pattern.png')",
      },
    },
  },
  plugins: [],
};
export default config;
