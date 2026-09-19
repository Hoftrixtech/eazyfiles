import { ANONYMOUS_COMPRESSOR_LIMIT } from "@/lib/constants";

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContent = {
  title: string;
  titleAccent?: string;
  description: string;
  items: readonly FaqItem[];
};

const DEFAULT_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "What is EazyFiles?",
    answer:
      "EazyFiles is an online file tools platform designed for common image and file tasks. It currently provides an image compressor, with additional image, PDF, and file tools planned for the future.",
  },
  {
    question: "How does image compression work?",
    answer:
      "EazyFiles reduces the file size of your image by compressing it toward your selected target size. You can choose a preset size or enter a custom target size, then download the processed image.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "The Image Compressor supports JPG, PNG, and WebP images. You can also choose the output format when available, including JPG, PNG, WebP, or the original format.",
  },
  {
    question: "How do I compress an image to a specific size?",
    answer:
      'Upload your image to the Image Compressor, select a target size such as 50 KB, 100 KB, 200 KB, 500 KB, or 1 MB, or enter a custom size. Then select your output format and click "Compress Image."',
  },
  {
    question: "Do I need an account to compress an image?",
    answer:
      "No. You can start compressing images without creating an account. EazyFiles currently allows up to 5 successful image compressions for users without an account.",
  },
  {
    question: "How many images can I compress without logging in?",
    answer:
      "You can complete up to 5 successful image compressions without logging in. Each successfully compressed image counts toward the available limit. After reaching the limit, you can sign in to continue using EazyFiles.",
  },
  {
    question: "Is EazyFiles free?",
    answer:
      "Yes. EazyFiles currently provides free access to its available image compression functionality. Users can start without an account, while signing in provides access beyond the anonymous compression limit.",
  },
];

export const DEFAULT_FAQ_CONTENT: FaqContent = {
  title: "Frequently Asked Questions About",
  titleAccent: "EazyFiles",
  description:
    "Find answers about EazyFiles, image compression, supported image formats, file size limits, and using our online image tools.",
  items: DEFAULT_FAQ_ITEMS,
};

const TOOL_FAQ_CONTENT: Partial<Record<string, FaqContent>> = {
  "image-compressor": {
    title: "Frequently Asked Questions About Image Compression",
    description:
      "Find answers about compressing images online, target file sizes, supported formats, file limits, and using the EazyFiles Image Compressor.",
    items: [
      {
        question: "What is an image compressor?",
        answer:
          "An image compressor reduces the file size of an image while keeping it usable for websites, documents, social media, and other digital purposes. EazyFiles lets you choose a target file size and output format.",
      },
      {
        question: "How do I compress an image online?",
        answer:
          'Upload your JPG, PNG, or WebP image to the EazyFiles Image Compressor, choose your target file size and output format, then select "Compress Image" to process and download the result.',
      },
      {
        question: "Can I compress an image to a specific KB size?",
        answer:
          "Yes. You can choose a target size of 50 KB, 100 KB, 200 KB, 500 KB, or 1 MB, or enter a custom target size.",
      },
      {
        question: "What image formats does EazyFiles support?",
        answer:
          "The Image Compressor supports JPG, PNG, and WebP images. You can also select an available output format such as JPG, WebP, PNG, or the original format.",
      },
      {
        question: "What is the maximum image size I can upload?",
        answer: "The Image Compressor supports image files up to 10 MB per file.",
      },
      {
        question: "Does the compressor produce the exact target file size?",
        answer:
          "The compressor aims to produce an image at or below the selected target size. The final file size can vary depending on the original image and selected output format.",
      },
      {
        question: "How many images can I compress without signing in?",
        answer: `You can complete up to ${ANONYMOUS_COMPRESSOR_LIMIT} successful image compressions without signing in. Each successfully compressed image counts toward the available anonymous usage limit.`,
      },
      {
        question: "Are uploaded images stored?",
        answer:
          "Uploaded image files are processed temporarily and removed after processing. Image files are not stored in the database.",
      },
      {
        question: "Can I compress multiple images?",
        answer:
          "Yes. Multiple JPG, PNG, or WebP images can be uploaded when using the Image Compressor, and each successfully compressed image uses one available compression.",
      },
    ],
  },
  "image-converter": {
    title: "Frequently Asked Questions About EazyFiles Image Converter",
    description:
      "Find answers about converting images online, supported image formats, output quality, file size limits, and using the EazyFiles Image Converter.",
    items: [
      {
        question: "What is the EazyFiles Image Converter?",
        answer:
          "EazyFiles Image Converter lets you convert JPG, PNG, and WebP images online between supported formats. Upload an image, choose your output format and quality, then download the converted file.",
      },
      {
        question: "Which image formats can I convert?",
        answer:
          "The Image Converter supports JPG, PNG, and WebP images. You can choose JPG, PNG, or WebP as the output format.",
      },
      {
        question: "How do I convert an image online?",
        answer:
          "Upload your JPG, PNG, or WebP image, select the output format, choose the available quality setting, and start the conversion. You can then download the converted image.",
      },
      {
        question: "Can I convert JPG to PNG or WebP?",
        answer:
          "Yes. You can upload a JPG image and convert it to PNG or WebP using the EazyFiles Image Converter.",
      },
      {
        question: "Can I convert PNG to JPG or WebP?",
        answer:
          "Yes. PNG images can be converted to JPG or WebP. Choose your preferred output format before starting the conversion.",
      },
      {
        question: "Can I convert WebP to JPG or PNG?",
        answer:
          "Yes. You can upload a WebP image and convert it to JPG or PNG, depending on the output format you need.",
      },
      {
        question: "Does image conversion change the image dimensions?",
        answer:
          "No. The Image Converter keeps the same pixel dimensions unless you use another tool, such as the Image Resizer or Image Cropper, to change the image.",
      },
      {
        question: "Can I choose the image quality?",
        answer:
          "Yes. The Image Converter provides High, Balanced, and Smaller File options. The available quality settings can affect the final file size and image quality.",
      },
      {
        question: "What is the maximum image size?",
        answer: "The Image Converter supports image files up to 10 MB per upload.",
      },
      {
        question: "Do I need an account to use the Image Converter?",
        answer: "Yes. You need to create or sign in to a free EazyFiles account to use the Image Converter.",
      },
      {
        question: "Is the EazyFiles Image Converter free?",
        answer: "Yes. The Image Converter is available with a free EazyFiles account.",
      },
      {
        question: "Are uploaded images stored?",
        answer:
          "Uploaded images are processed for the conversion task and are handled according to the EazyFiles file-processing and privacy practices.",
      },
    ],
  },
  "image-cropper": {
    title: "Frequently Asked Questions About Image Cropping",
    description:
      "Find answers about cropping images online, supported formats, aspect ratios, output options, and using the EazyFiles Image Cropper.",
    items: [
      {
        question: "What is the EazyFiles Image Cropper?",
        answer:
          "EazyFiles Image Cropper is an online tool that lets you crop JPG, PNG, and WebP images. Upload an image, adjust the crop area, choose your preferred output format, and download the cropped image.",
      },
      {
        question: "How do I crop an image online?",
        answer:
          "Upload your JPG, PNG, or WebP image to the Image Cropper, adjust the crop area to select the part you want to keep, choose an output format, and download the cropped image.",
      },
      {
        question: "Can I crop an image to a specific aspect ratio?",
        answer:
          "Yes. The Image Cropper supports fixed aspect ratios such as 1:1 and 16:9, along with freeform cropping when you want to select your own crop area.",
      },
      {
        question: "What image formats does the Image Cropper support?",
        answer:
          "The Image Cropper supports JPG, PNG, and WebP images. You can keep the original format or choose JPG, PNG, or WebP as the output format.",
      },
      {
        question: "Can I crop an image without changing its format?",
        answer:
          "Yes. Select the Original output option to keep the image format when downloading your cropped image.",
      },
      {
        question: "What is the maximum image size I can upload?",
        answer: "The Image Cropper supports images up to 10 MB per file.",
      },
      {
        question: "Do I need an account to use the Image Cropper?",
        answer: "Yes. You need to sign in or create a free EazyFiles account to use the Image Cropper.",
      },
      {
        question: "Can I crop images for social media or websites?",
        answer:
          "Yes. You can use the Image Cropper to select the area you need when preparing images for social media, websites, documents, presentations, and other digital content.",
      },
    ],
  },
  "image-resizer": {
    title: "Frequently Asked Questions About Image Resizing",
    description:
      "Find answers about resizing images online, supported formats, custom dimensions, aspect ratio, file limits, and using the EazyFiles Image Resizer.",
    items: [
      {
        question: "How do I resize an image online?",
        answer:
          "Upload your JPG, PNG, or WebP image to the EazyFiles Image Resizer. Set your desired width and height, choose a percentage or preset size, then download the resized image.",
      },
      {
        question: "Can I resize JPG, PNG, and WebP images?",
        answer:
          "Yes. The Image Resizer supports JPG, PNG, and WebP images. Available output format options can also include JPG, PNG, WebP, or the original format.",
      },
      {
        question: "Can I set a custom image width and height?",
        answer:
          "Yes. You can enter a custom width and height in pixels. When Maintain Aspect Ratio is enabled, changing one dimension automatically adjusts the other.",
      },
      {
        question: "Can I resize an image by percentage?",
        answer:
          "Yes. You can scale an image by percentage using the available options, including 25%, 50%, 75%, and 100%.",
      },
      {
        question: "What image sizes can I choose?",
        answer:
          "You can enter custom dimensions or choose from available presets such as 1920 × 1080, 1280 × 720, 1080 × 1080, 1080 × 1350, 1080 × 1920, and 800 × 600.",
      },
      {
        question: "Does the Image Resizer maintain the aspect ratio?",
        answer:
          "Yes. You can enable Maintain Aspect Ratio to keep the original proportions of your image while changing its dimensions.",
      },
      {
        question: "Is there a file size limit for image resizing?",
        answer: "The Image Resizer supports image files up to 10 MB per file.",
      },
      {
        question: "Can I resize multiple images?",
        answer:
          "Yes. Multiple images can be uploaded when supported by the Image Resizer, allowing you to process more than one image in the same workflow.",
      },
    ],
  },
};

export function getFaqContent(toolSlug?: string): FaqContent {
  if (toolSlug && TOOL_FAQ_CONTENT[toolSlug]) {
    return TOOL_FAQ_CONTENT[toolSlug]!;
  }
  return DEFAULT_FAQ_CONTENT;
}
