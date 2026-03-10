import localFont from "next/font/local";

export const jost = localFont({
  src: [
    {
      path: "../assets/fonts/jost/Jost-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/jost/Jost-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/jost/Jost-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/jost/Jost-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-jost",
});
