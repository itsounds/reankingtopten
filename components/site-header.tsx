import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button-link";

type SiteHeaderProps = {
  ctaHref?: string;
  ctaLabel?: string;
  logoHref?: string;
};

export function SiteHeader({
  ctaHref = "#odbierz-standy",
  ctaLabel = "Odbierz darmowe standy",
  logoHref = "/",
}: SiteHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-[2000] bg-transparent">
      <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-4 px-4 py-5 md:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href={logoHref}>
          <Image
            src="/images/top-ten-small.png"
            alt="Ranking Top 10"
            width={80}
            height={80}
            className="size-20 rounded-2xl"
            priority
            unoptimized
          />
        </Link>

        <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
      </div>
    </header>
  );
}
