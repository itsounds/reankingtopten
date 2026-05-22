import type { Metadata, Viewport } from "next";

import { IframeViewportFix } from "@/components/iframe-viewport-fix";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Ranking Top 10",
    template: "%s",
  },
  description:
    "Darmowe standy NFC + QR do opinii Google oraz lokalny ranking TOP10 dla lokali.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full w-full max-w-full overflow-hidden antialiased">
      <body className="h-[100dvh] w-full max-w-full overflow-hidden">
        <IframeViewportFix />
        <div className="app-scroll-root h-full w-full max-w-full min-w-0 overflow-x-hidden overflow-y-auto overscroll-y-contain">
          {children}
        </div>
      </body>
    </html>
  );
}
