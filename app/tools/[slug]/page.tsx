import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageHeroBanner } from "@/components/layout/PageHeroBanner";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Container } from "@/components/ui/Container";
import {
  getCategoryBySlug,
  getStaticToolDirectorySlugs,
  getToolBySlug,
  getToolsByCategory,
} from "@/lib/tools";
import { createCategoryMetadata, createToolMetadata } from "@/lib/seo";

interface ToolDirectoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getStaticToolDirectorySlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ToolDirectoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (category) {
    return createCategoryMetadata(category);
  }

  const tool = getToolBySlug(slug);
  if (tool?.status === "live") {
    return createToolMetadata(tool);
  }

  return {
    title: "Not found",
    robots: { index: false, follow: false },
  };
}

export default async function ToolDirectorySlugPage({ params }: ToolDirectoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (category) {
    const tools = getToolsByCategory(category.id);

    return (
      <main className="py-12 sm:py-16">
        <Container className="space-y-10">
          <header className="max-w-2xl">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              <Link href="/tools" className="hover:text-foreground">
                All tools
              </Link>
            </p>
            <h1 className="page-heading">{category.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{category.shortDescription}</p>
          </header>
          <ToolGrid tools={tools} />
        </Container>
      </main>
    );
  }

  const tool = getToolBySlug(slug);
  if (tool?.status === "live") {
    if (tool.route !== `/tools/${tool.slug}`) {
      redirect(tool.route);
    }

    return (
      <main className="py-12 sm:py-16">
        <Container className="space-y-10">
          <header className="max-w-2xl">
            <h1 className="page-heading">{tool.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{tool.longDescription}</p>
          </header>
          <RelatedTools slug={tool.slug} />
        </Container>
      </main>
    );
  }

  notFound();
}
