import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "./globals.css";
import { AuthProvider, AuthGate } from "@/lib/auth";
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
      <head>
        <link
          rel="preconnect"
          href="https://ojqgfcshtatdoxfeyxpj.supabase.co"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://ojqgfcshtatdoxfeyxpj.supabase.co"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Lewati ke konten
        </a>
        <AuthProvider>
          <AuthGate>
            <ProgressProvider>
              <AppShell>{children}</AppShell>
            </ProgressProvider>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
