import type { ReactNode } from "react";
import { LiveToolLink } from "@/components/tools/LiveToolLink";
import { Container } from "@/components/ui/Container";

const faqs: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Will the image keep its aspect ratio?",
    answer:
      "Yes, if Maintain aspect ratio is turned on. Changing width then updates height, and the other way around. Turn it off only when you need a specific width and height that do not match the original shape.",
  },
  {
    question: "Can I enlarge an image?",
    answer:
      "You can enter dimensions larger than the original, within the safety limits. Enlarging cannot add real detail. The result may look softer than the original.",
  },
  {
    question: "Which formats are supported?",
    answer:
      "JPG, PNG and WebP. Upload one still image at a time. Animated images and HEIC files are not supported.",
  },
  {
    question: "Does resizing compress the file?",
    answer: (
      <>
        Resizing changes pixel dimensions. A smaller image is often a smaller file, but the encoder also matters. Use
        the <LiveToolLink slug="image-compressor" /> when you need a specific file size such as 100 KB. Use the{" "}
        <LiveToolLink slug="image-converter" /> if the destination expects a different format.
      </>
    ),
  },
  {
    question: "Are my images stored?",
    answer:
      "No. Uploads are processed temporarily and discarded after the resized file is returned. The database only keeps anonymous usage metadata, never the image.",
  },
];

export function ResizerGuide() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="content-heading">What is an image resizer?</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            An image resizer changes how many pixels an image uses in width and height. That is different from
            compressing a file to a target number of kilobytes. Resize when a photo is too large for a profile picture,
            a product listing, a social post, or an email attachment that expects specific dimensions.
          </p>
        </Container>
      </section>

      <section>
        <Container className="max-w-3xl">
          <h2 className="content-heading">How to resize an image</h2>
          <ol className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Upload a JPG, PNG or WebP file.</span> Drop it onto the
              tool or browse from your device. You will see the original filename, size and dimensions.
            </li>
            <li>
              <span className="font-medium text-foreground">2. Choose a size.</span> Type a custom width and height, pick
              a percent of the original, or use a common preset such as 1920 × 1080.
            </li>
            <li>
              <span className="font-medium text-foreground">3. Keep or unlock aspect ratio.</span> Leave it on to avoid
              stretching. Turn it off only when both sides must match an exact frame.
            </li>
            <li>
              <span className="font-medium text-foreground">4. Choose an output format and resize.</span> Download the
              result, or start again with Resize Another Image.
            </li>
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="content-heading">When to resize an image</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Resize before you upload to a site that rejects oversized photos, when a banner needs a known pixel size, or
            when a phone image is far larger than the place it will be shown. If the dimensions are already right and
            only the file is too heavy, use the <LiveToolLink slug="image-compressor" /> instead of shrinking the picture
            further.
          </p>
        </Container>
      </section>

      <section>
        <Container className="max-w-3xl">
          <h2 className="content-heading">Aspect ratio</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Aspect ratio is the relationship between width and height, such as 16:9 for widescreen or 1:1 for a square.
            Keeping it on means the picture stays the same shape. Turning it off lets you force a size that does not
            match the original, which can stretch faces, logos or product photos.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="content-heading">Supported formats</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The resizer accepts JPG, PNG and WebP, including files with no extension when the contents are valid. PNG
            transparency is kept when you stay on PNG or WebP. JPEG does not support transparency, so a transparent
            background is filled with white if you convert to JPG.
          </p>
        </Container>
      </section>

      <section id="faq" className="scroll-mt-24 pb-8">
        <Container className="max-w-3xl">
          <div className="text-center">
            <h2 className="content-heading">FAQ</h2>
            <p className="mt-3 text-muted-foreground">Short answers about resizing, formats and privacy.</p>
          </div>
          <div className="mt-10 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {faqs.map((item) => (
              <details key={item.question} className="group p-5">
                <summary className="cursor-pointer list-none font-medium marker:content-none after:float-right after:text-muted-foreground after:content-['+'] group-open:after:content-['–']">
                  {item.question}
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
