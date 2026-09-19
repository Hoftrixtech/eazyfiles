import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export function createLegalPageMetadata(input: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  return createPageMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
    absoluteTitle: true,
  });
}

export const ABOUT_PAGE_SEO = {
  title: "EazyFiles About Us – Simple Online File Tools",
  description:
    "Learn what EazyFiles is, why we build simple online file and image tools, and where the platform is headed.",
};

export const HOW_IT_WORKS_PAGE_SEO = {
  title: "How EazyFiles Works – Upload, Customize & Download",
  description:
    "See how EazyFiles image tools work: upload your file, choose your settings, and download the result in a few simple steps.",
};

export const CONTACT_PAGE_SEO = {
  title: "Contact EazyFiles – Get in Touch",
  description: "Send a message to the EazyFiles team about our online image tools, your account, or general questions.",
};

export const PRIVACY_PAGE_SEO = {
  title: "EazyFiles Privacy Policy",
  description: "How EazyFiles collects, uses, and protects information when you use our website and image tools.",
};

export const TERMS_PAGE_SEO = {
  title: "EazyFiles Terms of Service",
  description: "Terms that govern your use of the EazyFiles website and online file utilities.",
};

export const DISCLAIMER_PAGE_SEO = {
  title: "EazyFiles Disclaimer",
  description: "Important limitations and responsibilities when using EazyFiles online utility tools.",
};
