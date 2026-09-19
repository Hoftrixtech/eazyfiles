import type { ReactNode } from "react";

export function LegalProse({ children }: { children: ReactNode }) {
  return (
    <div className="legal-prose space-y-10 pb-4 text-base leading-relaxed text-muted-foreground sm:pb-6">{children}</div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="legal-prose-section">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-4 pl-5 leading-relaxed [&>li]:pl-0.5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function LegalSubsection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <div className="mt-3 space-y-5">{children}</div>
    </div>
  );
}
