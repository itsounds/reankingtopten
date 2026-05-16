import {
  BrainCircuit,
  CalendarClock,
  DatabaseZap,
  MapPin,
  Search,
} from "lucide-react";

import { SearchPanel } from "@/components/search-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { businesses } from "@/lib/mock-data";

const processSteps = [
  {
    title: "Opinie Google",
    body: "Google udostępnia dane profilu za pomocą Google Places API.",
  },
  {
    title: "Analizujemy opinie",
    body: "Pod uwagę bierzemy średnią z opinii oraz ich ilość.",
  },
  {
    title: "Obliczamy wynik rankingu",
    body: "Lokale oceniane są według autorskiej metodologii.",
  },
  {
    title: "Publikujemy aktualny Top 10",
    body: "Każdy ranking dotyczy konkretnego miasta, kategorii i daty publikacji.",
  },
];

const trustCards = [
  {
    title: "Dane Google Maps",
    body: "Analizujemy publicznie dostępne dane widoczne w Google Maps.",
    icon: DatabaseZap,
  },
  {
    title: "Autorski model oceny",
    body: "Ranking nie jest prostym sortowaniem opinii — uwzględnia wiele czynników jakościowych.",
    icon: BrainCircuit,
  },
  {
    title: "Lokalny kontekst",
    body: "Każde zestawienie dotyczy konkretnego miasta i kategorii.",
    icon: MapPin,
  },
  {
    title: "Regularne aktualizacje",
    body: "Rankingi aktualizowane są cyklicznie i przypisane do dat publikacji.",
    icon: CalendarClock,
  },
];

const faqItems = [
  {
    question: "Czym jest Ranking Top 10?",
    answer:
      "To niezależne zestawienie lokali w konkretnym mieście i kategorii.",
  },
  {
    question: "Jak wybierane są lokale?",
    answer:
      "Pod uwagę brane są m.in. opinie, widoczność oraz jakość profilu lokalnego.",
  },
  {
    question: "Jak często aktualizowany jest ranking?",
    answer:
      "Rankingi aktualizowane są cyklicznie dla wybranych miast i kategorii.",
  },
  {
    question: "Czy każdy lokal może się znaleźć w rankingu?",
    answer:
      "Tak, jeśli spełnia kryteria danej kategorii i został uwzględniony w analizie.",
  },
];

export function HomePage() {
  return (
    <div className="embed-page min-h-full bg-white text-[#202124]">
      <SiteHeader />

      <main>
        <section className="relative overflow-visible">
          <div className="absolute top-0 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#E8F0FE] blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 pt-[100px] pb-20 text-center md:px-6 lg:px-8 lg:pt-[100px] lg:pb-28">
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#FBBC05]/30 bg-[#FFF8E1] px-4 py-2 text-sm font-medium text-[#202124]">
              Aktualne zestawienia wyróżnionych miejsc
            </span>
            <h1 className="mx-auto mt-7 max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.06em] text-[#202124] md:text-7xl">
              TOP 10 lokali w Twoim mieście
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-[#5F6368] md:text-2xl">
              Sprawdź, czy Twój lokal znalazł się w aktualnym rankingu Top 10 w swojej kategorii.
            </p>
            <div id="sprawdz-lokal" className="mx-auto mt-10 max-w-3xl scroll-mt-28 text-left">
              <SearchPanel businesses={businesses} />
            </div>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5F6368]">
              Ranking tworzony na podstawie opinii Google dostępnych na Google Maps.
            </p>

          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24" id="jak-dziala">
          <SectionHeading
            align="center"
            eyebrow="Jak to działa"
            title="Jak powstaje ranking?"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[30px] border border-[#DADCE0] bg-white p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
              >
                <div className="flex size-13 items-center justify-center rounded-2xl bg-[#E8F0FE] text-lg font-semibold text-[#1A73E8]">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-[#202124]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5F6368]">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8 lg:py-24" id="metodologia">
          <SectionHeading
            align="center"
            eyebrow="Wiarygodność"
            title="Na czym opiera się ranking?"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trustCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[30px] border border-[#DADCE0] bg-white p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)]"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F8F9FA] text-[#1A73E8]">
                  <card.icon className="size-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-[#202124]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5F6368]">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14 md:px-6 lg:px-8 lg:py-24" id="faq">
          <SectionHeading
            align="center"
            eyebrow="FAQ"
            title="Najważniejsze pytania"
          />
          <div className="mt-10">
            <Accordion items={faqItems} />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 lg:px-8 lg:py-24">
          <div className="rounded-[42px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] px-6 py-12 text-center shadow-[0_28px_80px_rgba(32,33,36,0.10)] md:px-12 md:py-16">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#E8F0FE] text-[#1A73E8]">
              <Search className="size-6" />
            </div>
            <h2 className="mx-auto mt-6 max-w-3xl text-3xl leading-tight font-semibold tracking-[-0.04em] text-[#202124] md:text-5xl">
              Czy Twój lokal znalazł się w Top 10?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#5F6368]">
              Sprawdź aktualny ranking dla swojej kategorii i miasta.
            </p>
            <div className="mt-8">
              <ButtonLink href="#sprawdz-lokal">Sprawdź lokal</ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <div className="sticky bottom-4 z-40 px-4 md:hidden">
        <div className="mx-auto max-w-md rounded-full border border-[#DADCE0] bg-white/95 p-2 shadow-[0_24px_60px_rgba(32,33,36,0.14)] backdrop-blur">
          <ButtonLink className="w-full" href="#sprawdz-lokal">
            Sprawdź lokal
          </ButtonLink>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
