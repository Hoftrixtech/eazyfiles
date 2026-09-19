import type { LucideIcon } from "lucide-react";
import { Briefcase, Globe, GraduationCap, Heart, Users } from "lucide-react";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { Container } from "@/components/ui/Container";
import {
  DEFAULT_AUDIENCES_CONTENT,
  getAudiencesContent,
  type AudienceCard,
} from "@/lib/tools/audiences-content";
import { cn } from "@/lib/utils";

const audienceIcons: Record<AudienceCard["title"], LucideIcon> = {
  "Website Owners": Globe,
  "Content Creators": Users,
  Businesses: Briefcase,
  "Students & Professionals": GraduationCap,
  "Social Media Users": Heart,
};

export function AboutAudiencesSection({ toolSlug }: { toolSlug?: string } = {}) {
  const content = toolSlug ? getAudiencesContent(toolSlug) : DEFAULT_AUDIENCES_CONTENT;

  return (
    <section className="section-padding bg-muted/25">
      <Container className="max-w-[90rem]">
        <header className="max-w-3xl">
          <EyebrowPill className="w-fit">{content.eyebrow}</EyebrowPill>
          <h2 className="section-heading mt-6 text-balance text-foreground">{content.heading}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{content.description}</p>
        </header>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {content.audiences.map((item) => {
            const Icon = audienceIcons[item.title];
            return (
              <article
                key={item.title}
                className={cn(
                  "btn-radius flex h-full flex-col border border-border bg-card p-6 sm:p-7",
                  "transition-[box-shadow,border-color] hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]"
                )}
              >
                {Icon ? (
                  <span
                    className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    aria-hidden="true"
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                ) : null}
                <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
