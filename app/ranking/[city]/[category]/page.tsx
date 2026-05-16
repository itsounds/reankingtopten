import type { Metadata } from "next";

import { CityRankingPage } from "@/components/city-ranking-page";
import { getCategory, getCity, rankings } from "@/lib/mock-data";

type RankingPageProps = {
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

export async function generateMetadata({ params }: RankingPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const city = getCity(resolvedParams.city);
  const category = getCategory(resolvedParams.category);

  return {
    title: `${category.name} • ${city.name} • Ranking Top 10`,
    description:
      "Mockup strony rankingu Top 10 dla lokalnych biznesów, inspirowany językiem wizualnym Google Business Profile.",
  };
}

export default async function RankingPage({ params }: RankingPageProps) {
  const resolvedParams = await params;

  return (
    <CityRankingPage
      citySlug={resolvedParams.city}
      categorySlug={resolvedParams.category}
    />
  );
}
