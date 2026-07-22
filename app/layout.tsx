import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: { default: "Слово — AI-подготовка к ЕГЭ", template: "%s — Слово" },
    description: "Персональная подготовка к ЕГЭ по русскому языку и литературе: диагностика, понятный маршрут и поддержка преподавателя.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "Слово — понимать, а не угадывать",
      description: "AI-платформа подготовки к ЕГЭ по методике преподавателя.",
      type: "website",
      locale: "ru_RU",
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Слово — AI-подготовка к ЕГЭ" }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
