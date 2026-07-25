import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nexus: {
          navy: "#0f3557",
          blue: "#1b568e",
          steel: "#3f7898",
          sky: "#5ca1dc",
          periwinkle: "#97abe6",
          mist: "#e5ecef",
          ink: "#233242",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
