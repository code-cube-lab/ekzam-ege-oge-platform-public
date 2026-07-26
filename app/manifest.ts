import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ЭКЗАМ — подготовка к ОГЭ и ЕГЭ",
    short_name: "ЭКЗАМ",
    description: "Пробные варианты ОГЭ и ЕГЭ, разбор ошибок и персональная отработка.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f5f8",
    theme_color: "#111e33",
    lang: "ru",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
