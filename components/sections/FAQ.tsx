import type { ReactNode } from "react";
import { LiveToolLink } from "@/components/tools/LiveToolLink";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const faqs: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "What is EazyFiles?",
    answer:
      "EazyFiles is a collection of simple online file tools. Start with image compression, resizing, cropping and format conversion in your browser.",
  },
  {
    question: "How does image compression work?",
    answer:
      "Upload an image, choose a target file size and output format. EazyFiles processes the file on the server and returns a compressed download.",
  },
  {
    question: "What image formats are supported?",
    answer: (
      <>
        JPG, PNG and WebP for upload and output. To change formats without targeting a file size, use the{" "}
        <LiveToolLink slug="image-converter" />.
      </>
    ),
  },
  {
    question: "How do I compress an image to a specific size?",
    answer:
      "Pick a preset such as 100 KB or enter a custom target size, then click Compress Image. The result aims for your target or below.",
  },
  {
    question: "Do I need an account?",
    answer:
      "You can compress up to 5 images without an account. Image Resizer, Image Cropper and Image Converter require a free login.",
  },
  {
    question: "How many images can I compress without logging in?",
    answer: "Anonymous users get 5 successful free compressions. After that, create a free account to continue.",
  },
  {
    question: "Is EazyFiles free?",
    answer:
      "Yes. After you sign in, all current image tools are free to use. There are no paid plans or subscriptions at launch.",
  },
];

export function FAQ({ id = "faq" }: { id?: string }) {
  return (
    <section id={id} className="section-padding section-surface scroll-mt-24 bg-background">
      <Container className="max-w-3xl">
        <SectionHeader title="FAQ" description="Answers about EazyFiles and our image tools." />
        <div className="mt-12 divide-y divide-border rounded-md bg-card/60 backdrop-blur-sm">
          {faqs.map((item) => (
            <details key={item.question} className="group px-5 py-4 sm:px-6">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-2 text-left font-medium transition-colors hover:text-foreground">
                <span>{item.question}</span>
                <span className="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="pb-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
