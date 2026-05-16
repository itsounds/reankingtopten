import {
  BadgeCheck,
  BriefcaseBusiness,
  Mail,
  MapPin,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { InteriorScene, PackageShowcase, ScreenShowcase } from "@/components/visuals";
import { getBusinessRanking, getCategory, getCity, getRanking, getRankingBusinesses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type RankingDetailPageProps =
  | {
      mode: "ranking";
      citySlug: string;
      categorySlug: string;
    }
  | {
      mode: "business";
      slug: string;
    };

const faqItems = [
  {
    question: "Czy pakiet jest dostępny dla każdego lokalu?",
    answer:
      "Nie. Pakiet jest przeznaczony dla lokali wyróżnionych w aktualnym zestawieniu Top 10 dla wskazanej kategorii i miasta.",
  },
  {
    question: "Ile kosztuje pakiet?",
    answer: "Cena prezentowanego pakietu mockupowego wynosi 1199 zł netto.",
  },
  {
    question: "Co obejmuje pakiet?",
    answer:
      "Pakiet obejmuje certyfikat, monitor 15.6 cala Full HD oraz mikrokomputer gotowy do prezentowania materiałów na ekranie.",
  },
  {
    question: "Czy ekran może wyświetlać własne treści?",
    answer:
      "Tak. Na ekranie można wyświetlać wyróżnienie Top 10, oferty specjalne lub własne materiały informacyjne lokalu.",
  },
];

const teamCards = [
  {
    title: "Keen Group Sp. z o.o.",
    body: "Wyłączny partner Rankingu Top 10 na terenie Polski.",
  },
  {
    title: "Mateusz Chojnowski",
    body: "Rozwój marki • certyfikowany specjalista Google Ads.",
  },
  {
    title: "Maciej Kostecki",
    body: "Rozwój marki • certyfikowany specjalista Google Ads.",
  },
];

const businessStats: Record<string, { rating: string; reviews: string }> = {
  "yatta-ramen-poznan": { rating: "4.9", reviews: "2 187 opinii" },
  "tokyo-bistro-poznan": { rating: "4.8", reviews: "1 642 opinie" },
  "noodle-garden-poznan": { rating: "4.8", reviews: "1 309 opinii" },
  "mori-mori-poznan": { rating: "4.8", reviews: "2 187 opinii" },
  "umami-street-poznan": { rating: "4.7", reviews: "984 opinie" },
  "dragon-bowl-poznan": { rating: "4.7", reviews: "842 opinie" },
  "miso-craft-poznan": { rating: "4.7", reviews: "713 opinii" },
  "hanami-poznan": { rating: "4.6", reviews: "655 opinii" },
  "bao-house-poznan": { rating: "4.6", reviews: "589 opinii" },
  "soy-club-poznan": { rating: "4.6", reviews: "512 opinii" },
  "smile-studio-warszawa": { rating: "4.9", reviews: "1 118 opinii" },
};

export function RankingDetailPage(props: RankingDetailPageProps) {
  const dataset =
    props.mode === "business"
      ? getBusinessRanking(props.slug)
      : (() => {
          const ranking = getRanking(props.citySlug, props.categorySlug);
          const city = getCity(ranking.citySlug);
          const category = getCategory(ranking.categorySlug);
          const rankingBusinesses = getRankingBusinesses(ranking);
          const business =
            rankingBusinesses.find(
              (entry) => entry.slug === ranking.highlightedBusinessSlug,
            ) ?? rankingBusinesses[0];

          return { ranking, city, category, rankingBusinesses, business };
        })();

  const { business, category, city, ranking, rankingBusinesses } = dataset;

  return (
    <div className="embed-page min-h-full bg-white text-[#202124]">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute top-12 right-10 h-56 w-56 rounded-full bg-[#E8F0FE] blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-[#5F6368]">
                Ranking Top 10 / {city.name} / {category.name}
              </p>
              <h1 className="mt-4 max-w-2xl text-5xl leading-[1.02] font-semibold tracking-[-0.05em] text-[#202124] md:text-6xl">
                Twój lokal znajduje się w Top 10
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5F6368]">
                Gratulacje. Twój lokal został wyróżniony w aktualnym zestawieniu Top 10 dla
                swojej kategorii i miasta.
              </p>

              <div className="mt-8 grid gap-5">
                <div className="grid gap-4 rounded-[30px] border border-[#DADCE0] bg-white p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)] sm:grid-cols-3">
                  <StatCard label="Pozycja w rankingu" value={`#${business.position}`} />
                  <StatCard label="Data aktualizacji" value={ranking.updatedAt} />
                  <StatCard label="Liczba analizowanych lokali" value={String(ranking.analyzedCount)} />
                </div>

                <div className="rounded-[30px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)]">
                  <p className="text-sm font-medium text-[#5F6368]">Certyfikat Top 10</p>
                  <div className="mt-3 flex items-end gap-2 text-3xl font-semibold tracking-[-0.04em] text-[#202124]">
                    <span>1199 zł</span>
                    <span className="pb-0.5 text-sm font-medium tracking-normal text-[#5F6368]">netto</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#5F6368]">
                    Certyfikat + monitor 15.6&quot; Full HD + mikrokomputer
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <ButtonLink href="tel:+48788733337" className="sm:min-w-[172px]">
                      Zamów cyfrowy certyfikat
                    </ButtonLink>
                    <ButtonLink
                      href={`/ranking/${city.slug}/${category.slug}`}
                      variant="secondary"
                    >
                      Zobacz pełny ranking
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>

            <PackageShowcase />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Aktualne zestawienie"
            title="Aktualne Top 10 w tej kategorii"
            description="Zestawienie stanowi autorskie opracowanie przygotowane na podstawie danych z oficjalnego API Google Places i własnej metodologii oceny."
          />
          <div className="mt-10 space-y-4">
            {rankingBusinesses.map((item) => (
              <div
                key={item.slug}
                className={cn(
                  "grid gap-4 rounded-[32px] border p-5 shadow-sm transition-all duration-200 md:grid-cols-[auto_1fr_auto]",
                  item.slug === business.slug
                    ? "border-[#FBBC05]/40 bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF8E1_100%)] shadow-[0_22px_56px_rgba(251,188,5,0.18)]"
                    : "border-[#DADCE0] bg-white hover:-translate-y-0.5",
                )}
              >
                <div
                  className={cn(
                    "flex size-16 items-center justify-center rounded-[24px] text-2xl font-semibold tracking-[-0.05em] shadow-sm",
                    item.slug === business.slug ? "bg-[#202124] text-white" : "bg-[#F8F9FA] text-[#202124]",
                  )}
                >
                  #{item.position}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#202124]">
                      {item.name}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        item.slug === business.slug
                          ? "bg-[#202124] text-white"
                          : "bg-[#E8F0FE] text-[#1A73E8]",
                      )}
                    >
                      {item.slug === business.slug ? "Wyróżniony lokal" : "Top 10"}
                    </span>
                  </div>
                  {item.slug === business.slug ? (
                    <p className="mt-2 text-sm font-medium text-[#202124]">
                      Gratulacje — ten lokal znajduje się w aktualnym zestawieniu Top 10.
                    </p>
                  ) : null}
                  <p className="mt-2 flex items-center gap-2 text-sm text-[#5F6368]">
                    <MapPin className="size-4" />
                    {item.address}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#5F6368]">
                    <span className="inline-flex items-center gap-1 font-medium text-[#202124]">
                      <Star className="size-4 fill-[#FBBC05] text-[#FBBC05]" />
                      {businessStats[item.slug]?.rating ?? "4.7"}
                    </span>
                    <span>{businessStats[item.slug]?.reviews ?? "700+ opinii"}</span>
                    <span>{item.district}</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#5F6368]">{item.summary}</p>
                </div>
                <div className="flex items-center justify-start md:justify-end">
                  <ButtonLink href={`/business/${item.slug}`} variant="ghost">
                    Szczegóły lokalu
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <InteriorScene />
            <div>
              <SectionHeading
                eyebrow="Znaczenie wyróżnienia"
                title="Obecność w Top 10 to wyróżnienie, które warto pokazać klientom"
                description="Lokal obecny w Rankingu Top 10 znajduje się w gronie najwyżej ocenionych podmiotów w swojej kategorii i mieście według metodologii projektu. To wyróżnienie, które może wzmacniać zaufanie klientów i podnosić jakość odbioru marki na miejscu."
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
            <PackageShowcase />
            <div>
              <SectionHeading
                eyebrow="Pakiet dla lokalu"
                title="Certyfikat Top 10 dla lokalu wyróżnionego w rankingu"
                description="Gotowy zestaw do ekspozycji wyróżnienia w lokalu. Pakiet pozwala estetycznie pokazać obecność w Top 10 i wykorzystać ekran do prezentowania własnych materiałów."
              />
              <div className="mt-6 flex items-end gap-2 text-5xl font-semibold tracking-[-0.05em] text-[#202124]">
                <span>1199 zł</span>
                <span className="pb-1 text-base font-medium tracking-normal text-[#5F6368]">netto</span>
              </div>
              <div className="mt-8 space-y-4">
                {[
                  "Certyfikat Top 10",
                  "Monitor 15.6\" Full HD",
                  "Mikrokomputer",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <BadgeCheck className="size-5 text-[#34A853]" />
                    <span className="text-base font-medium text-[#202124]">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="tel:+48788733337">Zamów cyfrowy certyfikat</ButtonLink>
                <ButtonLink href="#" variant="secondary">
                  Skontaktuj się
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Treści na ekranie"
            title="Ekran może pracować także dla Twojego lokalu"
            description="Monitor nie musi służyć wyłącznie do prezentacji certyfikatu. Może być również wykorzystywany do emisji własnych treści lokalu."
          />
          <div className="mt-10">
            <ScreenShowcase />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            align="center"
            eyebrow="Dlaczego to działa"
            title="Jedno wyróżnienie, wiele zastosowań w lokalu"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Wyróżniasz lokal",
                icon: Trophy,
              },
              {
                title: "Budujesz zaufanie",
                icon: ShieldCheck,
              },
              {
                title: "Lepsza prezentacja oferty",
                icon: MonitorPlay,
              },
              {
                title: "Mocniejszy odbiór marki",
                icon: Sparkles,
              },
            ].map((step, index) => (
              <article
                key={step.title}
                className="rounded-[28px] border border-[#DADCE0] bg-white p-6 text-center shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
              >
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#F8F9FA] text-[#1A73E8]">
                  <step.icon className="size-6" />
                </div>
                <p className="mt-6 text-sm font-medium tracking-[0.14em] text-[#5F6368] uppercase">
                  Krok {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#202124]">
                  {step.title}
                </h3>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-20" id="metodologia">
          <div className="grid gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Metodologia"
                title="Jak powstał ten ranking?"
                description="Ranking Top 10 jest autorskim zestawieniem opracowanym na podstawie danych pozyskiwanych przez oficjalnie zarejestrowane konto deweloperskie w Google Maps Platform, z wykorzystaniem oficjalnego API Google Places."
              />
              <p className="mt-5 text-base leading-8 text-[#5F6368]">
                Dla każdej kategorii i miasta analizowany jest większy zbiór lokali, który
                następnie podlega porządkowaniu, filtrowaniu i ocenie według własnej metodologii
                projektu. Publikowane jest wyłącznie końcowe Top 10.
              </p>
              <div className="mt-6">
                <ButtonLink href="#" variant="ghost">
                  Zobacz pełną metodologię
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-[30px] border border-[#DADCE0] bg-white p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)]">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "oficjalne API Google Places",
                  "analiza większego zbioru lokali",
                  "filtrowanie rekordów",
                  "autorski model oceny",
                  "publikacja wyłącznie Top 10",
                  "cykliczna aktualizacja",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-[#E8EAED] bg-[#F8F9FA] px-4 py-4 text-sm text-[#202124]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            align="center"
            eyebrow="Partner i zespół"
            title="Partner projektu i osoby odpowiedzialne za rozwój marki"
            description="Wyłącznym partnerem Rankingu Top 10 na terenie Polski jest Keen Group Sp. z o.o. Za rozwój marki odpowiadają Mateusz Chojnowski i Maciej Kostecki — certyfikowani specjaliści Google Ads, posiadający certyfikaty uzyskane na oficjalnej platformie Google Skillshop."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {teamCards.map((card, index) => (
              <article
                key={card.title}
                className="rounded-[28px] border border-[#DADCE0] bg-white p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
              >
                <div
                  className={cn(
                    "flex size-14 items-center justify-center rounded-2xl",
                    index === 0
                      ? "bg-[#E8F0FE] text-[#1A73E8]"
                      : index === 1
                        ? "bg-[#E6F4EA] text-[#34A853]"
                        : "bg-[#FFF4E5] text-[#EA4335]",
                  )}
                >
                  {index === 0 ? (
                    <BriefcaseBusiness className="size-6" />
                  ) : index === 1 ? (
                    <Star className="size-6" />
                  ) : (
                    <Mail className="size-6" />
                  )}
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-[#202124]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5F6368]">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            align="center"
            eyebrow="FAQ"
            title="Najczęściej zadawane pytania"
          />
          <div className="mt-10">
            <Accordion items={faqItems} />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8 lg:py-20">
          <div className="rounded-[40px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] px-6 py-12 text-center shadow-[0_24px_60px_rgba(32,33,36,0.08)] md:px-12 md:py-16">
            <SectionHeading
              align="center"
              eyebrow="Zamów certyfikat"
              title="Pokaż klientom, że Twój lokal znajduje się w Top 10"
              description="Zamów Certyfikat Top 10 i wykorzystaj certyfikat oraz ekran do eleganckiej ekspozycji wyróżnienia w lokalu."
            />
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="tel:+48788733337">Zamów cyfrowy certyfikat</ButtonLink>
              <ButtonLink href="#" variant="secondary">
                Skontaktuj się
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <div className="sticky bottom-4 z-40 px-4 md:hidden">
        <div className="mx-auto max-w-md rounded-full border border-[#DADCE0] bg-white/95 p-2 shadow-[0_24px_60px_rgba(32,33,36,0.14)] backdrop-blur">
          <ButtonLink className="w-full" href="tel:+48788733337">
            Zamów cyfrowy certyfikat
          </ButtonLink>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[#E8EAED] bg-[#F8F9FA] p-4">
      <p className="text-sm text-[#5F6368]">{label}</p>
      <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[#202124]">{value}</p>
    </div>
  );
}
