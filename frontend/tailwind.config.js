/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        background: "#FBFBFB",
        accent: {
          pink: "#D462AD",
          blue: "#00C6D7",
        },
        ring: "#a6d5fa",
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
