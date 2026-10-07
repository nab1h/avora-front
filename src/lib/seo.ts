import type { Metadata } from "next";

type SeoPage = {
  id: number;
  page: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  robots: string | null;
  canonical_url: string | null;
};

type SeoResponse = {
  data: SeoPage;
};

export async function getSeo(page: string): Promise<SeoPage | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/seo/${page}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const result: SeoResponse = await response.json();

    return result.data;
  } catch {
    return null;
  }
}

export function seoToMetadata(seo: SeoPage | null): Metadata {
  if (!seo) {
    return {};
  }

  return {
    title: seo.title ?? undefined,
    description: seo.description ?? undefined,

    keywords: seo.keywords
      ? seo.keywords
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean)
      : undefined,

    robots: seo.robots
      ? {
          index: !seo.robots.includes("noindex"),
          follow: !seo.robots.includes("nofollow"),
        }
      : undefined,

    alternates: seo.canonical_url
      ? {
          canonical: seo.canonical_url,
        }
      : undefined,

    openGraph: {
      title: seo.og_title ?? seo.title ?? undefined,
      description: seo.og_description ?? seo.description ?? undefined,
      images: seo.og_image
        ? [
            {
              url: seo.og_image,
            },
          ]
        : undefined,
    },
  };
}