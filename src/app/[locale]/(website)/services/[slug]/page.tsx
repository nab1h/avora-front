import type { Metadata } from 'next';

import ServiceDetails from './service-details';
import { getServicesMetadata } from '../metadata';

type ServicePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getServicesMetadata(locale);
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  return <ServiceDetails slug={slug} />;
}