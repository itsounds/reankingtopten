import type { Metadata } from "next";

import { LocalResultPage } from "@/components/local-result-page";
import { businesses, getBusiness } from "@/lib/mock-data";

type BusinessPageProps = {
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

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const business = getBusiness(resolvedParams.slug);

  return {
    title: `${business.name} • Ranking Top 10`,
    description:
      "Mockup strony wyróżnionego lokalu w Rankingu Top 10 z pakietem certyfikatu i ekranu.",
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const resolvedParams = await params;

  return <LocalResultPage slug={resolvedParams.slug} />;
}
