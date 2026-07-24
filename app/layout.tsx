import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { OfflineServiceWorker } from "./components/OfflineServiceWorker";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: { default: "ЭКЗАМ — школа подготовки к ОГЭ и ЕГЭ", template: "%s — ЭКЗАМ" },
    description: "Многопредметная подготовка к ОГЭ и ЕГЭ: диагностика, задания в формате экзамена, понятный отчёт родителю и поддержка преподавателя.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    manifest: "/manifest.webmanifest",
    openGraph: {
      title: "ЭКЗАМ — ребёнок готовится, родитель видит результат",
      description: "Многопредметная школа ОГЭ и ЕГЭ с заданиями в реальных форматах экзамена.",
      type: "website",
      locale: "ru_RU",
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "ЭКЗАМ — школа подготовки к ОГЭ и ЕГЭ" }],
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
      <body><OfflineServiceWorker />{children}</body>
    </html>
  );
}
