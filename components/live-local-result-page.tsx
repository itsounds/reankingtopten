"use client";

import {
  Award,
  BadgeCheck,
  BrainCircuit,
  Crown,
  DatabaseZap,
  MapPin,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { PackageShowcase, ScreenShowcase } from "@/components/visuals";
import { benefits, packageItems } from "@/lib/presentation-data";
import { cn } from "@/lib/utils";

type Ranking = {
  id: number;
  categoryName: string;
  city: string;
  searchPhrase: string;
  placesConsidered: number;
  createdAt: string;
};

type RankingEntry = {
  id: number;
  position: number;
  score: number;
  rating: number;
  ratingCount: number;
  title: string;
  address: string | null;
  category: string | null;
  phoneNumber: string | null;
  website: string | null;
};

type RankingResponse = {
  ranking: Ranking;
  entries: RankingEntry[];
};

type LoadingState = "loading" | "ready" | "error";

const faqItems = [
  {
    question: "Czy pakiet jest dostępny dla każdego lokalu?",
    answer:
      "Nie. Zestaw ekspozycyjny Top 10 jest dostępny wyłącznie dla lokali obecnych w aktualnym zestawieniu dla danego miasta i kategorii.",
  },
  {
    question: "Co zawiera zestaw wyróżnienia?",
    answer:
      'Zestaw obejmuje certyfikat Top 10, cyfrową ekspozycję wyróżnienia, ekran 15.6" Full HD, mikrokomputer oraz możliwość wyświetlania własnych treści lokalu.',
  },
  {
    question: "Ile kosztuje zestaw?",
    answer: "Cena prezentowanego zestawu ekspozycyjnego wynosi 1199 zł netto.",
  },
  {
    question: "Czy można wykorzystać wyróżnienie w social media?",
    answer:
      "Tak. Lokal z aktualnego Top 10 może komunikować wyróżnienie w swoich materiałach promocyjnych i social media.",
  },
];

const credibilityCards = [
  {
    title: "Dane Google Maps",
    body: "Ranking bazuje na analizie danych lokalnych dostępnych w ekosystemie Google Maps.",
    icon: DatabaseZap,
  },
  {
    title: "Autorska metodologia",
    body: "Ostateczna pozycja wynika z autorskiej metodologii oceny lokali.",
    icon: BrainCircuit,
  },
  {
    title: "Kontekst lokalny",
    body: "Każdy ranking dotyczy konkretnego miasta, kategorii i aktualnej daty publikacji.",
    icon: MapPin,
  },
];

const partnerCards = [
  {
    title: "Keen Group Sp. z o.o.",
    body: "Wyłączny partner Rankingu Top 10 na terenie Polski.",
    icon: Store,
  },
  {
    title: "Mateusz Chojnowski",
    body: "Rozwój marki • certyfikowany specjalista Google Ads.",
    icon: ShieldCheck,
    image: "/images/mati.jpg",
  },
  {
    title: "Maciej Kostecki",
    body: "Rozwój marki • certyfikowany specjalista Google Ads.",
    icon: Award,
    image: "/images/maciej.jpg",
  },
];

const certificateCards = [
  {
    title: "Certyfikat Google Skillshop",
    name: "Mateusz Chojnowski",
    src: "/images/mati-cert.png",
  },
  {
    title: "Certyfikat Google Skillshop",
    name: "Maciej Kostecki",
    src: "/images/maciej-cert.png",
  },
  {
    title: "Certyfikat Google Skillshop",
    name: "Mateusz Chojnowski",
    src: "/images/mati-cert-ai.png",
  },
];

export function LiveLocalResultPage() {
  const [state, setState] = useState<LoadingState>("loading");
  const [data, setData] = useState<RankingResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("Nie udało się pobrać wyniku.");
  const selectedEntryId = getSelectedEntryId();

  useEffect(() => {
    const runId = getRunId();

    if (!runId) {
      queueMicrotask(() => {
        setState("error");
        setErrorMessage("Brakuje identyfikatora rankingu.");
      });
      return;
    }

    const controller = new AbortController();

    fetch(`/api/ranking-run.php?run_id=${runId}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message ?? "Nie udało się pobrać wyniku.");
        }

        return payload as RankingResponse;
      })
      .then((payload) => {
        setData(payload);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : "Nie udało się pobrać wyniku.");
        setState("error");
      });

    return () => controller.abort();
  }, []);

  const selectedEntry = useMemo(
    () => data?.entries.find((entry) => entry.id === selectedEntryId) ?? data?.entries[0] ?? null,
    [data, selectedEntryId],
  );

  if (state === "loading") {
    return <Shell hero={<LoadingHero />} />;
  }

  if (state === "error" || !data || !selectedEntry) {
    return <Shell hero={<ErrorHero message={errorMessage} />} />;
  }

  return (
    <Shell
      hero={
        <HeroSection
          entry={selectedEntry}
          ranking={data.ranking}
        />
      }
    >
      <FullRankingSection
        entries={data.entries}
        highlightedEntryId={selectedEntry.id}
        ranking={data.ranking}
      />
      <PackageSection />
      <BenefitsSection />
      <ScreenSection />
      <CredibilitySection />
      <PartnersSection />
      <FaqSection />
    </Shell>
  );
}

function Shell({ hero, children }: { hero: ReactNode; children?: ReactNode }) {
  return (
    <div className="embed-page min-h-full bg-white text-[#202124]">
      <SiteHeader />
      <main>
        {hero}
        {children}
      </main>

      <div className="sticky bottom-4 z-40 px-4 md:hidden">
        <div className="mx-auto max-w-md rounded-full border border-[#DADCE0] bg-white/95 p-2 shadow-[0_24px_60px_rgba(32,33,36,0.14)] backdrop-blur">
          <ButtonLink className="w-full" href="tel:+48788733337" target="_top">
            Zamów cyfrowy certyfikat
          </ButtonLink>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function LoadingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 pt-[100px] pb-16 md:px-6 lg:px-8 lg:pt-[100px] lg:pb-24">
        <span className="inline-flex rounded-full border border-[#DADCE0] bg-white px-4 py-2 text-sm font-semibold text-[#5F6368]">
          Sprawdzamy wynik
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl leading-tight font-semibold tracking-[-0.055em] text-[#202124] md:text-6xl">
          Ładujemy aktualny wynik lokalu...
        </h1>
      </div>
    </section>
  );
}

function ErrorHero({ message }: { message: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 pt-[100px] pb-16 md:px-6 lg:px-8 lg:pt-[100px] lg:pb-24">
        <span className="inline-flex rounded-full border border-[#FAD2CF] bg-[#FCE8E6] px-4 py-2 text-sm font-semibold text-[#A50E0E]">
          Wynik niedostępny
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl leading-tight font-semibold tracking-[-0.055em] text-[#202124] md:text-6xl">
          Nie możemy wyświetlić wyniku lokalu
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5F6368]">{message}</p>
        <div className="mt-8">
          <ButtonLink href="/#sprawdz-lokal">Wróć do wyszukiwarki</ButtonLink>
        </div>
      </div>
    </section>
  );
}

function HeroSection({ entry, ranking }: { entry: RankingEntry; ranking: Ranking }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-[#FFF8E1] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 pt-[100px] pb-16 md:px-6 lg:px-8 lg:pt-[100px] lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-[#FBBC05]/30 bg-[#FFF8E1] px-4 py-2 text-sm font-semibold text-[#202124]">
              Gratulacje
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl leading-tight font-semibold tracking-[-0.055em] text-[#202124] md:text-6xl">
              {entry.title} znajduje się w TOP 10 {ranking.categoryName.toLowerCase()} w{" "}
              {ranking.city}.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5F6368]">
              To aktualne wyróżnienie dla konkretnego miasta, kategorii i daty publikacji
              rankingu.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Badge label="Top 10" tone="gold" />
              <Badge label="Wyróżniony lokal" tone="blue" />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <HeroStat label="Miejsce" value={`#${entry.position}`} />
              <HeroStat label="Ocena Google" value={entry.rating.toFixed(1)} />
              <HeroStat label="Opinie" value={`${entry.ratingCount.toLocaleString("pl-PL")} opinii`} />
              <HeroStat label="Kategoria" value={ranking.categoryName} />
              <HeroStat label="Miasto" value={ranking.city} />
              <HeroStat label="Aktualizacja" value={formatDate(ranking.createdAt)} />
            </div>
          </div>

          <div className="rounded-[40px] border border-[#FBBC05]/30 bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF8E1_100%)] p-6 shadow-[0_28px_80px_rgba(251,188,5,0.14)] md:p-8">
            <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_46px_rgba(32,33,36,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#5F6368]">Pozycja w rankingu</p>
                  <p className="mt-2 text-7xl font-semibold tracking-[-0.08em] text-[#202124]">
                    #{entry.position}
                  </p>
                </div>
                <Trophy className="size-16 text-[#FBBC05]" />
              </div>
              <h2 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-[#202124]">
                {entry.title}
              </h2>
              {entry.address ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-[#5F6368]">
                  <MapPin className="size-4" />
                  {entry.address}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#5F6368]">
                <span className="inline-flex items-center gap-1 font-semibold text-[#202124]">
                  <Star className="size-4 fill-[#FBBC05] text-[#FBBC05]" />
                  {entry.rating.toFixed(1)}
                </span>
                <span>{entry.ratingCount.toLocaleString("pl-PL")} opinii</span>
                {entry.category ? <span>{entry.category}</span> : null}
              </div>
              <div className="mt-8">
                <ButtonLink href="tel:+48788733337" target="_top">
                  Zamów cyfrowy certyfikat
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FullRankingSection({
  entries,
  highlightedEntryId,
  ranking,
}: {
  entries: RankingEntry[];
  highlightedEntryId: number;
  ranking: Ranking;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Pełny ranking"
        title={`Top 10: ${ranking.categoryName.toLowerCase()} w ${ranking.city}`}
        description="Pełne zestawienie pojawia się dopiero po sprawdzeniu lokalu. To tutaj wyróżnienie zamienia się w realny prestiż lokalu."
      />
      <div className="mt-10 space-y-5">
        {entries.map((entry) => (
          <RankingResultCard
            key={entry.id}
            entry={entry}
            highlighted={entry.id === highlightedEntryId}
          />
        ))}
      </div>
    </section>
  );
}

function PackageSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24" id="zestaw">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Zestaw wyróżnienia"
            title="Zestaw ekspozycyjny Top 10"
            description="Gotowy zestaw ekspozycyjny, który pozwala pokazać klientom status Top 10 bez żadnej konfiguracji."
          />
          <div className="mt-7 flex items-end gap-2 text-5xl font-semibold tracking-[-0.055em] text-[#202124]">
            <span>1199 zł</span>
            <span className="pb-1 text-base font-medium tracking-normal text-[#5F6368]">netto</span>
          </div>
          <div className="mt-8 grid gap-3">
            {packageItems.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-[#F8F9FA] p-4">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-[#34A853]" />
                <span className="text-base font-medium text-[#202124]">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-[24px] bg-[#FFF8E1] px-5 py-4 text-sm leading-7 text-[#5F6368]">
            Dostępne wyłącznie dla lokali obecnych w aktualnym Top 10.
          </p>
          <div className="mt-8">
            <ButtonLink href="tel:+48788733337" target="_top">
              Zamów cyfrowy certyfikat
            </ButtonLink>
          </div>
        </div>
        <PackageShowcase />
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        align="center"
        eyebrow="Korzyści"
        title="Status, który klienci zauważają od wejścia"
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {benefits.map((benefit, index) => {
          const Icon = [Crown, Trophy, ShieldCheck, Sparkles, MonitorPlay][index];
          return (
            <article
              key={benefit}
              className="flex flex-col items-center rounded-[30px] border border-[#DADCE0] bg-white p-6 text-center shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F8F9FA] text-[#1A73E8]">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.03em] text-[#202124]">
                {benefit}
              </h3>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ScreenSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Cyfrowa ekspozycja"
        title="To nie tylko wyróżnienie — to dodatkowa przestrzeń promocyjna dla lokalu."
        description="Poza wyróżnieniem ekran może wyświetlać również menu, promocje i komunikaty dla klientów."
      />
      <div className="mt-10">
        <ScreenShowcase />
      </div>
    </section>
  );
}

function CredibilitySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionHeading
          eyebrow="Wiarygodność"
          title="Jak powstaje ranking?"
          description="Ranking powstaje na podstawie danych Google Maps oraz autorskiego modelu oceny lokali. Wynik dotyczy konkretnego miasta, kategorii i aktualnej edycji rankingu."
          action={
            <ButtonLink href="/metodologia" variant="secondary">
              Zobacz metodologię
            </ButtonLink>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {credibilityCards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col items-center rounded-[28px] border border-[#DADCE0] bg-white p-6 text-center shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F8F9FA] text-[#1A73E8]">
                <card.icon className="size-5" />
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.03em] text-[#202124]">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#5F6368]">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        align="center"
        eyebrow="Wyłączny partner rankingu"
        title="Partnerzy projektu"
        description="Projekt rozwijany jest przez zespół specjalizujący się w marketingu lokalnym i budowie marek."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {partnerCards.map((card, index) => (
          <article
            key={card.title}
            className="flex flex-col items-center rounded-[30px] border border-[#DADCE0] bg-white p-6 text-center shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
          >
            {card.image ? (
              <Image
                src={card.image}
                alt={card.title}
                width={128}
                height={128}
                className="size-32 rounded-full object-cover shadow-[0_14px_32px_rgba(32,33,36,0.14)]"
                unoptimized
              />
            ) : (
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
                <card.icon className="size-6" />
              </div>
            )}
            <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-[#202124]">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#5F6368]">{card.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {certificateCards.map((certificate) => (
          <article
            key={certificate.src}
            className="overflow-hidden rounded-[30px] border border-[#DADCE0] bg-white p-4 shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
          >
            <Image
              src={certificate.src}
              alt={`${certificate.title} — ${certificate.name}`}
              width={700}
              height={540}
              className="h-auto w-full rounded-[24px] object-contain"
              unoptimized
            />
            <div className="px-2 pt-5 text-center">
              <p className="text-sm font-medium text-[#5F6368]">{certificate.title}</p>
              <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#202124]">
                {certificate.name}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
      <SectionHeading align="center" eyebrow="FAQ" title="Pytania o wyróżnienie i pakiet" />
      <div className="mt-10">
        <Accordion items={faqItems} />
      </div>
    </section>
  );
}

function Badge({ label, tone }: { label: string; tone: "gold" | "blue" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-4 py-2 text-sm font-semibold",
        tone === "gold" ? "bg-[#FFF8E1] text-[#202124]" : "bg-[#E8F0FE] text-[#1A73E8]",
      )}
    >
      {label}
    </span>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[#DADCE0] bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-[#5F6368]">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#202124]">{value}</p>
    </div>
  );
}

function RankingResultCard({
  entry,
  highlighted,
}: {
  entry: RankingEntry;
  highlighted?: boolean;
}) {
  return (
    <article
      className={cn(
        "grid gap-5 rounded-[34px] border p-5 shadow-sm transition-all duration-200 md:grid-cols-[auto_1fr]",
        highlighted
          ? "border-[#FBBC05]/40 bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF8E1_100%)] shadow-[0_22px_56px_rgba(251,188,5,0.18)]"
          : "border-[#DADCE0] bg-white hover:-translate-y-0.5",
      )}
    >
      <div
        className={cn(
          "flex size-18 items-center justify-center rounded-[26px] text-3xl font-semibold tracking-[-0.06em]",
          highlighted ? "bg-[#202124] text-white" : "bg-[#F8F9FA] text-[#202124]",
        )}
      >
        #{entry.position}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#202124]">
            {entry.title}
          </h3>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              highlighted ? "bg-[#202124] text-white" : "bg-[#E8F0FE] text-[#1A73E8]",
            )}
          >
            {highlighted ? "Wyróżniony lokal" : "Top 10"}
          </span>
        </div>
        {highlighted ? (
          <p className="mt-2 text-sm font-medium text-[#202124]">
            Gratulacje — ten lokal znajduje się w aktualnym zestawieniu Top 10.
          </p>
        ) : null}
        {entry.address ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-[#5F6368]">
            <MapPin className="size-4" />
            {entry.address}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#5F6368]">
          <span className="inline-flex items-center gap-1 font-semibold text-[#202124]">
            <Star className="size-4 fill-[#FBBC05] text-[#FBBC05]" />
            {entry.rating.toFixed(1)}
          </span>
          <span>{entry.ratingCount.toLocaleString("pl-PL")} opinii</span>
          {entry.category ? <span>{entry.category}</span> : null}
        </div>
      </div>
    </article>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getRunId() {
  if (typeof window === "undefined") {
    return null;
  }

  const runId = Number(new URLSearchParams(window.location.search).get("run_id") ?? 0);

  return Number.isInteger(runId) && runId > 0 ? runId : null;
}

function getSelectedEntryId() {
  if (typeof window === "undefined") {
    return null;
  }

  const entryId = Number(new URLSearchParams(window.location.search).get("entry_id") ?? 0);

  return Number.isInteger(entryId) && entryId > 0 ? entryId : null;
}
