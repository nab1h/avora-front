"use client";

import { Activity } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { DailyViewPoint } from "@/types/analytics";


interface ChartPoint extends DailyViewPoint {
  label: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: unknown }>;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  const locale = useLocale();
  const t = useTranslations("analytics.chart");
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload as ChartPoint | undefined;
  if (!point) return null;
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-muted-foreground">
        {formatDateLabel(point.date, locale)}
      </p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">
        {t("tooltipViews", { count: numberFormatter.format(point.views) })}
      </p>
    </div>
  );
}

function formatDateLabel(date: string, locale: string): string {
  // Noon anchor avoids timezone shifts between the API date and the browser.
  return new Date(`${date}T12:00:00`).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

export function AnalyticsChart({ data }: { data: DailyViewPoint[] }) {
  const locale = useLocale();
  const t = useTranslations("analytics.chart");
  const prefersReducedMotion = usePrefersReducedMotion();
  const compactFormatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  const chartData: ChartPoint[] = data.map((item) => ({
    ...item,
    label: formatDateLabel(item.date, locale),
  }));

  return (
    <Card className="animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Activity className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium">{t("empty.title")}</p>
            <p className="text-xs text-muted-foreground">
              {t("empty.description")}
            </p>
          </div>
        ) : (
          // Recharts does not handle RTL layouts; anchor it LTR in Arabic locales.
          <div dir="ltr">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dailyViewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />

                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  width={44}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  allowDecimals={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value: number) => compactFormatter.format(value)}
                />

                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{
                    stroke: "hsl(var(--muted-foreground))",
                    strokeOpacity: 0.25,
                    strokeDasharray: "3 3",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#dailyViewsGradient)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AnalyticsChartSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-52" />
      </CardHeader>
      <CardContent>
        <Skeleton className="shimmer h-[280px] w-full" />
      </CardContent>
    </Card>
  );
}