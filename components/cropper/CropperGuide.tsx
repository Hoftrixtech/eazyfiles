import type { ReactNode } from "react";
import { LiveToolLink } from "@/components/tools/LiveToolLink";
import { Container } from "@/components/ui/Container";

const faqs: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Can I crop freely or only to a ratio?",
    answer:
      "Both. Free lets you drag any rectangle. 1:1, 4:3, 3:2, 16:9 and 9:16 lock the box so the crop stays that shape while you move or resize it.",
  },
  {
    question: "Which formats are supported?",
    answer:
      "JPG, PNG and WebP. Upload one still image at a time. Animated images and HEIC files are not supported.",
  },
  {
    question: "Does cropping change file size?",
    answer: (
      <>
        Cropping removes pixels outside the box, so the file is often smaller. If you still need a specific number of
        kilobytes, use the <LiveToolLink slug="image-compressor" /> after you crop.
      </>
    ),
  },
  {
    question: "What if I need a different pixel size after cropping?",
    answer: (
      <>
        Crop first to choose the area, then use the <LiveToolLink slug="image-resizer" /> if the result still needs a
        specific width and height. Use the <LiveToolLink slug="image-converter" /> if you need a different file type
        after cropping.
      </>
    ),
  },
  {
    question: "Are my images stored?",
    answer:
      "No. Uploads are processed temporarily and discarded after the cropped file is returned. The database only keeps anonymous usage metadata, never the image.",
  },
];

export function CropperGuide() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="content-heading">What is image cropping?</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Cropping keeps a rectangular part of a photo and discards the rest. It does not stretch the picture the way
            forcing new width and height can. Use a crop when you want to reframe a subject, remove empty edges, or
            match a layout such as a square avatar or a 16:9 banner.
          </p>
        </Container>
      </section>

      <section>
        <Container className="max-w-3xl">
          <h2 className="content-heading">How to crop an image</h2>
          <ol className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Upload a JPG, PNG or WebP file.</span> You will see the
              original filename, dimensions and file size, plus a preview you can crop.
            </li>
            <li>
              <span className="font-medium text-foreground">2. Place the crop box.</span> Drag to move it, use the
              handles to resize, or pick a ratio if you need a specific shape.
            </li>
            <li>
              <span className="font-medium text-foreground">3. Check the live preview.</span> It shows only the area
              inside the box before anything is saved.
            </li>
            <li>
              <span className="font-medium text-foreground">4. Choose an output format and crop.</span> Download the
              result, or start again with Crop Another Image.
            </li>
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="content-heading">Aspect ratio</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Aspect ratio is the relationship between width and height. A 1:1 crop is square. 16:9 is a wide landscape.
            9:16 is a tall portrait, useful for stories and phone screens. Locking a ratio keeps that shape while you
            still choose where the box sits on the photo.
          </p>
        </Container>
      </section>

      <section>
        <Container className="max-w-3xl">
          <h2 className="content-heading">Common crop ratios</h2>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1:1</span> — profile photos and product tiles.
            </li>
            <li>
              <span className="font-medium text-foreground">4:3</span> — classic camera stills and many slides.
            </li>
            <li>
              <span className="font-medium text-foreground">3:2</span> — typical DSLR and print proportions.
            </li>
            <li>
              <span className="font-medium text-foreground">16:9</span> — widescreen video frames and covers.
            </li>
            <li>
              <span className="font-medium text-foreground">9:16</span> — vertical video and story layouts.
            </li>
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="content-heading">Supported formats</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The cropper accepts JPG, PNG and WebP, including files with no extension when the contents are valid. PNG
            transparency is kept when you stay on PNG or WebP. JPEG does not support transparency, so a transparent
            background is filled with white if you convert to JPG.
          </p>
        </Container>
      </section>

      <section id="faq" className="scroll-mt-24 pb-8">
        <Container className="max-w-3xl">
          <div className="text-center">
            <h2 className="content-heading">FAQ</h2>
            <p className="mt-3 text-muted-foreground">Short answers about cropping, ratios and privacy.</p>
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
