import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        'foreground-rgb': 'var(--foreground-rgb)',
        'background-main-page': 'var(--background-main-page)',
        'backg-inputs': 'var(--backg-inputs)',
        'backg-inputs-red': 'var(--backg-inputs-red)',
        'backg-container-blue': 'var(--backg-container-blue)',
        'backg-container-gray': 'var(--backg-container-gray)',
        'backg-inputs-submit': 'var(--backg-inputs-submit)',
        'background-start-rgb': 'var(--background-start-rgb)',
        'background-end-rgb': 'var(--background-end-rgb)',
      },
      borderRadius: {
        'inputs': 'var(--border-radius-input)',
      },
      fontSize: {
        'dates': '10px'
      }
    },
  },
  plugins: [],
};
export default config;
