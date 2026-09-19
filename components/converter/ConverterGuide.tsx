import type { ReactNode } from "react";
import { LiveToolLink } from "@/components/tools/LiveToolLink";
import { Container } from "@/components/ui/Container";

const faqs: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Should I convert to the same format?",
    answer: (
      <>
        You can. Re-encoding JPEG or WebP can change file size. If you only need a target number of kilobytes, use the{" "}
        <LiveToolLink slug="image-compressor" /> instead of converting JPEG to JPEG.
      </>
    ),
  },
  {
    question: "Will converting change the dimensions?",
    answer: (
      <>
        No. Conversion keeps the pixel width and height. Use the <LiveToolLink slug="image-resizer" /> or{" "}
        <LiveToolLink slug="image-cropper" /> when you need a different size or frame.
      </>
    ),
  },
  {
    question: "Does JPEG keep transparency?",
    answer:
      "No. JPEG has no alpha channel. A transparent PNG or WebP is filled with white if you convert to JPEG. Stay on PNG or WebP to keep transparency.",
  },
  {
    question: "Which formats are supported?",
    answer: "JPG, PNG and WebP. Upload one still image at a time. Animated images and HEIC files are not supported.",
  },
  {
    question: "Are my images stored?",
    answer:
      "No. Uploads are processed temporarily and discarded after the converted file is returned. The database only keeps anonymous usage metadata, never the image.",
  },
];

export function ConverterGuide() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="content-heading">What is an image converter?</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            An image converter changes a file from one format to another without asking you to pick a new width or a
            target number of kilobytes. That is useful when a site only accepts JPEG, when you want WebP for the web, or
            when a PNG graphic needs to stay lossless. After conversion you can still{" "}
            <LiveToolLink slug="image-compressor" />, <LiveToolLink slug="image-resizer" /> or{" "}
            <LiveToolLink slug="image-cropper" /> the result if you need a smaller file, a new size, or a tighter frame.
          </p>
        </Container>
      </section>

      <section>
        <Container className="max-w-3xl">
          <h2 className="content-heading">How to convert an image</h2>
          <ol className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Upload a JPG, PNG or WebP file.</span> You will see the
              original format, dimensions and file size, plus a preview.
            </li>
            <li>
              <span className="font-medium text-foreground">2. Choose the output format.</span> JPEG, PNG or WebP. The
              download name uses the matching extension, such as photo.webp.
            </li>
            <li>
              <span className="font-medium text-foreground">3. Pick a quality preset if you need it.</span> High is the
              default. Balanced and Smaller File only reduce JPEG and WebP quality. PNG stays lossless.
            </li>
            <li>
              <span className="font-medium text-foreground">4. Convert and download.</span> Start again with Convert
              Another Image whenever you need a different file.
            </li>
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="content-heading">JPG vs PNG vs WebP</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">JPEG</span> is the usual choice for photographs. It is
              widely accepted, but it cannot store transparency and it uses lossy compression.
            </p>
            <p>
              <span className="font-medium text-foreground">PNG</span> is better for screenshots, graphics and images
              that need a clear background. It is lossless, so files are often larger.
            </p>
            <p>
              <span className="font-medium text-foreground">WebP</span> can be lossy or keep transparency. It is a strong
              option for websites when the destination supports it.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container className="max-w-3xl">
          <h2 className="content-heading">Which image format should you use?</h2>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Use JPEG</span> for photos going to email, print shops or
              older upload forms.
            </li>
            <li>
              <span className="font-medium text-foreground">Use PNG</span> when you need sharp edges, text in a graphic,
              or a transparent background.
            </li>
            <li>
              <span className="font-medium text-foreground">Use WebP</span> when you want a smaller web image and the
              site accepts it.
            </li>
            <li>
              If the format is already right and only the file is too heavy, use the{" "}
              <LiveToolLink slug="image-compressor" /> instead of converting again.
            </li>
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="content-heading">Supported formats</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The converter accepts JPG, PNG and WebP, including files with no extension when the contents are valid. The
            server checks the real image bytes, not only the filename. PNG transparency is kept on PNG and WebP. JPEG
            fills transparent areas with white.
          </p>
        </Container>
      </section>

      <section id="faq" className="scroll-mt-24 pb-8">
        <Container className="max-w-3xl">
          <div className="text-center">
            <h2 className="content-heading">FAQ</h2>
            <p className="mt-3 text-muted-foreground">Short answers about conversion, quality and privacy.</p>
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
