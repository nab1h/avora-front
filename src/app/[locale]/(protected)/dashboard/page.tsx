"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  CalendarDays,
  ChevronRight,
  Eye,
  MousePointerClick,
  RefreshCw,
  UserCheck,
  Users,
} from "lucide-react";

import { useGetAnalyticsQuery } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { StatCard, StatCardProps, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { AnalyticsChart, AnalyticsChartSkeleton } from "@/components/dashboard/analytics-chart";
import { TopPagesTable, TopPagesTableSkeleton } from "@/components/dashboard/top-pages-table";

/**
 * The API currently returns a fixed window (last 7 days) with no period
 * parameter — only "7 Days" is enabled until the backend supports filtering.
 */
const PERIODS = [
  { value: "today", enabled: false },
  { value: "7d", enabled: true },
  { value: "30d", enabled: false },
] as const;

export default function Dashboard() {
  const t = useTranslations("analytics");
  const locale = useLocale();
  const { data, isLoading, isFetching, isError, fulfilledTimeStamp, refetch } =
    useGetAnalyticsQuery();

  const analytics = data?.data;
  const hasData = Boolean(analytics);
  const showSkeletons = isLoading && !hasData;

  const updatedAt = fulfilledTimeStamp
    ? new Date(fulfilledTimeStamp).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const stats: StatCardProps[] = [
    {
      title: t("stats.totalViews.title"),
      value: analytics?.total_views,
      description: t("stats.totalViews.description"),
      icon: Eye,
    },
    {
      title: t("stats.uniqueVisitors.title"),
      value: analytics?.unique_visitors,
      description: t("stats.uniqueVisitors.description"),
      icon: Users,
    },
    {
      title: t("stats.totalSessions.title"),
      value: analytics?.total_sessions,
      description: t("stats.totalSessions.description"),
      icon: MousePointerClick,
    },
    {
      title: t("stats.todayViews.title"),
      value: analytics?.today_views,
      description: t("stats.todayViews.description"),
      icon: CalendarDays,
    },
    {
      title: t("stats.todayVisitors.title"),
      value: analytics?.today_visitors,
      description: t("stats.todayVisitors.description"),
      icon: UserCheck,
    },
  ];

  return (
    <TooltipProvider>
      <main className="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
          {/* Header */}
          <header className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 motion-reduce:animate-none space-y-4">
            <nav
              aria-label={t("breadcrumb")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Link href="/" className="transition-colors hover:text-foreground">
                {t("dashboard")}
              </Link>
              <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
              <span className="font-medium text-foreground">{t("title")}</span>
            </nav>

            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("title")}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t("description")}
                  {updatedAt && ` · ${t("updated", { time: updatedAt })}`}
                  .
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Period selector — placeholder until the API supports periods */}
                <div className="inline-flex items-center rounded-lg border bg-muted/40 p-1">
                  {PERIODS.map((period) => {
                    const trigger = (
                      <Button
                        key={period.value}
                        variant="ghost"
                        size="sm"
                        disabled={!period.enabled}
                        className={cn(
                          "h-7 px-3 text-xs",
                          period.value === "7d" &&
                          "bg-background text-foreground shadow-sm"
                        )}
                      >
                        {t(`periods.${period.value}`)}
                      </Button>
                    );

                    if (period.enabled) return trigger;

                    return (
                      <Tooltip key={period.value}>
                        <TooltipTrigger
                          render={<span />}
                          tabIndex={0}
                          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {trigger}
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {t("periodFilteringUnavailable")}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="gap-2"
                >
                  <RefreshCw
                    className={cn(
                      "size-4",
                      isFetching && "animate-spin motion-reduce:animate-none"
                    )}
                    aria-hidden="true"
                  />
                  {isFetching ? t("refreshing") : t("refresh")}
                </Button>
              </div>
            </div>
          </header>

          {/* Error banner — shown alongside stale data during failed refetches */}
          {isError && (
            <div
              role="alert"
              className="flex animate-in fade-in duration-300 flex-col gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-destructive">
                  {t("loadFailed")}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("loadFailedDescription")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="shrink-0 gap-2 self-start sm:self-auto"
              >
                <RefreshCw
                  className={cn(
                    "size-4",
                    isFetching && "animate-spin motion-reduce:animate-none"
                  )}
                  aria-hidden="true"
                />
                {t("tryAgain")}
              </Button>
            </div>
          )}

          {/* No data at all (no error, nothing returned) */}
          {!showSkeletons && !isError && !hasData && (
            <Card className="flex animate-in fade-in duration-300 flex-col items-center justify-center gap-2 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Eye className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium">{t("empty.title")}</p>
              <p className="text-xs text-muted-foreground">
                {t("empty.description")}
              </p>
            </Card>
          )}

          {(showSkeletons || hasData) && (
            <>
              {/* Statistics */}
              <section
                aria-label={t("statsSection")}
                aria-busy={showSkeletons}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
              >
                {showSkeletons
                  ? Array.from({ length: stats.length }).map((_, index) => (
                    <StatCardSkeleton key={index} index={index} />
                  ))
                  : stats.map((stat, index) => (
                    <StatCard key={stat.title} {...stat} index={index} />
                  ))}
              </section>

              {/* Daily views chart */}
              <section aria-label={t("chart.title")} aria-busy={showSkeletons}>
                {showSkeletons ? (
                  <AnalyticsChartSkeleton />
                ) : (
                  <AnalyticsChart data={analytics?.daily_views ?? []} />
                )}
              </section>

              {/* Top pages */}
              <section aria-label={t("topPages.title")} aria-busy={showSkeletons}>
                {showSkeletons ? (
                  <TopPagesTableSkeleton />
                ) : (
                  <TopPagesTable pages={analytics?.top_pages ?? []} />
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </TooltipProvider>
  );
}
