import businessesData from "@/data/businesses.json";
import categoriesData from "@/data/categories.json";
import citiesData from "@/data/cities.json";
import rankingsData from "@/data/rankings.json";

export type City = (typeof citiesData)[number];
export type Category = (typeof categoriesData)[number];
export type Business = (typeof businessesData)[number];
export type Ranking = (typeof rankingsData)[number];
export type RankingBusiness = Business & {
  label: string;
  position: number;
};

export const cities = citiesData as City[];
export const categories = categoriesData as Category[];
export const businesses = businessesData as Business[];
export const rankings = rankingsData as Ranking[];

export const featuredBusiness =
  businesses.find((business) => business.slug === "mori-mori-poznan") ?? businesses[0];

export function getRanking(citySlug: string, categorySlug: string) {
  return (
    rankings.find(
      (ranking) =>
        ranking.citySlug === decodeURIComponent(citySlug) &&
        ranking.categorySlug === decodeURIComponent(categorySlug),
    ) ?? rankings[0]
  );
}

export function getBusiness(slug: string) {
  return (
    businesses.find((business) => business.slug === decodeURIComponent(slug)) ??
    featuredBusiness
  );
}

export function getCity(slug: string) {
  return cities.find((city) => city.slug === decodeURIComponent(slug)) ?? cities[0];
}

export function getCategory(slug: string) {
  return (
    categories.find((category) => category.slug === decodeURIComponent(slug)) ??
    categories[0]
  );
}

export function getRankingBusinesses(ranking: Ranking) {
  return ranking.positions
    .map((item) => {
      const business = businesses.find((entry) => entry.slug === item.businessSlug);

      if (!business) {
        return null;
      }

      return {
        ...business,
        label: item.label,
        position: item.position,
      };
    })
    .filter((entry): entry is RankingBusiness => entry !== null);
}

export function getBusinessRanking(slug: string) {
  const business = getBusiness(slug);
  const ranking =
    rankings.find(
      (entry) =>
        entry.citySlug === business.citySlug && entry.categorySlug === business.categorySlug,
    ) ?? rankings[0];

  return {
    business,
    ranking,
    rankingBusinesses: getRankingBusinesses(ranking),
    city: getCity(ranking.citySlug),
    category: getCategory(ranking.categorySlug),
  };
}
