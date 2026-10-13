"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Animates from 0 on first mount, then from the current value
 * whenever the target changes (e.g. after a refetch).
 */
export function useCountUp(target: number, duration = 900): number {
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(target);
  const displayedRef = useRef(target);
  const isFirstRunRef = useRef(true);

  useEffect(() => {
    const from =
      isFirstRunRef.current && !reducedMotion ? 0 : displayedRef.current;
    isFirstRunRef.current = false;

    if (from === target && !reducedMotion) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = reducedMotion || duration <= 0
        ? 1
        : Math.min((now - start) / duration, 1);
      const next = from + (target - from) * easeOutCubic(progress);
      displayedRef.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reducedMotion]);

  return reducedMotion ? target : value;
}
