import type { Metadata } from "next";
import { PolicyPage, type PolicyPageProps } from "@/components/site/policy-page";
import { getPolicy } from "@/lib/policies";

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const policy = getPolicy("terms-and-conditions", locale);
  return { title: policy.title, description: policy.description };
}

export default async function Page({ params }: PolicyPageProps) {
  const { locale } = await params;
  return <PolicyPage locale={locale} slug="terms-and-conditions" />;
}
