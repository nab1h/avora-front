// components/home/values.tsx
import { Headphones, Lightbulb, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { getPublicContents } from "@/lib/services/public-contents";

interface Value {
  icon: LucideIcon;
}

/** Neutral, editable copy — no invented certifications or statistics. */
const VALUES: Value[] = [
  {
    icon: ShieldCheck,
  },
  {
    icon: Lightbulb,
  },
  {
    icon: Zap,
  },
  {
    icon: Headphones,
  },
];

type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};


export async function Values({ params }: PageProps) {

  const { locale } = await params;
  const { data } = await getPublicContents("why");
  const contents = data ?? [];

  const getContent = (section: string, key: string) => {
		return contents.find(
			(item) =>
				item.section === section &&
				item.key === key
		);
	};

  const page = locale === "ar"
    ? getContent("header", "page-ar")?.value ?? getContent("header", "page")?.value
    : getContent("header", "page")?.value;
  const title = locale === "ar"
    ? getContent("address", "title-ar")?.value ?? getContent("address", "title")?.value
    : getContent("address", "title")?.value;
  const values = VALUES.map((value, index) => {
    const section = `p-${index + 1}`;
    const title = getContent(section, "title");
    const titleAr = getContent(section, "title-ar");
    const desc = getContent(section, "desc");
    const descAr = getContent(section, "desc-ar");

    return {
      ...value,
      section,
      title: (locale === "ar" ? titleAr?.value ?? title?.value : title?.value) ?? "fix",
      copy: (locale === "ar" ? descAr?.value ?? desc?.value : desc?.value) ?? "fix",
    };
  });


  return (
    <section id="why-us" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionHeading
            index="04"
            eyebrow={page ?? (locale === "ar" ? "لماذا نحن" : "Why Us")}
            title={title ?? (locale === "ar" ? "أساسنا الاعتمادية" : "Built on reliability")}
            className="mb-0 md:sticky md:top-28"
          />
        </div>

        <div className="md:col-span-8">
          <dl className="divide-y divide-border border-y border-border">
            {values.map((value, index) => (
              <Reveal key={value.section}>
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
