"use client";

import { useEffect, useState } from "react";
import { FileText, Home } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TopPage } from "@/types/analytics";


function PageIcon({ path }: { path: string }) {
  const Icon = path === "/" ? Home : FileText;
  return <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />;
}

export function TopPagesTable({ pages }: { pages: TopPage[] }) {
  const locale = useLocale();
  const t = useTranslations("analytics.topPages");
  const numberFormatter = new Intl.NumberFormat(locale);
  const maxViews = Math.max(...pages.map((page) => page.views), 1);

  // Lets the progress bars animate from 0 to their width on mount.
  const [barsVisible, setBarsVisible] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setBarsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Card className="animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent>
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <FileText className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium">{t("empty.title")}</p>
            <p className="text-xs text-muted-foreground">
              {t("empty.description")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{t("pagePath")}</TableHead>
                  <TableHead className="text-right">{t("views")}</TableHead>
                  <TableHead className="hidden w-44 md:table-cell">
                    {t("shareOfTopPage")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pages.map((page, index) => {
                  const width =
                    page.views > 0
                      ? Math.max((page.views / maxViews) * 100, 4)
                      : 0;

                  return (
                    <TableRow
                      key={`${page.page_path}-${index}`}
                      className="transition-colors"
                    >
                      <TableCell>
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                            index < 3
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {index + 1}
                        </span>
                      </TableCell>

                      <TableCell className="max-w-0">
                        <div className="flex items-center gap-2.5">
                          <PageIcon path={page.page_path} />
                          <span className="truncate font-medium">
                            {page.page_path}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-right font-semibold tabular-nums">
                        {numberFormatter.format(page.views)}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary/80 transition-[width] duration-700 ease-out motion-reduce:transition-none"
                            style={{ width: barsVisible ? `${width}%` : "0%" }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TopPagesTableSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="shimmer h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}