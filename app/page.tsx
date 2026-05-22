import type { Metadata } from "next";

import { B2bLandingPage } from "@/components/b2b-landing-page";

export const metadata: Metadata = {
  title: "Darmowe standy NFC do opinii Google • Ranking Top 10",
  description:
    "Odbierz bezpłatne standy NFC + QR i zwiększ liczbę pozytywnych opinii Google dzięki inteligentnemu systemowi zarządzania reputacją.",
};

export default function Home() {
  return <B2bLandingPage />;
}
