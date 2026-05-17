import type { Metadata } from "next";

import { DemoMapPage } from "@/components/demo-map-page";

export const metadata: Metadata = {
  title: "Mapa demo • Ranking Top 10",
  description: "Mapa lokali z rankingu w pobliżu użytkownika.",
};

export default function MapPage() {
  return <DemoMapPage />;
}
