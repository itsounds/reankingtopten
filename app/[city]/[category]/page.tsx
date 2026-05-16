import type { Metadata } from "next";

import { CityRankingPage } from "@/components/city-ranking-page";
import { getCategory, getCity, rankings } from "@/lib/mock-data";

type SeoRankingPageProps = {
  params: Promise<{
    city: string;
    category: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return rankings.map((ranking) => ({
    city: ranking.citySlug,
    category: ranking.categorySlug,
  }));
}

export async function generateMetadata({ params }: SeoRankingPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const city = getCity(resolvedParams.city);
  const category = getCategory(resolvedParams.category);

  return {
    title: `TOP 10 ${category.name.toLowerCase()} w ${city.name} • Ranking Top 10`,
    description: `Lokalny ranking Top 10 dla kategorii ${category.name.toLowerCase()} w ${city.name}.`,
  };
}

export default async function SeoRankingPage({ params }: SeoRankingPageProps) {
  const resolvedParams = await params;

  return (
    <CityRankingPage
      citySlug={resolvedParams.city}
      categorySlug={resolvedParams.category}
    />
  );
}
