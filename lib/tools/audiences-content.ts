import { APP_NAME } from "@/lib/constants";

export type AudienceCard = {
  title: string;
  body: string;
};

export type AudiencesSectionContent = {
  eyebrow: string;
  heading: string;
  description: string;
  audiences: [
    AudienceCard,
    AudienceCard,
    AudienceCard,
    AudienceCard,
    AudienceCard,
  ];
};

const DEFAULT_AUDIENCES: AudiencesSectionContent["audiences"] = [
  {
    title: "Website Owners",
    body:
      "Prepare images for websites by reducing file size, adjusting dimensions, or converting image formats.",
  },
  {
    title: "Content Creators",
    body:
      "Resize, crop, compress, and convert images when preparing content for publishing and digital platforms.",
  },
  {
    title: "Businesses",
    body:
      "Handle everyday image tasks for websites, documents, presentations, marketing materials, and other digital work.",
  },
  {
    title: "Students & Professionals",
    body:
      "Prepare images for assignments, documents, presentations, projects, and other professional or academic work.",
  },
  {
    title: "Social Media Users",
    body:
      "Resize, crop, compress, and convert images to prepare them for social media and other online platforms.",
  },
];

export const DEFAULT_AUDIENCES_CONTENT: AudiencesSectionContent = {
  eyebrow: "Built for everyday use",
  heading: "Online Image Tools for Everyday Work",
  description:
    `${APP_NAME} provides practical image tools for anyone who needs to compress, resize, crop, or convert images for digital use.`,
  audiences: DEFAULT_AUDIENCES,
};

const TOOL_AUDIENCES_CONTENT: Partial<Record<string, AudiencesSectionContent>> = {
  "image-compressor": {
    eyebrow: "Built for everyday use",
    heading: "Compress Images for Everyday Digital Work",
    description:
      `${APP_NAME} helps you reduce image file sizes for websites, documents, presentations, social media, and other everyday digital tasks.`,
    audiences: [
      {
        title: "Website Owners",
        body:
          "Reduce image file sizes before adding photos and graphics to websites, helping you prepare lighter image files for web use.",
      },
      {
        title: "Content Creators",
        body:
          "Compress images when preparing photos and graphics for blogs, content platforms, and other digital publishing needs.",
      },
      {
        title: "Businesses",
        body:
          "Reduce image file sizes for websites, presentations, marketing materials, documents, and everyday business use.",
      },
      {
        title: "Students & Professionals",
        body:
          "Compress images when preparing files for assignments, reports, presentations, applications, and professional documents.",
      },
      {
        title: "Social Media Users",
        body:
          "Reduce image file sizes before uploading photos and graphics to social media and other online platforms.",
      },
    ],
  },
  "image-converter": {
    eyebrow: "Built for everyday use",
    heading: "Convert Images for Everyday Digital Work",
    description:
      `${APP_NAME} makes it easy to convert JPG, PNG, and WebP images for websites, content, documents, social media, and other digital uses.`,
    audiences: [
      {
        title: "Website Owners",
        body:
          "Convert images to the format you need when preparing graphics and photos for websites and web pages.",
      },
      {
        title: "Content Creators",
        body:
          "Convert images between popular formats when preparing photos, graphics, and other content for publishing.",
      },
      {
        title: "Businesses",
        body:
          "Convert images for websites, presentations, documents, marketing materials, and everyday digital work.",
      },
      {
        title: "Students & Professionals",
        body:
          "Convert images for assignments, presentations, documents, projects, and other academic or professional work.",
      },
      {
        title: "Social Media Users",
        body:
          "Convert images to supported formats when preparing photos and graphics for social media and other online platforms.",
      },
    ],
  },
  "image-to-pdf": {
    eyebrow: "Built for everyday use",
    heading: "Turn Images Into PDFs for Everyday Work",
    description:
      `${APP_NAME} helps you combine JPG, PNG, and WebP images into a single PDF for sharing, printing, and documentation.`,
    audiences: [
      {
        title: "Office & Admin Work",
        body:
          "Bundle scanned photos, receipts, or screenshots into one PDF for email, records, or documentation.",
      },
      {
        title: "Students",
        body:
          "Combine assignment photos, scanned pages, or project images into a single PDF for submission.",
      },
      {
        title: "Freelancers",
        body:
          "Combine client proofs, reference images, or project visuals into one PDF instead of sending multiple image attachments.",
      },
      {
        title: "Small Businesses",
        body:
          "Create simple PDF documents from product photos, receipts, records, or marketing graphics.",
      },
      {
        title: "Anyone Sharing Photos",
        body: "Combine a set of images into a single PDF that is easy to share, download, and organize.",
      },
    ],
  },
  "image-cropper": {
    eyebrow: "Built for everyday use",
    heading: "Online Image Cropping for Everyday Work",
    description:
      `${APP_NAME} provides a simple online image cropper for adjusting and preparing images for websites, content, documents, social media, and other digital uses.`,
    audiences: [
      {
        title: "Website Owners",
        body:
          "Crop images to fit website layouts, page sections, banners, and other web content.",
      },
      {
        title: "Content Creators",
        body: "Crop and frame images for blog posts, videos, graphics, and other digital content.",
      },
      {
        title: "Businesses",
        body:
          "Prepare images for websites, presentations, marketing materials, documents, and business content.",
      },
      {
        title: "Students & Professionals",
        body:
          "Crop images for assignments, presentations, documents, projects, and other professional or academic work.",
      },
      {
        title: "Social Media Users",
        body:
          "Crop images to focus on the content you want to share across social media and other online platforms.",
      },
    ],
  },
};

export function getAudiencesContent(toolSlug?: string): AudiencesSectionContent {
  if (toolSlug && TOOL_AUDIENCES_CONTENT[toolSlug]) {
    return TOOL_AUDIENCES_CONTENT[toolSlug]!;
  }
  return DEFAULT_AUDIENCES_CONTENT;
}
