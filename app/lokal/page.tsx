import type { Metadata } from "next";

import { LiveLocalResultPage } from "@/components/live-local-result-page";

export const metadata: Metadata = {
  title: "Wynik lokalu • Ranking Top 10",
  description: "Aktualny wynik lokalu w Rankingu Top 10.",
};

export default function LiveLocalPage() {
  return <LiveLocalResultPage />;
}
