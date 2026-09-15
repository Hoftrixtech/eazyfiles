export type ToolStatus = "live" | "coming-soon";

export type ToolCategoryId =
  | "image-tools"
  | "pdf-tools"
  | "text-tools"
  | "calculator-tools"
  | "developer-tools"
  | "qr-generator-tools"
  | "ai-tools";

export type ToolIconName =
  | "image-down"
  | "scaling"
  | "crop"
  | "repeat"
  | "images"
  | "file-down"
  | "files"
  | "file-text"
  | "type"
  | "braces"
  | "percent"
  | "calculator"
  | "code"
  | "qr-code"
  | "sparkles";

export interface ToolCategory {
  id: ToolCategoryId;
  slug: string;
  name: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  icon: ToolIconName;
}

export interface Tool {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: ToolCategoryId;
  icon: ToolIconName;
  status: ToolStatus;
  route: string;
  keywords: string[];
  supportedFormats?: string[];
  relatedTools: string[];
  seoTitle: string;
  seoDescription: string;
}
