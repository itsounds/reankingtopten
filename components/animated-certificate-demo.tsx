"use client";

import { Star } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";

const stars = Array.from({ length: 5 });

type ActiveDemoPlace = {
  entryId: number;
  title: string;
  searchPhrase: string;
  rankingCreatedAt: string;
};

export function AnimatedCertificateDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSlide, setActiveSlide] = useState<"certificate" | "review">("certificate");
  const [activeDemo, setActiveDemo] = useState<ActiveDemoPlace | null>(null);
  const activeEntryIdRef = useRef<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsPlaying(true));
    const slideTimeout = window.setTimeout(() => setActiveSlide("review"), 30000);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(slideTimeout);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchActiveDemo = async () => {
      try {
        const response = await fetch("/api/active-demo.php", {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });
        const payload = await response.json();
        const nextActive = (payload.active ?? null) as ActiveDemoPlace | null;
        const nextEntryId = nextActive?.entryId ?? null;

        if (cancelled) {
          return;
        }

        if (activeEntryIdRef.current !== null && nextEntryId !== activeEntryIdRef.current) {
          window.location.reload();
          return;
        }

        activeEntryIdRef.current = nextEntryId;
        setActiveDemo(nextActive);
      } catch {
        // Demo keeps its fallback content if the API is temporarily unavailable.
      }
    };

    fetchActiveDemo();
    const interval = window.setInterval(fetchActiveDemo, 3000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const demoTitle = activeDemo?.title ?? "Pizzeria Sicilia Marco Giuliano";
  const demoCategory = activeDemo?.searchPhrase ?? "Najlepsza Restauracja";
  const demoDate = activeDemo?.rankingCreatedAt
    ? formatPolishMonthYear(activeDemo.rankingCreatedAt)
    : "Marzec 2026";

  return (
    <main
      className="min-h-[100dvh] overflow-hidden bg-[#f4f2ef] bg-cover bg-center bg-no-repeat text-[#080808]"
      style={{ backgroundImage: "url('/images/cert-bgr.png')" }}
    >
      <section className="mx-auto flex min-h-[100dvh] w-full items-center justify-center">
        <article
          className="relative h-[100dvh] w-full overflow-hidden"
          data-playing={isPlaying ? "true" : "false"}
          data-slide={activeSlide}
        >
          <div className="certificate-slide-one relative flex h-full flex-col items-center px-[6%] pt-[4.6%] pb-[4.2%] text-center">
            <div className="certificate-title-mask">
              <h1 className="certificate-title font-serif text-[clamp(1.9rem,5vw,4.1rem)] leading-none font-normal tracking-[0.28em] uppercase">
                Certyfikat Top 10
              </h1>
            </div>

            <div className="mt-[4.2%] flex items-center justify-center gap-[2.2%] text-[#fbbc05]">
              {stars.map((_, index) => (
                <Star
                  key={index}
                  className="certificate-star size-[clamp(1.4rem,3.2vw,2.65rem)] fill-current stroke-current"
                  style={{ "--star-index": index } as CSSProperties}
                />
              ))}
            </div>

            <p className="certificate-flip mt-[4.4%] font-serif text-[clamp(1.1rem,3vw,2.15rem)] leading-none tracking-[0.32em] uppercase">
              Najwyżej ocenianych lokali
            </p>

            <p className="certificate-blur mt-[3.4%] font-serif text-[clamp(0.9rem,1.8vw,1.45rem)] leading-none font-bold tracking-[0.12em]">
              przyznany dla:
            </p>

            <p className="certificate-strong mt-[3.4%] max-w-[82%] font-['Brush_Script_MT','Segoe_Print',cursive] text-[clamp(1.7rem,4.8vw,4rem)] leading-tight">
              {demoTitle}
            </p>

            <dl className="certificate-details mt-[2.7%] grid grid-cols-[auto_auto] gap-x-8 gap-y-2 text-left font-serif text-[clamp(0.85rem,1.9vw,1.45rem)] leading-tight tracking-[0.08em]">
              <dt className="font-bold">Kategoria:</dt>
              <dd className="font-bold">{demoCategory}</dd>
              <dt className="font-bold">Miasto:</dt>
              <dd className="font-bold">Poznań</dd>
              <dt className="font-bold">Data:</dt>
              <dd className="font-bold">{demoDate}</dd>
            </dl>
          </div>

          <div className="certificate-slide-two absolute inset-0 flex items-center justify-center px-[9%] py-[7%]">
            <div className="grid w-full grid-cols-[1fr_1fr] items-center gap-[8%]">
              <div className="review-google-block flex flex-col items-center text-center">
                <GoogleGLogo />
                <p className="mt-[9%] font-[var(--font-google-sans)] text-[clamp(1.6rem,4.1vw,3.35rem)] leading-[1.18] font-normal tracking-[-0.055em] text-[#5f6368]">
                  oceń nas
                  <br />
                  <span className="text-[1.24em] tracking-[-0.065em]">na Google</span>
                </p>
              </div>

              <div className="review-qr-block flex flex-col items-center text-center">
                <QrPlaceholder />
                <p className="mt-[7%] font-['Open_Sans',Arial,sans-serif] text-[clamp(1.45rem,3.4vw,2.85rem)] leading-[1.28] font-normal text-[#a5a5a5]">
                  Zeskanuj kod
                  <br />i oceń nas
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap");

        .certificate-slide-one {
          opacity: 1;
          transform: scale(1);
          transition:
            opacity 900ms ease,
            transform 900ms ease;
        }

        [data-slide="review"] .certificate-slide-one {
          opacity: 0;
          transform: scale(0.985);
          pointer-events: none;
        }

        .certificate-slide-two {
          opacity: 0;
          transform: translateY(20px) scale(1.015);
          pointer-events: none;
        }

        [data-slide="review"] .certificate-slide-two {
          animation: review-slide-in 900ms cubic-bezier(0.22, 1, 0.36, 1) 220ms forwards;
          pointer-events: auto;
        }

        .review-google-block {
          opacity: 0;
        }

        .review-qr-block {
          opacity: 0;
        }

        [data-slide="review"] .review-google-block {
          animation: review-fade-in 720ms ease-out 560ms forwards;
        }

        [data-slide="review"] .review-qr-block {
          animation: review-fade-in 720ms ease-out 920ms forwards;
        }

        .certificate-title-mask {
          clip-path: inset(0 100% 0 0);
          overflow: hidden;
        }

        [data-playing="true"] .certificate-title-mask {
          animation: certificate-reveal-left 900ms cubic-bezier(0.22, 1, 0.36, 1) 180ms forwards;
        }

        .certificate-title {
          transform: translateX(-10%);
        }

        [data-playing="true"] .certificate-title {
          animation: certificate-title-drift 900ms cubic-bezier(0.22, 1, 0.36, 1) 180ms forwards;
        }

        .certificate-star {
          opacity: 0;
          transform: translateY(14px) scale(0.35) rotate(-18deg);
        }

        [data-playing="true"] .certificate-star {
          animation: certificate-star-series 560ms cubic-bezier(0.18, 1.35, 0.32, 1) forwards;
          animation-delay: calc(980ms + (var(--star-index) * 72ms));
        }

        .certificate-flip {
          opacity: 0;
          transform: translateX(-28%) rotateY(-86deg);
          transform-origin: left center;
        }

        [data-playing="true"] .certificate-flip {
          animation: certificate-left-flip 820ms cubic-bezier(0.2, 0.9, 0.24, 1) 1500ms forwards;
        }

        .certificate-blur {
          opacity: 0;
          filter: blur(12px);
          transform: translateY(8px);
        }

        [data-playing="true"] .certificate-blur {
          animation: certificate-blur-in 620ms ease-out 2320ms forwards;
        }

        .certificate-strong {
          opacity: 0;
          transform: translateY(26px) scale(0.72);
          filter: blur(2px);
        }

        [data-playing="true"] .certificate-strong {
          animation: certificate-strong-enter 700ms cubic-bezier(0.17, 1.5, 0.36, 1) 2900ms forwards;
        }

        .certificate-details {
          opacity: 0;
          transform: translateY(12px);
        }

        [data-playing="true"] .certificate-details {
          animation: certificate-fade-in 620ms ease-out 3680ms forwards;
        }

        @keyframes certificate-reveal-left {
          from {
            clip-path: inset(0 100% 0 0);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }

        @keyframes certificate-title-drift {
          from {
            transform: translateX(-10%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes certificate-star-series {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.35) rotate(-18deg);
          }
          62% {
            opacity: 1;
            transform: translateY(-4px) scale(1.2) rotate(7deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0);
          }
        }

        @keyframes certificate-left-flip {
          0% {
            opacity: 0;
            transform: translateX(-28%) rotateY(-86deg);
          }
          64% {
            opacity: 1;
            transform: translateX(2%) rotateY(8deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
          }
        }

        @keyframes certificate-blur-in {
          from {
            opacity: 0;
            filter: blur(12px);
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        }

        @keyframes certificate-strong-enter {
          0% {
            opacity: 0;
            filter: blur(2px);
            transform: translateY(26px) scale(0.72);
          }
          58% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(-3px) scale(1.08);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) scale(1);
          }
        }

        @keyframes certificate-fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes review-slide-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(1.015);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes review-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .certificate-title-mask {
            clip-path: inset(0 0 0 0);
          }

          .certificate-title,
          .certificate-star,
          .certificate-flip,
          .certificate-blur,
          .certificate-strong,
          .certificate-details {
            animation: none !important;
            opacity: 1;
            filter: none;
            transform: none;
          }

          .certificate-slide-one,
          .certificate-slide-two,
          .review-google-block,
          .review-qr-block {
            animation: none !important;
            transition: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}

function formatPolishMonthYear(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Marzec 2026";
  }

  const formatted = new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function GoogleGLogo() {
  return (
    <svg
      aria-label="Google"
      className="w-[clamp(7rem,19vw,15.5rem)]"
      viewBox="0 0 24 24"
      role="img"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function QrPlaceholder() {
  return (
    <svg
      aria-label="Kod QR"
      className="w-[clamp(8rem,22vw,17.5rem)]"
      viewBox="0 0 29 29"
      role="img"
      shapeRendering="crispEdges"
    >
      <rect width="29" height="29" fill="#fff" />
      {[
        "111111100101101111111",
        "100000101110101000001",
        "101110100011101011101",
        "101110101010001011101",
        "101110101111101011101",
        "100000100010001000001",
        "111111101010101111111",
        "000000001110100000000",
        "101011111001111010111",
        "001101000111001110010",
        "111001111010111001111",
        "100111001110001011000",
        "011000101011101110101",
        "111010111000111001011",
        "001110001111000111100",
        "101001111010101000111",
        "000000001001101011010",
        "111111101111001010111",
        "100000101001111010001",
        "101110101110001011101",
        "101110100011111001101",
        "101110101101001111001",
        "100000101011101000101",
        "111111101100111101111",
      ].map((row, y) =>
        [...row].map((cell, x) =>
          cell === "1" ? (
            <rect key={`${x}-${y}`} x={x + 3} y={y + 3} width="1" height="1" fill="#000" />
          ) : null,
        ),
      )}
    </svg>
  );
}
