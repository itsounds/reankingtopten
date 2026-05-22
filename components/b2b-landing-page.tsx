import { ArrowRight, Check, Nfc, QrCode, Smartphone, Star } from "lucide-react";
import Image from "next/image";

import { B2bOrderSection } from "@/components/b2b-order-section";
import { SiteHeader } from "@/components/site-header";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const CTA_ANCHOR = "#odbierz-standy";

const whyCards = [
  {
    title: "Więcej opinii Google",
    body: "Standy NFC + QR skracają drogę klienta do wystawienia opinii.",
  },
  {
    title: "Więcej otwarć wizytówki",
    body: "Każde użycie standu kieruje klienta do wizytówki Google lokalu.",
  },
  {
    title: "Lepsza widoczność lokalna",
    body: "Regularna aktywność wokół wizytówki wspiera pozycjonowanie w Google Maps.",
  },
  {
    title: "Większe zaufanie klientów",
    body: "Aktualne opinie pomagają nowym klientom szybciej podjąć decyzję.",
  },
];

const opinionBenefits = [
  {
    title: "Krótsza ścieżka do opinii",
    body: "Klient nie musi szukać lokalu w Google — wystarczy NFC lub QR.",
  },
  {
    title: "Więcej aktywności na wizytówce",
    body: "Standy zwiększają liczbę wejść na profil Google firmy.",
  },
  {
    title: "Stałe przypomnienie w lokalu",
    body: "Widoczny stand naturalnie zachęca klientów do zostawienia opinii.",
  },
  {
    title: "Lepsza komunikacja z klientem",
    body: "Lokal może szybciej reagować na opinie i budować relacje z klientami.",
  },
];

const opinionFlowSteps = [
  {
    title: "Klient przykłada telefon",
    body: "NFC lub QR",
  },
  {
    title: "Otwiera się wizytówka Google",
    body: "Bez aplikacji",
  },
  {
    title: "Klient zostawia opinię",
    body: "Szybko i wygodnie",
  },
];

const timelineSteps = [
  {
    title: "Klient przykłada telefon",
    body: "NFC lub QR otwiera wizytówkę Google.",
  },
  {
    title: "Wybiera lokal w Google",
    body: "Klient trafia bezpośrednio na właściwy profil firmy.",
  },
  {
    title: "Zostawia opinię",
    body: "Cały proces trwa kilkanaście sekund.",
  },
];

const packageItems = [
  "Do 15 standów NFC + QR",
  "Personalizacja lokalu",
  "Integracja z Google",
  "Darmowa dostawa",
  "Gotowe do użycia",
  "Bez aplikacji",
];

const top10KitItems = [
  "Cyfrowy certyfikat TOP10",
  'Monitor Full HD 15.6"',
  "Mikrokomputer",
  "Ekran do opinii Google",
  "Własne promocje i komunikaty",
  "Nowoczesna ekspozycja lokalu",
];

const statusCards = [
  "Więcej opinii",
  "Więcej wejść na wizytówkę",
  "Większe zaufanie",
  "Lepsza widoczność",
  "Status TOP10",
];

const faqItems = [
  {
    question: "Czy standy są darmowe?",
    answer:
      "Tak. Standy NFC + QR są bezpłatne i zostaną dostarczone na adres lokalu wskazany w formularzu.",
  },
  {
    question: "Jak działają standy?",
    answer:
      "Klient przykłada telefon do standu NFC lub skanuje kod QR, a następnie przechodzi do wizytówki Google lokalu, gdzie może wystawić opinię.",
  },
  {
    question: "Czy potrzebna jest aplikacja?",
    answer:
      "Nie. Klient nie musi instalować żadnej aplikacji. Wystarczy telefon z NFC lub aparat do zeskanowania kodu QR.",
  },
  {
    question: "Czy lokal bierze udział w rankingu TOP10?",
    answer:
      "Tak. Lokale korzystające ze standów biorą udział w rankingu TOP10 lokali w swoim mieście i kategorii.",
  },
  {
    question: "Co dzieje się, jeśli lokal znajdzie się w TOP10?",
    answer:
      "W przypadku gdy lokal znajdzie się w TOP10, przysługuje mu cyfrowy certyfikat wraz z mikrokomputerem i monitorem Full HD. Na ekranie można dodatkowo wyświetlać własne treści, takie jak oferta, promocje lub komunikaty dla klientów.",
  },
  {
    question: "Czy mogę wyświetlać własne treści?",
    answer:
      "Tak. Cyfrowy zestaw TOP10 umożliwia wyświetlanie certyfikatu, ekranu do opinii Google oraz własnych treści lokalu.",
  },
];

const heroChecks = ["NFC + QR", "Więcej opinii Google", "Bez aplikacji", "Darmowa dostawa"];

function CtaBlock({ className, large }: { className?: string; large?: boolean }) {
  return (
    <div className={cn("text-center", className)}>
      <ButtonLink
        className={cn(large && "px-8 py-4 text-base")}
        href={CTA_ANCHOR}
      >
        Odbierz darmowe standy
      </ButtonLink>
    </div>
  );
}

function ImagePlaceholder({
  label,
  className,
  tall,
}: {
  label: string;
  className?: string;
  tall?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] text-center shadow-[0_18px_40px_rgba(32,33,36,0.05)] transition-transform duration-300 hover:-translate-y-1",
        tall ? "min-h-[320px] md:min-h-[420px]" : "min-h-[200px]",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-[#E8F0FE] text-[#1A73E8]">
        <Smartphone className="size-7" />
      </div>
      <p className="max-w-[220px] text-sm leading-6 text-[#5F6368]">{label}</p>
      <span className="text-xs tracking-[0.12em] text-[#9AA0A6] uppercase">Placeholder</span>
    </div>
  );
}

function PremiumCard({
  title,
  body,
  className,
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-[30px] border border-[#DADCE0] bg-white p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(32,33,36,0.10)]",
        className,
      )}
    >
      <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#202124]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#5F6368]">{body}</p>
    </article>
  );
}

function OpinionFlowDiagram() {
  return (
    <div className="space-y-4">
      {opinionFlowSteps.map((step, index) => (
        <div key={step.title}>
          <div className="rounded-[28px] border border-[#DADCE0] bg-white p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)] transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8F0FE] text-base font-semibold text-[#1A73E8]">
                {index + 1}
              </div>
              <div>
                <p className="text-base font-semibold tracking-[-0.02em] text-[#202124]">
                  {step.title}
                </p>
                <p className="mt-1 text-sm text-[#5F6368]">{step.body}</p>
              </div>
            </div>
          </div>
          {index < opinionFlowSteps.length - 1 ? (
            <div className="flex justify-center py-2">
              <ArrowRight className="size-5 rotate-90 text-[#DADCE0]" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-6 rounded-full bg-[#E8F0FE] blur-3xl" />
      <div className="relative grid gap-4">
        <ImagePlaceholder
          label="Stand NFC, telefon i ekran opinii Google 5★"
          tall
          className="animate-fade-in-up-delay-1"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-[24px] border border-[#DADCE0] bg-white p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-2 text-[#1A73E8]">
              <Nfc className="size-5" />
              <span className="text-xs font-medium">NFC</span>
            </div>
            <p className="mt-3 text-sm font-medium text-[#202124]">Dotknij i oceń</p>
          </div>
          <div className="rounded-[24px] border border-[#DADCE0] bg-white p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-2 text-[#1A73E8]">
              <QrCode className="size-5" />
              <span className="text-xs font-medium">QR</span>
            </div>
            <p className="mt-3 text-sm font-medium text-[#202124]">Skanuj kod</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 rounded-[24px] border border-[#FBBC05]/30 bg-[#FFF8E1] px-4 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-6 fill-[#FBBC05] text-[#FBBC05]" />
          ))}
          <span className="ml-2 text-sm font-semibold text-[#202124]">5.0 Google</span>
        </div>
      </div>
    </div>
  );
}

export function B2bLandingPage() {
  return (
    <div className="embed-page min-h-full bg-white text-[#202124]">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute top-0 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#E8F0FE] blur-3xl" />
          <div className="absolute top-32 right-0 h-72 w-72 rounded-full bg-[#FFF8E1] blur-3xl opacity-80" />
          <div className="relative mx-auto max-w-7xl px-4 pt-28 pb-16 md:px-6 lg:px-8 lg:pt-32 lg:pb-24">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <div className="text-center lg:text-left">
                <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-[#FBBC05]/30 bg-[#FFF8E1] px-4 py-2 text-sm font-medium text-[#202124]">
                  Darmowe standy NFC do opinii Google
                </span>
                <h1 className="animate-fade-in-up-delay-1 mt-7 max-w-2xl text-4xl leading-[1.02] font-semibold tracking-[-0.06em] text-[#202124] md:text-6xl lg:mx-0 lg:text-7xl">
                  Więcej opinii Google.
                  <br />
                  Większa widoczność lokalu.
                </h1>
                <p className="animate-fade-in-up-delay-2 mx-auto mt-6 max-w-xl text-lg leading-8 text-[#5F6368] md:text-xl lg:mx-0">
                  Odbierz bezpłatne standy NFC + QR, które ułatwiają klientom wystawianie opinii i
                  zwiększają aktywność wizytówki Google.
                </p>
                <div className="animate-fade-in-up-delay-3 mt-10 lg:mx-0">
                  <CtaBlock />
                </div>
                <ul className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-[#5F6368] lg:mx-0 lg:justify-start">
                  {heroChecks.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-[#34A853]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <HeroMockup />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            align="center"
            title="Więcej opinii = większa widoczność"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {whyCards.map((card) => (
              <PremiumCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F8F9FA_0%,#FFFFFF_100%)] py-16 lg:py-28">
          <div className="absolute inset-x-0 top-0 h-px bg-[#E8EAED]" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <SectionHeading
              align="center"
              title="Prostsze zbieranie opinii od klientów"
              description="Standy pomagają klientom szybko przejść do wizytówki Google i zostawić opinię po wizycie."
            />
            <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <OpinionFlowDiagram />
              <div className="space-y-5">
                {opinionBenefits.map((card) => (
                  <PremiumCard key={card.title} {...card} />
                ))}
                <CtaBlock className="pt-4" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            align="center"
            title="Klient przykłada telefon i wystawia opinię"
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {timelineSteps.map((step, index) => (
              <article
                key={step.title}
                className="relative rounded-[30px] border border-[#DADCE0] bg-white p-8 shadow-[0_18px_40px_rgba(32,33,36,0.06)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex size-13 items-center justify-center rounded-2xl bg-[#E8F0FE] text-lg font-semibold text-[#1A73E8]">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-[#202124]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5F6368]">{step.body}</p>
                {index < timelineSteps.length - 1 ? (
                  <ArrowRight className="absolute top-1/2 -right-4 hidden size-6 text-[#DADCE0] md:block" />
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 md:px-6 lg:px-8 lg:py-28">
          <div className="rounded-[42px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] px-6 py-12 shadow-[0_28px_80px_rgba(32,33,36,0.08)] md:px-12 md:py-16">
            <SectionHeading align="center" title="Bezpłatny zestaw dla lokalu" />
            <ul className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
              {packageItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[#202124]">
                  <Check className="mt-0.5 size-5 shrink-0 text-[#34A853]" />
                  {item}
                </li>
              ))}
            </ul>
            <CtaBlock className="mt-10" large />
          </div>
        </section>

        <section className="relative overflow-hidden py-16 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,188,5,0.12)_0%,transparent_70%)]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6 lg:px-8">
            <span className="inline-flex rounded-full border border-[#FBBC05]/40 bg-[#FFF8E1] px-4 py-2 text-sm font-medium text-[#202124]">
              Dodatkowe wyróżnienie
            </span>
            <h2 className="mt-6 text-3xl leading-tight font-semibold tracking-[-0.04em] text-[#202124] md:text-5xl">
              Dodatkowo lokal bierze udział w rankingu TOP10
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#5F6368] md:text-lg">
              Państwa lokal bierze udział w rankingu TOP10 lokali w Państwa mieście i kategorii.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#5F6368]">
              W przypadku gdy Państwa lokal znajdzie się w TOP10, przysługuje Państwu cyfrowy
              certyfikat wraz z mikrokomputerem i monitorem Full HD, na którym możecie Państwo
              dodatkowo wyświetlać własne treści — ofertę, promocje i komunikaty dla klientów.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <ImagePlaceholder
              label='Monitor 15.6", certyfikat TOP10, ekran opinii Google, QR i treści lokalu'
              tall
              className="shadow-[0_28px_80px_rgba(251,188,5,0.12)]"
            />
            <div>
              <SectionHeading
                title="Cyfrowy certyfikat TOP10"
                description="Cyfrowy zestaw TOP10 pozwala zaprezentować wyróżnienie w lokalu oraz dodatkowo wyświetlać własne treści, takie jak oferta, promocje i komunikaty dla klientów."
              />
              <p className="mt-5 text-sm font-medium text-[#1A73E8]">
                Cyfrowy zestaw TOP10 dla lokali zakwalifikowanych do rankingu: 899 zł netto.
              </p>
              <p className="mt-2 text-sm leading-7 text-[#5F6368]">
                Zestaw obejmuje cyfrowy certyfikat TOP10, monitor Full HD 15.6”, mikrokomputer,
                ekran do opinii Google oraz możliwość wyświetlania własnych treści lokalu.
              </p>
              <ul className="mt-8 space-y-4">
                {top10KitItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[#202124]">
                    <Check className="mt-0.5 size-5 shrink-0 text-[#34A853]" />
                    {item}
                  </li>
                ))}
              </ul>
              <CtaBlock className="mt-10 text-left" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-28">
          <SectionHeading align="center" title="Widoczność, którą zauważają klienci" />
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {statusCards.map((label) => (
              <div
                key={label}
                className="rounded-full border border-[#DADCE0] bg-white px-6 py-4 text-sm font-medium text-[#202124] shadow-[0_12px_30px_rgba(32,33,36,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1A73E8]/25"
              >
                {label}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 lg:px-8 lg:py-28" id="faq">
          <SectionHeading align="center" eyebrow="FAQ" title="Najczęstsze pytania" />
          <div className="mt-10">
            <Accordion items={faqItems} />
          </div>
        </section>

        <B2bOrderSection />
      </main>

      <div className="sticky bottom-4 z-40 px-4 md:hidden">
        <div className="mx-auto max-w-md rounded-full border border-[#DADCE0] bg-white/95 p-2 shadow-[0_24px_60px_rgba(32,33,36,0.14)] backdrop-blur">
          <ButtonLink className="w-full" href={CTA_ANCHOR}>
            Odbierz darmowe standy
          </ButtonLink>
        </div>
      </div>

      <footer className="border-t border-[#E8EAED] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/images/top-ten-small.png"
              alt="Ranking Top 10"
              width={80}
              height={80}
              className="size-20 rounded-2xl"
              unoptimized
            />
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5F6368]">
              Google oraz Google Maps są znakami towarowymi Google LLC.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
