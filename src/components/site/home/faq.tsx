
import { ArrowUpRight, Plus } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getPublicContents } from "@/lib/services/public-contents";

type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};

const COPY = {
  ar: {
    eyebrow: "الأسئلة الشائعة",
    title: "كل ما تحتاج معرفته",
    description:
      "إجابات تساعدك على اختيار الإضاءة المناسبة لمساحتك. ولو عندك سؤال تاني، تواصل معنا.",
    contact: "تواصل معنا",
  },
  en: {
    eyebrow: "Frequently asked questions",
    title: "A little more clarity",
    description:
      "Helpful answers to guide your lighting choices. Have another question? Get in touch with us.",
    contact: "Get in touch",
  },
};

export async function Faq({ params }: PageProps) {
  const { locale } = await params;
  const copy = COPY[locale];

  const { data } = await getPublicContents("faq").catch(() => ({
    data: [],
  }));

  const contents = data ?? [];

  const getContent = (section: string, key: string) => {
    const findValue = (contentKey: string) =>
      contents.find(
        (item) =>
          item.section === section &&
          item.key === contentKey,
      )?.value?.trim();

    return (
      (locale === "ar" ? findValue(`${key}-ar`) : undefined) ||
      findValue(key)
    );
  };

  const eyebrow =
    getContent("header", "page") || copy.eyebrow;

  const title =
    getContent("address", "title") || copy.title;

  const description =
    getContent("address", "desc") || copy.description;

  const contact =
    getContent("button", "title") || copy.contact;

  // Database sections are q-1, q-2, q-3, ...
  const sections = [
    ...new Set(
      contents
        .filter((item) => /^q-\d+$/.test(item.section))
        .map((item) => item.section),
    ),
  ].sort(
    (a, b) =>
      Number(a.replace("q-", "")) -
      Number(b.replace("q-", "")),
  );

  const items = sections.flatMap((section) => {
    const question = getContent(section, "question");
    const answer = getContent(section, "answer");

    if (!question || !answer) return [];

    return [{ id: section, question, answer }];
  });

  return (
    <section
      id="faq"
      aria-label={eyebrow}
      className="border-t border-border"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-12 lg:px-8">
        <Reveal className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <SectionHeading
              index="05"
              eyebrow={eyebrow}
              title={title}
              description={description}
              className="mb-6 sm:mb-6"
            />

            <Link
              href="/contact"
              className={buttonVariants({ variant: "outline" })}
            >
              {contact}
              <ArrowUpRight
                className="size-4 rtl:-scale-x-100"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>

        <Reveal className="md:col-span-8">
          <div className="divide-y divide-border border-y border-border">
            {items.map((item, index) => (
              <details
                key={item.id}
                name="home-faq"
                className="group"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 py-7 text-start transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:gap-6 [&::-webkit-details-marker]:hidden">
                  <span className="shrink-0 text-xs tracking-[0.2em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1 font-medium">
                    {item.question}
                  </span>

                  <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-card transition-colors group-open:border-primary group-open:bg-primary group-open:text-primary-foreground">
                    <Plus
                      className="size-4 transition-transform group-open:rotate-45 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                </summary>

                <p className="max-w-2xl whitespace-pre-line pb-7 ps-8 pe-12 text-sm leading-relaxed text-muted-foreground sm:ps-10 sm:pe-14">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
