import { Card } from "@/components/ui/Card";

export function RecentFilesEmpty() {
  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-base font-semibold">Recent files</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        EazyFiles processes images on demand and does not keep copies on the server. Download your results right after
        each tool finishes — they will not appear here for later download.
      </p>
    </Card>
  );
}
