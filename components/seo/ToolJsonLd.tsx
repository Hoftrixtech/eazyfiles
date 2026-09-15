import { JsonLd } from "@/components/seo/JsonLd";
import { webApplicationJsonLd } from "@/lib/seo/json-ld";
import type { Tool } from "@/types/tools";

export function ToolJsonLd({ tool }: { tool: Tool }) {
  return <JsonLd data={webApplicationJsonLd(tool)} />;
}
