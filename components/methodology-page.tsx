import {
  Award,
  BrainCircuit,
  DatabaseZap,
  Filter,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  Store,
} from "lucide-react";
import Image from "next/image";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";

const methodologySteps = [
  {
    title: "Zakres lokalny",
    body: "Ranking zawsze zaczyna się od konkretnego miasta i kategorii, żeby porównywać lokale w podobnym kontekście.",
    icon: MapPin,
  },
  {
    title: "Dane wejściowe",
    body: "Analiza może korzystać z danych pozyskiwanych przez oficjalne API Google Places w ramach Google Maps Platform.",
    icon: DatabaseZap,
  },
  {
    title: "Porządkowanie wyników",
    body: "Usuwamy rekordy niepasujące do kategorii, duplikaty oraz wyniki, które zaburzają jakość zestawienia.",
    icon: Filter,
  },
  {
    title: "Autorska ocena",
    body: "Końcowy wynik jest opracowaniem własnym, które łączy sygnały jakości, widoczności i kompletności profilu.",
    icon: BrainCircuit,
  },
  {
    title: "Publikacja Top 10",
    body: "Publikujemy wyłącznie finałową dziesiątkę wraz z datą aktualizacji, miastem i kategorią.",
    icon: Award,
  },
  {
    title: "Aktualizacje",
    body: "Kolejne edycje mogą zmieniać pozycje lokali, dlatego wyróżnienie zawsze dotyczy konkretnej publikacji.",
    icon: RefreshCcw,
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

export function MethodologyPage() {
  return (
    <div className="embed-page min-h-full bg-white text-[#202124]">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute top-0 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#E8F0FE] blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 py-18 text-center md:px-6 lg:px-8 lg:py-28">
            <span className="inline-flex rounded-full border border-[#DADCE0] bg-white px-4 py-2 text-sm font-semibold text-[#202124] shadow-sm">
              Metodologia
            </span>
            <h1 className="mx-auto mt-7 max-w-4xl text-5xl leading-tight font-semibold tracking-[-0.055em] text-[#202124] md:text-7xl">
              Jak powstaje Ranking Top 10?
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#5F6368] md:text-xl">
              Ranking Top 10 łączy dane lokalne, uporządkowaną analizę i autorską metodologię.
              Celem jest pokazanie wyróżniających się lokali w konkretnym mieście i kategorii.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {methodologySteps.map((step) => (
              <article
                key={step.title}
                className="rounded-[30px] border border-[#DADCE0] bg-white p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F8F9FA] text-[#1A73E8]">
                  <step.icon className="size-5" />
                </div>
                <h2 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-[#202124]">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#5F6368]">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <SectionHeading
              eyebrow="Niezależność"
              title="Własne opracowanie, jasny kontekst"
              description="Ranking Top 10 opisuje konkretne miasto, kategorię i datę publikacji. Dane profilu Google mogą być źródłem analizy, a końcowe zestawienie jest organizowane przez rankingtop10.com."
            />
            <div className="rounded-[34px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] p-6 shadow-[0_22px_56px_rgba(32,33,36,0.08)]">
              <p className="text-sm font-semibold tracking-[0.14em] text-[#1A73E8] uppercase">
                Zasada publikacji
              </p>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#202124]">
                Wyróżnienie zawsze dotyczy konkretnej publikacji.
              </h3>
              <p className="mt-4 text-base leading-8 text-[#5F6368]">
                Komunikacja Top 10 powinna wskazywać miasto, kategorię i datę rankingu. Dzięki
                temu wyróżnienie jest czytelne dla klientów i uczciwe wobec lokali.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            align="center"
            eyebrow="Partner"
            title="Partner projektu i osoby odpowiedzialne za markę"
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
                    className={`flex size-14 items-center justify-center rounded-2xl ${
                      index === 0
                        ? "bg-[#E8F0FE] text-[#1A73E8]"
                        : index === 1
                          ? "bg-[#E6F4EA] text-[#34A853]"
                          : "bg-[#FFF4E5] text-[#EA4335]"
                    }`}
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
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
          <div className="rounded-[42px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] px-6 py-12 text-center shadow-[0_28px_80px_rgba(32,33,36,0.10)] md:px-12 md:py-16">
            <SectionHeading
              align="center"
              eyebrow="Sprawdź ranking"
              title="Przejdź od metodologii do wyniku"
              description="Sprawdź lokal albo zobacz ranking miasta i kategorii."
            />
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="/lokal/mori-mori-poznan">Sprawdź lokal</ButtonLink>
              <ButtonLink href="/poznan/restauracje-azjatyckie" variant="secondary">
                Zobacz ranking
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
