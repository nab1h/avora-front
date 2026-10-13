"use client";

import type { LucideIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountUp } from "@/hooks/use-count-up";

export interface StatCardProps {
  title: string;
  value: number | undefined;
  description: string;
  icon: LucideIcon;
  /** Position in the grid, used for the staggered entrance delay. */
  index?: number;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  index = 0,
}: StatCardProps) {
  const locale = useLocale();
  const numberFormatter = new Intl.NumberFormat(locale);
  const animatedValue = useCountUp(value ?? 0);

  return (
    <Card
      style={{ animationDelay: `${index * 70}ms` }}
      className="group animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500 motion-reduce:animate-none transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3 p-5">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>

        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Final value exposed to screen readers; animated digits hidden */}
        <p
          className="text-3xl font-bold tracking-tight tabular-nums"
          aria-label={numberFormatter.format(value ?? 0)}
        >
          <span aria-hidden="true">
            {numberFormatter.format(Math.round(animatedValue))}
          </span>
        </p>

        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}

export function StatCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <Card
      style={{ animationDelay: `${index * 70}ms` }}
      className="animate-in fade-in fill-mode-both duration-300 motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-3 p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <div className="space-y-3 px-5 pb-5">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </Card>
  );
}