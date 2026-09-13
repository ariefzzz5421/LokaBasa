import type { Metadata } from "next";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./globals.css";
import { ProgressProvider } from "@/lib/store";
import { AppShell } from "@/components/shell";
export const metadata: Metadata = {
  title: {
    default: "LokaBasa — Lebih dekat dengan Indonesia",
    template: "%s | LokaBasa",
  },
  description:
    "Jelajah bahasa daerah Indonesia lewat pelajaran singkat, percakapan, dan latihan sehari-hari. Mulai perjalananmu bersama LokaBasa.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <a href="#main-content" className="skip-link">
          Lewati ke konten
        </a>
        <ProgressProvider>
          <AppShell>{children}</AppShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
