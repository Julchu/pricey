import { Config } from "tailwindcss";

// Replaces @radix-ui/colors blackA, mauve, violet scales
const blackA = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [
    `blackA${i + 1}`,
    `rgba(0,0,0,${(0.05 * (i + 1)).toFixed(2)})`,
  ]),
);

const mauve = {
  mauve1: "#fdfcfd",
  mauve2: "#faf9fb",
  mauve3: "#f2eff3",
  mauve4: "#eae7ec",
  mauve5: "#e3dfe6",
  mauve6: "#dbd8e0",
  mauve7: "#d0cdd7",
  mauve8: "#bcbac7",
  mauve9: "#8e8c99",
  mauve10: "#84828e",
  mauve11: "#65636d",
  mauve12: "#211f26",
};

const violet = {
  violet1: "#fdfcfe",
  violet2: "#fbfaff",
  violet3: "#f5f2ff",
  violet4: "#ede9fe",
  violet5: "#e4defc",
  violet6: "#d7cff9",
  violet7: "#c4b8f3",
  violet8: "#aa99ec",
  violet9: "#6e56cf",
  violet10: "#644fc1",
  violet11: "#5746af",
  violet12: "#20134b",
};

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,[PERSON_NAME],jsx,tsx,mdx}",
    "./src/**/*.{js,[PERSON_NAME],jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...mauve,
        ...violet,
        "background-grey": "#F5F7FA",
        "card-white": "#FFFFFF",
        "dark-background-navy": "#0F172A",
        "dark-background-card": "#111827",
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
        slideDown: {
          from: { height: "0px" },
          to: { height: "var(--accordion-panel-height)" },
        },
        slideUp: {
          from: { height: "var(--accordion-panel-height)" },
          to: { height: "0px" },
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
        "accordion-slide-down":
          "slideDown 400ms cubic-bezier(0.87, 0, 0.13, 1)",
        "accordion-slide-up": "slideUp 400ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
};

export default config;