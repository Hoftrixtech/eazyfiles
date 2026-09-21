import { Google_Sans_Flex } from "next/font/google";

/** Site sans — weights match Tailwind (normal/medium/semibold/bold) and heading styles in globals.css */
export const siteSansFont = Google_Sans_Flex({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans-family",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: true,
});
