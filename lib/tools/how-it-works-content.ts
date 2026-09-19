export type HowItWorksStep = {
  title: string;
  body: string;
};

export type HowItWorksContent = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  steps: [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};

export const DEFAULT_HOW_IT_WORKS_CONTENT: HowItWorksContent = {
  eyebrow: "How It Works",
  title: "How It Works",
  accent: "Upload, Customize & Download.",
  description:
    "Choose an EazyFiles image tool, upload your image, adjust the available settings, and download the processed result. The workflow makes it simple to compress, resize, crop, or convert images online.",
  steps: [
    {
      title: "Upload Your Image",
      body: "Select a JPG, PNG, or WebP image from your device and upload it to the tool you want to use.",
    },
    {
      title: "Choose Your Settings",
      body:
        "Adjust the available options, such as target file size, image dimensions, crop area, or output format.",
    },
    {
      title: "Download Your Image",
      body: "Start the selected process and download your processed image when it is ready.",
    },
  ],
};

const TOOL_HOW_IT_WORKS_CONTENT: Partial<Record<string, HowItWorksContent>> = {
  "image-compressor": {
    eyebrow: "How It Works",
    title: "How It Works",
    accent: "Compress Images in 3 Simple Steps.",
    description:
      "Upload your image, choose a target file size and output format, then download the compressed result. EazyFiles makes it simple to reduce JPG, PNG, and WebP file sizes online.",
    steps: [
      {
        title: "Upload Your Image",
        body: "Choose a JPG, PNG, or WebP image from your device and upload it to the Image Compressor.",
      },
      {
        title: "Choose Your Settings",
        body:
          "Select a target size such as 50 KB, 100 KB, 200 KB, 500 KB, or 1 MB, or enter a custom size and output format.",
      },
      {
        title: "Download Your Image",
        body: "Start the compression process and download your compressed image when it is ready.",
      },
    ],
  },
  "image-converter": {
    eyebrow: "How It Works",
    title: "How It Works",
    accent: "Convert Images in 3 Simple Steps",
    description:
      "Upload your image, choose an output format and quality setting, then download the converted file. EazyFiles makes it simple to convert JPG, PNG, and WebP images online.",
    steps: [
      {
        title: "Upload Your Image",
        body: "Select a JPG, PNG, or WebP image from your device and upload it to the Image Converter.",
      },
      {
        title: "Choose Your Format",
        body:
          "Select JPG, PNG, or WebP as your output format and choose the quality setting that fits your needs.",
      },
      {
        title: "Download Your Image",
        body: "Start the conversion and download your converted image when processing is complete.",
      },
    ],
  },
  "image-cropper": {
    eyebrow: "How It Works",
    title: "How It Works",
    accent: "Crop Images in 3 Simple Steps.",
    description:
      "Upload your image, select the area you want to keep, choose your crop settings, and download the cropped result. EazyFiles makes it simple to crop JPG, PNG, and WebP images online.",
    steps: [
      {
        title: "Upload Your Image",
        body: "Choose a JPG, PNG, or WebP image from your device and upload it to the Image Cropper.",
      },
      {
        title: "Select Your Crop Area",
        body:
          "Adjust the crop area to keep the part of the image you need, with available aspect ratio options when required.",
      },
      {
        title: "Download Your Image",
        body: "Apply your crop and download the resulting image in your selected output format.",
      },
    ],
  },
  "image-resizer": {
    eyebrow: "How It Works",
    title: "How It Works",
    accent: "Resize Images in 3 Simple Steps.",
    description:
      "Upload your image, choose the dimensions or scaling option you need, and download the resized file. EazyFiles makes it simple to resize JPG, PNG, and WebP images online.",
    steps: [
      {
        title: "Upload Your Image",
        body: "Choose a JPG, PNG, or WebP image from your device and upload it to the Image Resizer.",
      },
      {
        title: "Set Your Dimensions",
        body: "Enter a custom width and height, scale the image by percentage, or choose a common size preset.",
      },
      {
        title: "Download Your Image",
        body: "Apply your resize settings and download the resized image in your selected output format.",
      },
    ],
  },
};

export function getHowItWorksContent(toolSlug?: string): HowItWorksContent {
  if (toolSlug && TOOL_HOW_IT_WORKS_CONTENT[toolSlug]) {
    return TOOL_HOW_IT_WORKS_CONTENT[toolSlug]!;
  }
  return DEFAULT_HOW_IT_WORKS_CONTENT;
}
