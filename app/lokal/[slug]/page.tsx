import type { Metadata } from "next";

import { LocalResultPage } from "@/components/local-result-page";
import { businesses, getBusiness } from "@/lib/mock-data";

type LocalPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return businesses.map((business) => ({
    slug: business.slug,
  }));
}

export async function generateMetadata({ params }: LocalPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const business = getBusiness(resolvedParams.slug);

  return {
    title: `${business.name} w Top 10 • Ranking Top 10`,
    description: `Sprawdź wynik lokalu ${business.name} w aktualnym Rankingu Top 10.`,
  };
}

export default async function LocalPage({ params }: LocalPageProps) {
  const resolvedParams = await params;

  return <LocalResultPage slug={resolvedParams.slug} />;
}
