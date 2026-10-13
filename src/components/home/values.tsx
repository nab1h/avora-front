// components/home/values.tsx
import { Headphones, Lightbulb, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

interface Value {
  icon: LucideIcon;
  title: string;
  copy: string;
}

/** Neutral, editable copy — no invented certifications or statistics. */
const VALUES: Value[] = [
  {
    icon: ShieldCheck,
    title: "Curated product quality",
    copy: "Products are selected with a focus on build quality, materials, and finish.",
  },
  {
    icon: Lightbulb,
    title: "Lighting expertise",
    copy: "From ambient to task lighting, we help match the right fixture to each space and purpose.",
  },
  {
    icon: Zap,
    title: "Reliable electrical supplies",
    copy: "Cables, accessories, and components specified with confidence for demanding installations.",
  },
  {
    icon: Headphones,
    title: "Professional support",
    copy: "Guidance before you buy and assistance after delivery — for single items or full projects.",
  },
];

export function Values() {
  return (
    <section id="why-us" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionHeading
            index="04"
            eyebrow="Why Us"
            title="Built on reliability"
            className="mb-0 md:sticky md:top-28"
          />
        </div>

        <div className="md:col-span-8">
          <dl className="divide-y divide-border border-y border-border">
            {VALUES.map((value, index) => (
              <Reveal key={value.title}>
                <div className="group flex gap-5 py-7 transition-colors hover:bg-muted/50 sm:gap-7">
                  <span className="pt-1 text-xs tracking-[0.2em] text-muted-foreground">
                    0{index + 1}
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-md border bg-card text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                    <value.icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="font-medium">{value.title}</dt>
                    <dd className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
                      {value.copy}
                    </dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}