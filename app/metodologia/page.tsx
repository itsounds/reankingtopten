import type { Metadata } from "next";

import { MethodologyPage } from "@/components/methodology-page";

export const metadata: Metadata = {
  title: "Metodologia • Ranking Top 10",
  description:
    "Jak powstaje Ranking Top 10: dane, porządkowanie, autorska metodologia i niezależność zestawienia.",
};

export default function MethodologyRoute() {
  return <MethodologyPage />;
}
