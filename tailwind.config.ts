import { blackA, mauve, violet } from "@radix-ui/colors";
import { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...mauve,
        ...violet,
      },
      keyframes: {
        // Works
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },

        test123: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },

        // Doesn't work
        waggleKF: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            // "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "none",
            // "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },

        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        // Works with custom keyframe names directly
        wiggle: "wiggle 3s infinite",
        "fade-test": "fadeIn 3s infinite ease-in",
        test456: "test123 3s infinite",
        spin2: "var(--animate-spin)",

        // Doesn't work
        "accordion-down1": "accordion-down 3s infinite",
        "accordion-down2": "var(--animate-accordion-down) 0.2s ease-out",
        "accordion-up": "var(--animate-accordion-up) 0.2s ease-out",
        spin3: "var(--animate-spin) 0.2s ease-out",
        "slide-test": "var(--animate-accordion-down)",
        "slide-test2": "var(--animate-slide-up) 0.2s ease-out",

        waggle: "waggleKF 3s infinite",
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
};

export default config;