import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-2": "rgb(var(--accent2) / <alpha-value>)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--border) / 0.7), 0 10px 30px rgb(0 0 0 / 0.35)"
      }
    }
  },
  plugins: []
};

export default config;


