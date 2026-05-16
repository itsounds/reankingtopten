import {
  Award,
  BadgePercent,
  ChartNoAxesColumn,
  FileText,
  MonitorPlay,
  ShieldCheck,
  Star,
  Trophy,
} from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type VisualProps = {
  className?: string;
};

export function BrowserRankingMockup({ className }: VisualProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-full min-w-0 overflow-hidden rounded-[32px] border border-[#DADCE0] bg-white p-4 shadow-[0_30px_80px_rgba(32,33,36,0.12)]",
        className,
      )}
    >
      <div className="absolute inset-x-8 top-0 h-32 rounded-full bg-[#1A73E8]/10 blur-3xl" />
      <div className="relative rounded-[26px] border border-[#E8EAED] bg-[#F8F9FA] p-4">
        <div className="mb-4 flex items-center gap-2 border-b border-[#E8EAED] pb-4">
          <span className="size-3 rounded-full bg-[#EA4335]" />
          <span className="size-3 rounded-full bg-[#FBBC05]" />
          <span className="size-3 rounded-full bg-[#34A853]" />
          <div className="ml-3 h-10 min-w-0 flex-1 truncate rounded-full border border-[#DADCE0] bg-white px-4 text-sm leading-10 text-[#5F6368]">
            rankingtop10.com/poznan/restauracje-azjatyckie
          </div>
        </div>
        <div className="grid min-w-0 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3 rounded-[24px] border border-[#E8EAED] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-[0.12em] text-[#5F6368] uppercase">
                  Ranking Top 10
                </p>
                <h3 className="mt-1 text-xl font-semibold text-[#202124]">
                  Restauracje azjatyckie
                </h3>
              </div>
              <div className="rounded-full bg-[#E8F0FE] px-3 py-1 text-xs font-medium text-[#1A73E8]">
                Poznań
              </div>
            </div>
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={cn(
                  "flex items-center gap-4 rounded-[20px] border p-4 transition-transform duration-200 hover:-translate-y-0.5",
                  item === 4
                    ? "border-[#1A73E8]/25 bg-[#E8F0FE]/60"
                    : "border-[#E8EAED] bg-[#F8F9FA]",
                )}
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-base font-semibold text-[#202124] shadow-sm">
                  #{item}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#202124]">
                    {item === 1
                      ? "Yatta Ramen House"
                      : item === 2
                        ? "Tokyo Bistro"
                        : item === 3
                          ? "Noodle Garden"
                          : "Mori Mori Poznań"}
                  </p>
                  <p className="text-xs text-[#5F6368]">ul. Ratajczaka 21, Poznań</p>
                </div>
                <Star className="size-4 text-[#FBBC05]" />
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-[24px] border border-[#E8EAED] bg-white p-5">
            <div className="rounded-[20px] bg-[#F8F9FA] p-4">
              <p className="text-sm text-[#5F6368]">Wyróżniony lokal</p>
              <h4 className="mt-2 text-2xl font-semibold text-[#202124]">#4 Mori Mori Poznań</h4>
              <p className="mt-2 text-sm leading-7 text-[#5F6368]">
                Status w aktualnym zestawieniu z dnia 12.04.2026.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Oficjalne dane", Icon: ShieldCheck },
                { label: "Autorski model", Icon: ChartNoAxesColumn },
                { label: "Certyfikat", Icon: Award },
                { label: "Monitor 15.6", Icon: MonitorPlay },
              ].map(({ label, Icon }) => (
                <div key={label} className="rounded-[20px] border border-[#E8EAED] bg-[#F8F9FA] p-4">
                  <Icon className="size-5 text-[#1A73E8]" />
                  <p className="mt-4 text-sm font-medium text-[#202124]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PackageShowcase({ className }: VisualProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)] p-4 shadow-[0_30px_80px_rgba(32,33,36,0.10)]",
        className,
      )}
    >
      <Image
        src="/images/cert-display.png"
        alt="Cyfrowy certyfikat Top 10 na ekranie"
        width={700}
        height={700}
        className="h-auto w-full rounded-[28px] object-cover"
        unoptimized
      />
    </div>
  );
}

export function InteriorScene({ className }: VisualProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-[#DADCE0] bg-[linear-gradient(180deg,#FFF_0%,#F4F7FB_100%)] p-8 shadow-[0_30px_80px_rgba(32,33,36,0.10)]",
        className,
      )}
    >
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(218,220,224,0.22)_100%)]" />
      <div className="relative mx-auto flex min-h-[380px] max-w-xl items-end justify-between gap-6">
        <div className="w-24 rounded-t-[28px] bg-[#F1F3F4] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div className="h-44 rounded-t-[28px] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF3FB_100%)]" />
        </div>
        <div className="mb-8 flex-1 rounded-[28px] border border-[#DADCE0] bg-white p-5 shadow-[0_18px_40px_rgba(32,33,36,0.08)]">
          <div className="rounded-[24px] border border-[#E8EAED] bg-[#F8F9FA] p-4">
            <div className="rounded-[18px] bg-[linear-gradient(135deg,#E8F0FE_0%,#FFFFFF_55%,#FFF4E5_100%)] p-5">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#1A73E8]">
                Wyróżnienie Top 10
              </span>
              <div className="mt-12 h-32 rounded-[22px] bg-white/90 shadow-sm" />
            </div>
          </div>
        </div>
        <div className="w-28 rounded-t-[32px] bg-[#E8EAED]">
          <div className="h-52 rounded-t-[32px] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F9FA_100%)]" />
        </div>
      </div>
    </div>
  );
}

export function ScreenShowcase({ className }: VisualProps) {
  return (
    <div className={cn("grid gap-5 md:grid-cols-3", className)}>
      {[
        {
          title: "Wyróżnienie Top 10",
          badge: "Top 10",
          body: "Widoczny status miejsca w aktualnym zestawieniu.",
          icon: Trophy,
          accent: "bg-[#E8F0FE] text-[#1A73E8]",
          ring: "ring-[#1A73E8]/10",
        },
        {
          title: "Promocje i oferty",
          badge: "Oferta dnia",
          body: "Możliwość prezentowania menu, promocji i aktualnych ofert.",
          icon: BadgePercent,
          accent: "bg-[#E6F4EA] text-[#34A853]",
          ring: "ring-[#34A853]/10",
        },
        {
          title: "Materiały informacyjne",
          badge: "Informacja",
          body: "Możliwość wyświetlania informacji, aktualności i komunikatów dla klientów.",
          icon: FileText,
          accent: "bg-[#FFF4E5] text-[#EA4335]",
          ring: "ring-[#FBBC05]/15",
        },
      ].map((item) => {
        const Icon = item.icon;

        return (
        <div
          key={item.title}
          className="rounded-[30px] border border-[#DADCE0] bg-white p-6 text-center shadow-[0_18px_40px_rgba(32,33,36,0.06)] transition-transform duration-200 hover:-translate-y-1"
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "flex size-16 items-center justify-center rounded-full ring-8",
                item.accent,
                item.ring,
              )}
            >
              <Icon className="size-7" />
            </div>
            <span className="rounded-full border border-[#E8EAED] bg-[#F8F9FA] px-3 py-1 text-xs font-semibold text-[#5F6368]">
              {item.badge}
            </span>
          </div>
          <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-[#202124]">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#5F6368]">{item.body}</p>
        </div>
        );
      })}
    </div>
  );
}
