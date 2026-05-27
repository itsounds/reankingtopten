import type { Metadata } from "next";

import { StandyLandingPage } from "@/components/standy-landing-page";

export const metadata: Metadata = {
  title: "Standy do zbierania opinii Google • Ranking Top 10",
  description:
    "Profesjonalne standy i karty NFC + QR do zbierania opinii Google. Cena detaliczna 99 zł, hurt od 20 szt. — 59 zł.",
};

export default function StandyPage() {
  return <StandyLandingPage />;
}
