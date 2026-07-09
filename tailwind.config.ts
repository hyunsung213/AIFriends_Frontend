import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#78B986", // Soft Green
          hover: "#619D6F",
          light: "#EAF4EC",
        },
        gray: {
          50: "#FAF9F7",
          100: "#F4F2EC",
          200: "#E8E4D9",
          300: "#D6D1C4",
          400: "#B8B3A7",
          500: "#999589",
          600: "#7A776D",
          700: "#5C5951",
          800: "#3D3B36",
          900: "#1F1E1B",
        },
        background: "#F8F4EC", // Warm ivory/beige
        surface: "#FFFFFF", // Card background
        danger: {
          DEFAULT: "#E57373", // Soft Red
          light: "#FFEBEE"
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
