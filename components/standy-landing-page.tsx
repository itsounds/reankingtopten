import {
  ArrowRight,
  Building2,
  Check,
  Coffee,
  Hotel,
  MapPin,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Store,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import { SiteHeader } from "@/components/site-header";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const CTA_ANCHOR = "#kontakt";
const ORDER_PHONE = "+48788733337";
const ORDER_PHONE_DISPLAY = "+48 788 733 337";

const audienceGroups: {
  icon: LucideIcon;
  title: string;
  industries: string[];
}[] = [
  {
    icon: UtensilsCrossed,
    title: "Gastronomia i hotelarstwo",
    industries: ["Hotele", "Restauracje", "Kawiarnie", "Puby"],
  },
  {
    icon: Scissors,
    title: "Uroda i usługi osobiste",
    industries: ["Fryzjerzy", "Barberzy", "Salony piękności"],
  },
  {
    icon: Stethoscope,
    title: "Medycyna i zdrowie",
    industries: [
      "Medycyna estetyczna",
      "Dentyści",
      "Gabinety lekarskie",
      "Prywatne kliniki",
    ],
  },
  {
    icon: Store,
    title: "I wiele innych branż",
    industries: [
      "SPA i wellness",
      "Warsztaty i serwisy",
      "Sklepy lokalne",
      "Usługi i showroomy",
    ],
  },
];

const whyCards = [
  {
    title: "Więcej opinii Google",
    body: "Standy NFC + QR skracają drogę klienta do wystawienia opinii.",
  },
  {
    title: "Więcej otwarć wizytówki",
    body: "Każde użycie standu kieruje klienta do wizytówki Google firmy.",
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
    body: "Klient nie musi szukać firmy w Google — wystarczy NFC lub QR.",
  },
  {
    title: "Więcej aktywności na wizytówce",
    body: "Standy zwiększają liczbę wejść na profil Google firmy.",
  },
  {
    title: "Stałe przypomnienie na miejscu",
    body: "Widoczny stand naturalnie zachęca klientów do zostawienia opinii.",
  },
  {
    title: "Lepsza komunikacja z klientem",
    body: "Firma może szybciej reagować na opinie i budować relacje z klientami.",
  },
];

const opinionFlowSteps = [
  { title: "Klient przykłada telefon", body: "NFC lub QR" },
  { title: "Otwiera się wizytówka Google", body: "Bez aplikacji" },
  { title: "Klient zostawia opinię", body: "Szybko i wygodnie" },
];

const timelineSteps = [
  {
    title: "Klient przykłada telefon",
    body: "NFC lub QR otwiera wizytówkę Google.",
  },
  {
    title: "Trafia na profil firmy",
    body: "Klient otwiera właściwą wizytówkę Google bez wyszukiwania.",
  },
  {
    title: "Zostawia opinię",
    body: "Cały proces trwa kilkanaście sekund.",
  },
];

const STAND_TROJKATNY_IMAGE = "/images/stand-trojkatny-2.jpg";
const STAND_KARTY_IMAGE = "/images/stand-karty.jpg";

const products = [
  {
    id: "trojkatny",
    title: "Stand trójkątny",
    imageSrc: STAND_TROJKATNY_IMAGE,
    imageRounded: true,
    features: [
      "Dwie ścianki z kodem QR",
      "Jedna ścianka z chipsem NFC",
      "Twardy papier 350 g — ekspozycja w recepcji, na barze lub w strefie wejścia",
      "Personalizacja pod firmę i wizytówkę Google",
    ],
  },
  {
    id: "karty",
    title: "Karty do zbierania opinii",
    imageSrc: STAND_KARTY_IMAGE,
    imageRounded: false,
    features: [
      "Format jak karta kredytowa",
      "1× NFC + 1× QR na każdej karcie",
      "Drewniana podstawka — recepcja, bar lub strefa obsługi",
      "Idealne na stoliki, ladę recepcyjną i punkty kontaktu z gościem",
    ],
  },
];

const packageItems = [
  "Personalizacja pod firmę",
  "Integracja z wizytówką Google",
  "Gotowe do użycia po dostawie",
  "Bez aplikacji po stronie klienta",
  "NFC + QR w jednym produkcie",
  "Wsparcie przy konfiguracji linku",
];

const statusCards = [
  "Więcej opinii",
  "Więcej wejść na wizytówkę",
  "Większe zaufanie",
  "Lepsza widoczność",
  "Ekspozycja w firmie",
];

const faqItems = [
  {
    question: "Ile kosztują standy?",
    answer:
      "Cena detaliczna to 99 zł za sztukę. Przy zamówieniu hurtowym od 20 sztuk cena wynosi 59 zł za sztukę.",
  },
  {
    question: "Jak działają standy?",
    answer:
      "Klient przykłada telefon do chipu NFC lub skanuje kod QR, a następnie przechodzi do wizytówki Google firmy, gdzie może wystawić opinię.",
  },
  {
    question: "Czy potrzebna jest aplikacja?",
    answer:
      "Nie. Klient nie musi instalować żadnej aplikacji. Wystarczy telefon z NFC lub aparat do zeskanowania kodu QR.",
  },
  {
    question: "Jakie produkty są dostępne?",
    answer:
      "Oferujemy stand trójkątny (QR na dwóch ściankach, NFC na jednej, papier 350 g) oraz karty wielkości karty kredytowej z NFC i QR wraz z drewnianą podstawką.",
  },
  {
    question: "Czy można zamówić personalizację?",
    answer:
      "Tak. Każdy stand lub zestaw kart jest personalizowany pod firmę i link do wizytówki Google.",
  },
  {
    question: "Kto odpowiada za dystrybucję w Polsce?",
    answer:
      "Wyłączną dystrybucję standów do zbierania opinii Google na terenie Polski prowadzi Keen Group Sp. z o.o.",
  },
];

const heroChecks = [
  "NFC + QR",
  "Więcej opinii Google",
  "Bez aplikacji",
  "99 zł detal / 59 zł hurt",
];

const simplicityItems = [
  "Karta i stojak są już zaprogramowane specjalnie dla Twojej firmy",
  "Wystarczy je złożyć i umieścić w widocznym miejscu — recepcja, bar lub strefa obsługi",
  "Klienci mogą od razu zostawiać opinie — szybko i bez przeszkód",
  "Bez konfiguracji, bez komplikacji — po prostu działają",
  "Bez pobierania aplikacji, bez logowania, bez rejestracji — dosłownie w kilka sekund",
  "Bez abonamentu i bez subskrypcji — bez ukrytych opłat cyklicznych",
];

function CtaBlock({ className, large }: { className?: string; large?: boolean }) {
  return (
    <div className={cn("text-center", className)}>
      <ButtonLink className={cn(large && "px-8 py-4 text-base")} href={CTA_ANCHOR}>
        Zapytaj o standy
      </ButtonLink>
    </div>
  );
}

function OrderPhoneButton({ className }: { className?: string }) {
  return (
    <ButtonLink className={cn("gap-2", className)} href={`tel:${ORDER_PHONE}`}>
      <Phone className="size-4" />
      Zamówienia: {ORDER_PHONE_DISPLAY}
    </ButtonLink>
  );
}

function AudienceCard({
  icon: Icon,
  title,
  industries,
}: {
  icon: LucideIcon;
  title: string;
  industries: string[];
}) {
  return (
    <article className="rounded-[30px] border border-[#DADCE0] bg-white p-6 shadow-[0_18px_40px_rgba(32,33,36,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(32,33,36,0.10)]">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E8F0FE] text-[#1A73E8]">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-[#202124]">{title}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {industries.map((industry) => (
          <li
            key={industry}
            className="rounded-full border border-[#E8EAED] bg-[#F8F9FA] px-3 py-1.5 text-xs font-medium text-[#202124]"
          >
            {industry}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ProductPhoto({
  src,
  alt,
  rounded,
  className,
}: {
  src: string;
  alt: string;
  rounded?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full bg-[#F8F9FA]",
        rounded && "overflow-hidden rounded-[30px]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={960}
        height={720}
        className="h-auto w-full object-contain"
        priority={rounded}
        unoptimized
      />
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
    <div className="relative mx-auto w-full max-w-xl animate-fade-in-up-delay-1">
      <div className="absolute -inset-6 rounded-full bg-[#E8F0FE] blur-3xl" />
      <div className="relative">
        <ProductPhoto
          src={STAND_TROJKATNY_IMAGE}
          alt="Stand trójkątny NFC + QR do opinii Google"
          rounded
          className="shadow-[0_24px_60px_rgba(32,33,36,0.12)]"
        />
      </div>
    </div>
  );
}

function PricingCards() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      <article className="rounded-[30px] border border-[#DADCE0] bg-white p-8 text-center shadow-[0_18px_40px_rgba(32,33,36,0.06)]">
        <p className="text-sm font-medium tracking-[0.12em] text-[#5F6368] uppercase">Detal</p>
        <p className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-[#202124]">99 zł</p>
        <p className="mt-2 text-sm text-[#5F6368]">za sztukę</p>
      </article>
      <article className="rounded-[30px] border border-[#1A73E8]/25 bg-[linear-gradient(180deg,#E8F0FE_0%,#FFFFFF_100%)] p-8 text-center shadow-[0_18px_40px_rgba(26,115,232,0.10)]">
        <p className="text-sm font-medium tracking-[0.12em] text-[#1A73E8] uppercase">Hurt</p>
        <p className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-[#202124]">59 zł</p>
        <p className="mt-2 text-sm text-[#5F6368]">za sztukę przy zamówieniu od 20 szt.</p>
      </article>
    </div>
  );
}

export function StandyLandingPage() {
  return (
    <div className="embed-page min-h-full bg-white text-[#202124]">
      <SiteHeader ctaHref={CTA_ANCHOR} ctaLabel="Zapytaj o standy" logoHref="/standy" />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute top-0 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#E8F0FE] blur-3xl" />
          <div className="absolute top-32 right-0 h-72 w-72 rounded-full bg-[#FFF8E1] blur-3xl opacity-80" />
          <div className="relative mx-auto max-w-7xl px-4 pt-28 pb-16 md:px-6 lg:px-8 lg:pt-32 lg:pb-24">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <div className="text-center lg:text-left">
                <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-[#FBBC05]/30 bg-[#FFF8E1] px-4 py-2 text-sm font-medium text-[#202124]">
                  Standy NFC + QR do opinii Google
                </span>
                <h1 className="animate-fade-in-up-delay-1 mt-7 max-w-2xl text-4xl leading-[1.02] font-semibold tracking-[-0.06em] text-[#202124] md:text-6xl lg:mx-0 lg:text-7xl">
                  Więcej opinii Google.
                  <br />
                  Większa widoczność firmy.
                </h1>
                <p className="animate-fade-in-up-delay-2 mx-auto mt-6 max-w-xl text-lg leading-8 text-[#5F6368] md:text-xl lg:mx-0">
                  Profesjonalne standy i karty NFC + QR ułatwiają klientom wystawianie opinii i
                  zwiększają aktywność wizytówki Google.
                </p>
                <div className="animate-fade-in-up-delay-3 mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                  <div className="rounded-full border border-[#DADCE0] bg-white px-5 py-2 text-sm font-semibold text-[#202124] shadow-sm">
                    Detal: <span className="text-[#1A73E8]">99 zł</span>
                  </div>
                  <div className="rounded-full border border-[#1A73E8]/30 bg-[#E8F0FE] px-5 py-2 text-sm font-semibold text-[#202124]">
                    Hurt (od 20 szt.): <span className="text-[#1A73E8]">59 zł</span>
                  </div>
                </div>
                <div className="mt-10 lg:mx-0">
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
          <SectionHeading align="center" title="Więcej opinii = większa widoczność" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {whyCards.map((card) => (
              <PremiumCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden py-16 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,188,5,0.10)_0%,transparent_70%)]" />
          <div className="relative mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
            <div className="rounded-[42px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8E1_100%)] px-6 py-12 text-center shadow-[0_28px_80px_rgba(32,33,36,0.08)] md:px-12 md:py-16">
              <h2 className="flex flex-wrap items-center justify-center gap-2 text-3xl leading-tight font-semibold tracking-[-0.04em] text-[#202124] md:text-5xl">
                <span>Chcesz zbierać same</span>
                <span className="inline-flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-7 fill-[#FBBC05] text-[#FBBC05] md:size-8" />
                  ))}
                </span>
                <span>w Google?</span>
              </h2>
              <p className="mx-auto mt-8 max-w-2xl text-left text-base leading-8 text-[#202124] md:text-lg md:text-center">
                Dostarczamy{" "}
                <span className="font-semibold">efektywne rozwiązanie</span>, dzięki któremu to{" "}
                <span className="font-semibold">zadowoleni klienci</span> zostawiają opinię — i to{" "}
                <span className="font-semibold text-[#E37400]">wysoko ocenianą</span>. Każda opinia
                wspiera widoczność Twojej firmy w Google Maps.
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-left text-base leading-8 text-[#5F6368] md:text-center">
                Proste w obsłudze? Bardzo. Skuteczne w budowaniu reputacji? Jeszcze bardziej.
              </p>
              <p className="mt-10 text-lg font-semibold text-[#202124]">
                Chcesz u siebie?{" "}
                <span className="text-[#1A73E8]">Zadzwoń — zamów standy już dziś.</span>
              </p>
              <div className="mt-6 flex justify-center">
                <OrderPhoneButton className="px-8 py-4 text-base" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 md:px-6 lg:px-8 lg:py-28">
          <div className="rounded-[42px] border border-[#DADCE0] bg-white px-6 py-12 shadow-[0_28px_80px_rgba(32,33,36,0.08)] md:px-12 md:py-16">
            <span className="inline-flex rounded-full bg-[#E8F0FE] px-4 py-2 text-sm font-medium text-[#1A73E8]">
              Gotowe do użycia
            </span>
            <h2 className="mt-6 text-3xl leading-tight font-semibold tracking-[-0.04em] text-[#202124] md:text-5xl">
              Jakie to jest proste
            </h2>
            <p className="mt-4 text-xl leading-8 text-[#202124] md:text-2xl">
              Bez konfiguracji. Bez instalacji.{" "}
              <span className="text-[#1A73E8]">Po prostu działa!</span>
            </p>
            <ul className="mt-10 space-y-5">
              {simplicityItems.map((item) => (
                <li key={item} className="flex items-start gap-4 text-base leading-8 text-[#202124]">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E6F4EA]">
                    <Check className="size-4 text-[#34A853]" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
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
          <SectionHeading align="center" title="Klient przykłada telefon i wystawia opinię" />
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

        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F8F9FA_0%,#FFFFFF_100%)] py-16 lg:py-28">
          <div className="absolute inset-x-0 top-0 h-px bg-[#E8EAED]" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <SectionHeading
              align="center"
              title="Dla kogo?"
              description="Standy NFC + QR sprawdzają się wszędzie tam, gdzie klienci odwiedzają firmę i mogą zostawić opinię w Google — od hotelu i restauracji po gabinet lekarski."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {audienceGroups.map((group) => (
                <AudienceCard key={group.title} {...group} />
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[#5F6368]">
              <span className="flex items-center gap-2 text-sm">
                <Hotel className="size-4 text-[#1A73E8]" />
                HoReCa
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Coffee className="size-4 text-[#1A73E8]" />
                Gastronomia
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Wine className="size-4 text-[#1A73E8]" />
                Puby i bary
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Sparkles className="size-4 text-[#1A73E8]" />
                Uroda
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Building2 className="size-4 text-[#1A73E8]" />
                Medycyna
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-28" id="produkty">
          <SectionHeading
            align="center"
            title="Standy"
            description="Dwa formaty produktów do zbierania opinii Google — wybierz ekspozycję dopasowaną do firmy i miejsca obsługi klienta."
          />
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[34px] border border-[#DADCE0] bg-white shadow-[0_24px_60px_rgba(32,33,36,0.08)]"
              >
                {product.imageRounded ? (
                  <div className="p-6 pb-0">
                    <ProductPhoto
                      src={product.imageSrc}
                      alt={product.title}
                      rounded
                    />
                  </div>
                ) : (
                  <ProductPhoto src={product.imageSrc} alt={product.title} />
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#202124]">
                    {product.title}
                  </h3>
                  <ul className="mt-6 space-y-3">
                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-7 text-[#202124]"
                      >
                        <Check className="mt-0.5 size-5 shrink-0 text-[#34A853]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 md:px-6 lg:px-8 lg:py-28">
          <div className="rounded-[42px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] px-6 py-12 shadow-[0_28px_80px_rgba(32,33,36,0.08)] md:px-12 md:py-16">
            <SectionHeading
              align="center"
              title="Cennik"
              description="Przejrzyste ceny detaliczne i hurtowe dla partnerów oraz firm."
            />
            <PricingCards />
            <CtaBlock className="mt-10" large />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 md:px-6 lg:px-8 lg:py-28">
          <div className="rounded-[42px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] px-6 py-12 shadow-[0_28px_80px_rgba(32,33,36,0.08)] md:px-12 md:py-16">
            <SectionHeading align="center" title="Co otrzymujesz w zamówieniu" />
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

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            align="center"
            eyebrow="Dystrybucja"
            title="Wyłączna dystrybucja w Polsce"
            description="Standy do zbierania opinii Google są dystrybuowane wyłącznie przez autoryzowanego partnera na terenie Polski."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[30px] border border-[#DADCE0] bg-white p-8 shadow-[0_18px_40px_rgba(32,33,36,0.06)]">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#F8F9FA] text-[#1A73E8]">
                <Store className="size-5" />
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-[#202124]">
                Keen Group Sp. z o.o.
              </h3>
              <p className="mt-3 flex items-start gap-2 text-sm leading-7 text-[#5F6368]">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#1A73E8]" />
                <span>
                  Al. Jerozolimskie 89/43
                  <br />
                  02-001 Warszawa
                </span>
              </p>
              <p className="mt-4 text-sm leading-7 text-[#5F6368]">
                Wyłączny dystrybutor standów na terenie Polski. Obsługa zamówień hurtowych i
                współpracy B2B.
              </p>
            </article>
            <article className="flex flex-col rounded-[30px] border border-[#1A73E8]/20 bg-[linear-gradient(180deg,#E8F0FE_0%,#FFFFFF_100%)] p-8 shadow-[0_18px_40px_rgba(26,115,232,0.08)]">
              <div className="flex items-start gap-5">
                <Image
                  src="/images/mati.jpg"
                  alt="Mateusz Chojnowski"
                  width={80}
                  height={80}
                  className="size-20 shrink-0 rounded-2xl object-cover"
                  unoptimized
                />
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-[#1A73E8]" />
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#202124]">
                      Mateusz Chojnowski
                    </h3>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#1A73E8]">CSO</p>
                  <p className="mt-3 text-sm leading-7 text-[#5F6368]">
                    Wyłączna dystrybucja standów NFC + QR do zbierania opinii Google — zamówienia,
                    personalizacja
                    i wdrożenie w firmie.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <OrderPhoneButton className="w-full sm:w-auto" />
              </div>
            </article>
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

        <section
          id="kontakt"
          className="mx-auto max-w-5xl scroll-mt-28 px-4 py-16 md:px-6 lg:px-8 lg:pb-32"
        >
          <div className="rounded-[42px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] px-6 py-14 text-center shadow-[0_28px_80px_rgba(32,33,36,0.10)] md:px-12 md:py-20">
            <h2 className="mx-auto max-w-3xl text-3xl leading-tight font-semibold tracking-[-0.04em] text-[#202124] md:text-5xl">
              Zapytaj o standy NFC + QR
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#5F6368] md:text-lg">
              Skontaktuj się w sprawie zamówienia, personalizacji lub współpracy hurtowej. Detal: 99
              zł/szt. • Hurt od 20 szt.: 59 zł/szt.
            </p>
            <div className="mx-auto mt-10 max-w-lg rounded-[28px] border border-[#E8EAED] bg-white p-6 text-left shadow-sm">
              <p className="text-sm font-semibold text-[#202124]">Keen Group Sp. z o.o.</p>
              <p className="mt-2 text-sm leading-7 text-[#5F6368]">
                Al. Jerozolimskie 89/43
                <br />
                02-001 Warszawa
              </p>
              <div className="mt-6 border-t border-[#E8EAED] pt-6">
                <p className="text-sm font-semibold text-[#202124]">Mateusz Chojnowski</p>
                <p className="mt-1 text-sm font-medium text-[#1A73E8]">CSO</p>
                <p className="mt-2 text-sm leading-7 text-[#5F6368]">
                  Wyłączna dystrybucja standów do zbierania opinii Google
                </p>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <OrderPhoneButton className="px-8 py-4 text-base" />
            </div>
          </div>
        </section>
      </main>

      <div className="sticky bottom-4 z-40 px-4 md:hidden">
        <div className="mx-auto max-w-md rounded-full border border-[#DADCE0] bg-white/95 p-2 shadow-[0_24px_60px_rgba(32,33,36,0.14)] backdrop-blur">
          <ButtonLink className="w-full" href={CTA_ANCHOR}>
            Zapytaj o standy
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
      <div aria-hidden="true" className="h-[50vh] md:h-[75vh]" />
    </div>
  );
}
