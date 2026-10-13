import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CSS-only scroll reveal (animation-timeline: view()).
 * Progressive enhancement — renders statically where unsupported,
 * and is inert under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  image = false,
}: {
  children: ReactNode;
  className?: string;
  image?: boolean;
}) {
  return (
    <div className={cn(image ? "reveal-img" : "reveal", className)}>{children}</div>
  );
}