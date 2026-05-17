import { AnimatedCertificateDemo } from "@/components/animated-certificate-demo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo certyfikatu • Ranking Top 10",
  description: "Demo statycznego certyfikatu Top 10.",
};

export default function DemoPage() {
  return <AnimatedCertificateDemo />;
}
