"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-in";

type RevealProps = {
  children: ReactNode;
  className?: string;
  image?: boolean;
  variant?: RevealVariant;
  /** Milliseconds; stagger is capped to keep the content responsive. */
  delay?: number;
  duration?: number;
  once?: boolean;
};

const transforms: Record<RevealVariant, string> = {
  "fade-up": "translateY(20px)", "fade-in": "none",
  "fade-left": "translateX(20px)", "fade-right": "translateX(-20px)",
  "scale-in": "scale(0.975)",
};

/** Visible server HTML; observation and animations only start after mount. */
export function AnimatedReveal({
  children, className, image = false, variant = "fade-up",
  delay = 0, duration = 700, once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !element.animate || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    let played = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || preference.matches || (once && played)) return;
      played = true;
      animation?.cancel();
      animation = element.animate([
        image
          ? { opacity: 0.3, clipPath: "inset(0 0 12% 0)", transform: "scale(0.985)" }
          : { opacity: 0, transform: transforms[variant] },
        { opacity: 1, clipPath: "inset(0)", transform: "none" },
      ], {
        duration: Math.max(100, duration), delay: Math.min(300, Math.max(0, delay)),
        easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards",
      });
      if (once) observer.unobserve(element);
    }, { threshold: 0.08 });
    const onPreferenceChange = () => { if (preference.matches) animation?.cancel(); };
    observer.observe(element);
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      observer.disconnect(); animation?.cancel();
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [delay, duration, image, once, variant]);
  return <div ref={ref} className={cn("motion-reveal", className)}>{children}</div>;
}

/** Preserve existing imports and server-component children. */
export const Reveal = AnimatedReveal;
