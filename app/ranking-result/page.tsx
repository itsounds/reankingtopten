import type { Metadata } from "next";

import { LiveLocalResultPage } from "@/components/live-local-result-page";

export const metadata: Metadata = {
  title: "Wynik rankingu • Ranking Top 10",
  description: "Aktualny ranking Top 10 dla wyszukanego lokalu.",
};

export default function RankingResultPage() {
  return <LiveLocalResultPage />;
}
