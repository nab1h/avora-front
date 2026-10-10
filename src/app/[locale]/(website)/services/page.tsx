import type { Metadata } from 'next';

import ServicesList from './services-list';
import { getServicesMetadata } from './metadata';

type ServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getServicesMetadata(locale);
}

export default function ServicesPage() {
  return <ServicesList />;
}