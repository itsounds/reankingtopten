import { ArrowRight, MapPin, Star, Trophy } from "lucide-react";

import { SearchPanel } from "@/components/search-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  businesses,
  getCategory,
  getCity,
  getRanking,
  getRankingBusinesses,
  type RankingBusiness,
} from "@/lib/mock-data";
import { businessStats } from "@/lib/presentation-data";

type CityRankingPageProps = {
  citySlug: string;
  categorySlug: string;
};

export function CityRankingPage({ citySlug, categorySlug }: CityRankingPageProps) {
  const ranking = getRanking(citySlug, categorySlug);
  const city = getCity(ranking.citySlug);
  const category = getCategory(ranking.categorySlug);
  const rankingBusinesses = getRankingBusinesses(ranking);

  const faqItems = [
    {
      question: `Jak powstał ranking ${category.name.toLowerCase()} w ${city.name}?`,
      answer:
        "Ranking powstał przez analizę większego zbioru lokali w tej kategorii i mieście, uporządkowanie danych oraz ocenę według autorskiej metodologii.",
    },
    {
      question: "Czy kolejność jest oficjalną kolejnością Google?",
      answer:
        "Nie. To niezależne opracowanie własne. Dane są wykorzystywane jako punkt wejścia, a końcowy ranking jest autorską publikacją Ranking Top 10.",
    },
    {
      question: "Czy lokal może zamówić zestaw wyróżnienia?",
      answer:
        "Tak, ale tylko jeśli znajduje się w aktualnym Top 10 dla konkretnego miasta, kategorii i daty publikacji.",
    },
    {
      question: "Czy ranking jest aktualizowany?",
      answer:
        "Tak. Każda publikacja ma datę aktualizacji, a kolejne edycje mogą zmieniać kolejność lokali w zestawieniu.",
    },
  ];

  return (
    <div className="embed-page min-h-full bg-white text-[#202124]">
      <SiteHeader ctaHref="/wyszukiwarka#sprawdz-lokal" ctaLabel="Sprawdź lokal" />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[#E8F0FE] blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-24">
            <div className="max-w-4xl">
              <span className="inline-flex rounded-full border border-[#FBBC05]/30 bg-[#FFF8E1] px-4 py-2 text-sm font-semibold text-[#202124]">
                Ranking lokalny • {ranking.updatedAt}
              </span>
              <h1 className="mt-6 text-5xl leading-tight font-semibold tracking-[-0.055em] text-[#202124] md:text-7xl">
                TOP 10 {category.name.toLowerCase()} w {city.name}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5F6368] md:text-xl">
                Redakcyjne zestawienie lokali wyróżniających się widocznością, opiniami i jakością
                profilu lokalnego. Ranking dotyczy konkretnego miasta, kategorii oraz daty
                publikacji.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/wyszukiwarka#sprawdz-lokal">Sprawdź swój lokal</ButtonLink>
                <ButtonLink href="/metodologia" variant="secondary">
                  Zobacz metodologię
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <aside className="rounded-[34px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] p-6 shadow-[0_22px_56px_rgba(32,33,36,0.08)] lg:sticky lg:top-24">
              <Trophy className="size-10 text-[#FBBC05]" />
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#202124]">
                Lokalny przewodnik Top 10
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5F6368]">
                Lista ma charakter editorialny: pokazuje lokale w kontekście miasta, kategorii i
                aktualnej publikacji, a nie ogólny katalog wszystkich miejsc.
              </p>
              <div className="mt-6 grid gap-3 text-sm">
                <InfoRow label="Miasto" value={city.name} />
                <InfoRow label="Kategoria" value={category.name} />
                <InfoRow label="Analizowane lokale" value={String(ranking.analyzedCount)} />
              </div>
            </aside>

            <div className="space-y-5">
              {rankingBusinesses.map((business) => (
                <EditorialRankingCard key={business.slug} business={business} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            eyebrow="Opisy lokali"
            title="Dlaczego te miejsca zwracają uwagę?"
            description="Każdy lokal w Top 10 ma swoją rolę w lokalnym rynku: rozpoznawalność, jakość obsługi, widoczność albo silny odbiór klientów."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {rankingBusinesses.slice(0, 6).map((business) => (
              <article
                key={business.slug}
                className="rounded-[30px] border border-[#DADCE0] bg-white p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#202124]">
                  {business.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5F6368]">{business.summary}</p>
                <ButtonLink className="mt-5" href="/wyszukiwarka#sprawdz-lokal" variant="ghost">
                  Sprawdź wynik lokalu
                  <ArrowRight className="ml-2 size-4" />
                </ButtonLink>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            align="center"
            eyebrow="FAQ lokalne"
            title={`Pytania o ranking w ${city.name}`}
          />
          <div className="mt-10">
            <Accordion items={faqItems} />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
          <div className="rounded-[42px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] px-6 py-12 text-center shadow-[0_28px_80px_rgba(32,33,36,0.10)] md:px-12 md:py-16">
            <SectionHeading
              align="center"
              eyebrow="Sprawdź lokal"
              title="Chcesz sprawdzić własny lokal?"
              description="Wpisz nazwę lokalu albo wybierz inne miasto i kategorię."
            />
            <div className="mx-auto mt-8 max-w-3xl text-left">
              <SearchPanel businesses={businesses} compact />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
      <span className="text-[#5F6368]">{label}</span>
      <span className="font-semibold text-[#202124]">{value}</span>
    </div>
  );
}

function EditorialRankingCard({ business }: { business: RankingBusiness }) {
  const stats = businessStats[business.slug] ?? { rating: "4.7", reviews: "700+ opinii" };

  return (
    <article className="grid gap-5 rounded-[34px] border border-[#DADCE0] bg-white p-5 shadow-[0_18px_40px_rgba(32,33,36,0.06)] transition-transform duration-200 hover:-translate-y-0.5 md:grid-cols-[auto_1fr]">
      <div className="flex size-18 items-center justify-center rounded-[26px] bg-[#F8F9FA] text-3xl font-semibold tracking-[-0.06em] text-[#202124]">
        #{business.position}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#202124]">
            {business.name}
          </h2>
          <span className="rounded-full bg-[#E8F0FE] px-3 py-1 text-xs font-semibold text-[#1A73E8]">
            Top 10
          </span>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-[#5F6368]">
          <MapPin className="size-4" />
          {business.address}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#5F6368]">
          <span className="inline-flex items-center gap-1 font-semibold text-[#202124]">
            <Star className="size-4 fill-[#FBBC05] text-[#FBBC05]" />
            {stats.rating}
          </span>
          <span>{stats.reviews}</span>
          <span>{business.district}</span>
        </div>
        <p className="mt-4 text-sm leading-7 text-[#5F6368]">{business.summary}</p>
      </div>
    </article>
  );
}
