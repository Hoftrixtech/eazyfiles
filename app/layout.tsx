import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { FinalCta } from "@/components/sections/FinalCta";
import { APP_NAME } from "@/lib/constants";
import { DEFAULT_OG_IMAGE_PATH, HOME_PAGE_SEO, absoluteUrl, getSiteUrl } from "@/lib/seo";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { siteSansFont } from "@/lib/fonts";
import { stripExtensionAttrsScript } from "@/lib/strip-extension-attrs-script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: HOME_PAGE_SEO.title,
    template: `%s | ${APP_NAME}`,
  },
  description: HOME_PAGE_SEO.description,
  applicationName: APP_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: APP_NAME,
    title: HOME_PAGE_SEO.title,
    description: HOME_PAGE_SEO.description,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
        width: 512,
        height: 512,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: HOME_PAGE_SEO.title,
    description: HOME_PAGE_SEO.description,
    images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={siteSansFont.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <script dangerouslySetInnerHTML={{ __html: stripExtensionAttrsScript }} />
        <GoogleAnalytics />
      </head>
      <body className="site-canvas min-h-screen font-sans text-foreground antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:shadow-sm"
        >
          Skip to content
        </a>
        <div id="main">{children}</div>
        <FinalCta />
        <Footer />
      </body>
    </html>
  );
}
