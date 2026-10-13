import { cache } from "react";

export type PublicSiteScriptType = "analytics" | "pixel" | "verification" | "custom";
export type PublicSiteScriptPlacement = "head" | "body_start" | "body_end";
export type PublicSiteScriptStrategy = "beforeInteractive" | "afterInteractive" | "lazyOnload";

export type PublicSiteScript = {
  id: number;
  name: string;
  type: PublicSiteScriptType;
  url?: string | null;
  code?: string | null;
  placement: PublicSiteScriptPlacement;
  strategy: PublicSiteScriptStrategy;
  is_active: boolean;
  sort_order: number;
};

export const getPublicSiteScripts = cache(async (): Promise<PublicSiteScript[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  if (!apiUrl) {
    return [];
  }

  try {
    const response = await fetch(`${apiUrl}/site-scripts/public`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    const scripts = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];

    return scripts
      .filter((script: Partial<PublicSiteScript>) => script.is_active)
      .sort((left: Partial<PublicSiteScript>, right: Partial<PublicSiteScript>) => {
        const leftSort = Number(left.sort_order ?? 0);
        const rightSort = Number(right.sort_order ?? 0);
        return leftSort - rightSort;
      });
  } catch {
    return [];
  }
});