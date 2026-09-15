import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignClass = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl";

  return (
    <div className={alignClass}>
      {eyebrow ? <p className={cn("eyebrow-pill", align === "center" && "mx-auto w-fit")}>{eyebrow}</p> : null}
      <h2
        className={cn(
          "font-semibold tracking-tight text-balance",
          eyebrow ? "mt-5" : "mt-0",
          "text-2xl sm:text-3xl md:text-[2.5rem] md:leading-tight"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">{description}</p>
      ) : null}
    </div>
  );
}
