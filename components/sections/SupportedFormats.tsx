import { LiveToolLink } from "@/components/tools/LiveToolLink";
import { Container } from "@/components/ui/Container";

const formats = [
  {
    name: "JPG / JPEG",
    body: "Best for photos. Quality is adjusted until the file meets your target size.",
  },
  {
    name: "PNG",
    body: "Good for graphics and screenshots. For very small targets, switch the output to JPG or WebP.",
  },
  {
    name: "WebP",
    body: "A modern format that often reaches small sizes with less visible quality loss.",
  },
];

export function SupportedFormats() {
  return (
    <section className="section-padding bg-card/30">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Supported formats</h2>
          <p className="mt-3 text-muted-foreground">
            This version accepts JPG, PNG and WebP. Use the <LiveToolLink slug="image-converter" /> when you need a
            different format rather than a smaller file size.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
          {formats.map((format) => (
            <article key={format.name} className="rounded-md bg-background/80 p-6">
              <h3 className="font-medium">{format.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{format.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
