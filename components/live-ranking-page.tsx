"use client";

import { MapPin, Star, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";

type Ranking = {
  id: number;
  categoryName: string;
  city: string;
  searchPhrase: string;
  placesConsidered: number;
  entriesCreated: number;
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

export function LiveRankingPage() {
  const [state, setState] = useState<LoadingState>("loading");
  const [data, setData] = useState<RankingResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("Nie udało się pobrać rankingu.");
  const selectedEntryId = getSelectedEntryId();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const runId = Number(params.get("run_id") ?? 0);

    if (!Number.isInteger(runId) || runId <= 0) {
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
          throw new Error(payload?.message ?? "Nie udało się pobrać rankingu.");
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

        setErrorMessage(error instanceof Error ? error.message : "Nie udało się pobrać rankingu.");
        setState("error");
      });

    return () => controller.abort();
  }, []);

  const selectedEntry = useMemo(
    () => data?.entries.find((entry) => entry.id === selectedEntryId) ?? null,
    [data, selectedEntryId],
  );

  return (
    <div className="embed-page min-h-full bg-white text-[#202124]">
      <SiteHeader ctaHref="/wyszukiwarka#sprawdz-lokal" ctaLabel="Sprawdź lokal" />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[#E8F0FE] blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-24">
            {state === "loading" ? <LoadingHero /> : null}
            {state === "error" ? <ErrorHero message={errorMessage} /> : null}
            {state === "ready" && data ? (
              <RankingHero ranking={data.ranking} selectedEntry={selectedEntry} />
            ) : null}
          </div>
        </section>

        {state === "ready" && data ? (
          <>
            <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
              <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                <aside className="rounded-[34px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] p-6 shadow-[0_22px_56px_rgba(32,33,36,0.08)] lg:sticky lg:top-24">
                  <Trophy className="size-10 text-[#FBBC05]" />
                  <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#202124]">
                    Aktualny Top 10
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#5F6368]">
                    Ranking został zbudowany na podstawie pobranych danych dla konkretnej frazy,
                    miasta i kategorii.
                  </p>
                  <div className="mt-6 grid gap-3 text-sm">
                    <InfoRow label="Miasto" value={data.ranking.city} />
                    <InfoRow label="Kategoria" value={data.ranking.categoryName} />
                    <InfoRow label="Fraza" value={data.ranking.searchPhrase} />
                    <InfoRow label="Analizowane lokale" value={String(data.ranking.placesConsidered)} />
                    <InfoRow label="Data rankingu" value={formatDate(data.ranking.createdAt)} />
                  </div>
                </aside>

                <div className="space-y-5">
                  {data.entries.map((entry) => (
                    <RankingEntryCard
                      key={entry.id}
                      entry={entry}
                      highlighted={entry.id === selectedEntryId}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
              <div className="rounded-[42px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] px-6 py-12 text-center shadow-[0_28px_80px_rgba(32,33,36,0.10)] md:px-12 md:py-16">
                <SectionHeading
                  align="center"
                  eyebrow="Sprawdź kolejny lokal"
                  title="Chcesz sprawdzić inny wynik?"
                  description="Wróć do wyszukiwarki i wpisz nazwę kolejnego lokalu."
                />
                <div className="mt-8">
                  <ButtonLink href="/wyszukiwarka#sprawdz-lokal">Sprawdź lokal</ButtonLink>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}

function LoadingHero() {
  return (
    <div className="max-w-4xl">
      <span className="inline-flex rounded-full border border-[#DADCE0] bg-white px-4 py-2 text-sm font-semibold text-[#5F6368]">
        Ładowanie rankingu
      </span>
      <h1 className="mt-6 text-5xl leading-tight font-semibold tracking-[-0.055em] text-[#202124] md:text-7xl">
        Sprawdzamy aktualny wynik...
      </h1>
    </div>
  );
}

function ErrorHero({ message }: { message: string }) {
  return (
    <div className="max-w-4xl">
      <span className="inline-flex rounded-full border border-[#FAD2CF] bg-[#FCE8E6] px-4 py-2 text-sm font-semibold text-[#A50E0E]">
        Ranking niedostępny
      </span>
      <h1 className="mt-6 text-5xl leading-tight font-semibold tracking-[-0.055em] text-[#202124] md:text-7xl">
        Nie możemy wyświetlić tego rankingu
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5F6368] md:text-xl">{message}</p>
      <div className="mt-8">
        <ButtonLink href="/wyszukiwarka#sprawdz-lokal">Wróć do wyszukiwarki</ButtonLink>
      </div>
    </div>
  );
}

function RankingHero({
  ranking,
  selectedEntry,
}: {
  ranking: Ranking;
  selectedEntry: RankingEntry | null;
}) {
  return (
    <div className="max-w-4xl">
      <span className="inline-flex rounded-full border border-[#FBBC05]/30 bg-[#FFF8E1] px-4 py-2 text-sm font-semibold text-[#202124]">
        Ranking lokalny • {formatDate(ranking.createdAt)}
      </span>
      <h1 className="mt-6 text-5xl leading-tight font-semibold tracking-[-0.055em] text-[#202124] md:text-7xl">
        TOP 10 {ranking.categoryName.toLowerCase()} w {ranking.city}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5F6368] md:text-xl">
        To aktualny ranking dla frazy <strong className="text-[#202124]">{ranking.searchPhrase}</strong>.
        {selectedEntry
          ? ` Szukany lokal jest na miejscu #${selectedEntry.position}.`
          : " Poniżej znajdziesz pełną pierwszą dziesiątkę."}
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
      <span className="shrink-0 text-[#5F6368]">{label}</span>
      <span className="min-w-0 text-right font-semibold text-[#202124]">{value}</span>
    </div>
  );
}

function RankingEntryCard({
  entry,
  highlighted,
}: {
  entry: RankingEntry;
  highlighted: boolean;
}) {
  return (
    <article
      className={`grid gap-5 rounded-[34px] border bg-white p-5 shadow-[0_18px_40px_rgba(32,33,36,0.06)] transition-transform duration-200 hover:-translate-y-0.5 md:grid-cols-[128px_auto_1fr] ${
        highlighted ? "border-[#1A73E8] ring-4 ring-[#1A73E8]/10" : "border-[#DADCE0]"
      }`}
    >
      <div className="h-32 rounded-[28px] bg-[linear-gradient(135deg,#E8F0FE_0%,#FFFFFF_58%,#FFF8E1_100%)]" />
      <div className="flex size-18 items-center justify-center rounded-[26px] bg-[#F8F9FA] text-3xl font-semibold tracking-[-0.06em] text-[#202124]">
        #{entry.position}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#202124]">
            {entry.title}
          </h2>
          {highlighted ? (
            <span className="rounded-full bg-[#E8F0FE] px-3 py-1 text-xs font-semibold text-[#1A73E8]">
              Szukany lokal
            </span>
          ) : null}
        </div>
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
          <span>Score {entry.score.toFixed(2)}</span>
          {entry.category ? <span>{entry.category}</span> : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {entry.website ? (
            <a
              className="inline-flex items-center justify-center rounded-full border border-[#DADCE0] bg-white px-4 py-2 text-sm font-medium text-[#202124] transition hover:border-[#1A73E8]/30 hover:shadow-sm"
              href={entry.website}
              rel="noreferrer"
              target="_blank"
            >
              Strona www
            </a>
          ) : null}
          {entry.phoneNumber ? (
            <a
              className="inline-flex items-center justify-center rounded-full bg-[#1A73E8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1765cc]"
              href={`tel:${entry.phoneNumber.replace(/\s+/g, "")}`}
              target="_top"
            >
              Zadzwoń
            </a>
          ) : null}
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

function getSelectedEntryId() {
  if (typeof window === "undefined") {
    return null;
  }

  const entryId = Number(new URLSearchParams(window.location.search).get("entry_id") ?? 0);

  return Number.isInteger(entryId) && entryId > 0 ? entryId : null;
}
