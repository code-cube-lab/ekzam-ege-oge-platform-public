import type { Metadata } from "next";
import "./globals.css";
import { OfflineServiceWorker } from "./components/OfflineServiceWorker";

export const dynamic = "force-static";

async function getRequestHeaders(): Promise<Headers> {
  if (process.env.EKZAM_STATIC_EXPORT === "1") return new Headers();
  const { headers } = await import("next/headers");
  return headers();
}

export async function generateMetadata(): Promise<Metadata> {
  const githubPagesBasePath = process.env.EKZAM_GITHUB_PAGES_BASE;
  if (process.env.EKZAM_STATIC_EXPORT === "1" && githubPagesBasePath) {
    return {
      metadataBase: new URL(`https://code-cube-lab.github.io${githubPagesBasePath}`),
      title: { default: "ЭКЗАМ — школа подготовки к ОГЭ и ЕГЭ", template: "%s — ЭКЗАМ" },
      description: "Многопредметная подготовка к ОГЭ и ЕГЭ: диагностика, задания в формате экзамена, понятный отчёт родителю и поддержка преподавателя.",
      icons: {
        icon: `${githubPagesBasePath}/favicon.svg`,
        shortcut: `${githubPagesBasePath}/favicon.svg`,
      },
      manifest: `${githubPagesBasePath}/manifest.webmanifest`,
    };
  }

  const requestHeaders = await getRequestHeaders();
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
