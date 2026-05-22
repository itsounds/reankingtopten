import type { Metadata } from "next";

import { HomePage } from "@/components/home-page";

export const metadata: Metadata = {
  title: "Sprawdź lokal w rankingu • Ranking Top 10",
  description:
    "Wyszukaj swój lokal i sprawdź, czy znalazł się w aktualnym rankingu Top 10 w swojej kategorii.",
};

export default function WyszukiwarkaPage() {
  return (
    <HomePage
      headerCtaHref="/wyszukiwarka#sprawdz-lokal"
      headerCtaLabel="Sprawdź lokal"
    />
  );
}
