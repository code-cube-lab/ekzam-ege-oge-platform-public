import { readFile, writeFile } from "node:fs/promises";

const file = new URL("../public/client-search.html", import.meta.url);
const marker = "/* EKZAM_MOBILE_OVERFLOW_FIX */";
let html = await readFile(file, "utf8");
if (!html.includes(marker)) {
  const css = `
    ${marker}
    html,body { max-width:100%; overflow-x:hidden; }
    .shell,.lead-card,.card-head,.details-grid,.detail,.copy-panel,.route-box { min-width:0; max-width:100%; }
    .card-head h3,.detail,.summary,.pain,.profile-check,.decision,.route-value,.open-link { overflow-wrap:anywhere; word-break:break-word; }
    @media (max-width:430px) {
      .route-row { min-width:0; align-items:stretch; flex-direction:column; }
      .route-row .mini { width:100%; }
      .link-row { grid-template-columns:1fr; }
    }
  `.trim();
  html = html.replace("</style>", `${css}</style>`);
  await writeFile(file, html, "utf8");
}
process.stdout.write(`MOBILE_FIX_OK ${file.pathname}\n`);
