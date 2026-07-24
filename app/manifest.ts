import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ЭКЗАМ — школа 5–11",
    short_name: "ЭКЗАМ",
    description: "Учебники, задания ОГЭ и ЕГЭ и дневник в одной платформе.",
    start_url: "/school",
    display: "standalone",
    background_color: "#f3f5f8",
    theme_color: "#111e33",
    lang: "ru",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
