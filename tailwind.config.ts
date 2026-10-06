import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        violet: "#8B5CF6",
        cyan: "#06B6D4",
        amber: "#F59E0B",
      },
      fontFamily: {
        body: ["var(--font-jakarta)", "sans-serif"],
        head: ["var(--font-grotesk)", "sans-serif"],
      },
      keyframes: {
        gradientShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: { gradient: "gradientShift 6s ease infinite" },
    },
  },
  plugins: [],
};
export default config;