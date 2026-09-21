import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  titleAccent,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignClass = align === "center" ? "mx-auto max-w-5xl text-center" : "max-w-5xl";

  return (
    <div className={alignClass}>
      {eyebrow ? <EyebrowPill className={align === "center" ? "mx-auto w-fit" : "w-fit"}>{eyebrow}</EyebrowPill> : null}
      {titleAccent ? (
        <SplitHeading
          className={eyebrow ? "mt-5" : "mt-0"}
          align={align}
          lead={title}
          accent={titleAccent}
        />
      ) : (
        <h2 className={cn("section-heading", eyebrow ? "mt-4 sm:mt-5" : "mt-0")}>{title}</h2>
      )}
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">{description}</p>
      ) : null}
    </div>
  );
}
