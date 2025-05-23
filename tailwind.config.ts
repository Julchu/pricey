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
      shadow: {
        normal: `rgba(99, 99, 99, 0.2) 0px 2px 8px 0px`,
        hover: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
        focus: `rgba(0, 0, 0, 0.35) 0px 5px 15px`,
        under: `rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px`,
      },
      keyframes: {
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
        // Works with custom keyframe names directly; animation name cannot have capitals
        "slide-down-and-fade":
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left-and-fade":
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up-and-fade":
          "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right-and-fade":
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
};

export default config;