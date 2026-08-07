import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const port = Number(process.env.EXAM_STATIC_QA_PORT ?? 3016);
const prefix = "/ekzam-ege-oge-platform-public";
const root = path.resolve("docs");
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
};

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  if (!requestUrl.pathname.startsWith(prefix)) {
    response.writeHead(404).end("Not found");
    return;
  }
  const relative = decodeURIComponent(requestUrl.pathname.slice(prefix.length)).replace(/^\/+/, "");
  let file = path.resolve(root, relative || "index.html");
  if (!file.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!existsSync(file)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }
  response.writeHead(200, { "content-type": mime[path.extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
process.env.EXAM_QA_BASE = `http://127.0.0.1:${port}${prefix}`;

try {
  await import(`./run-browser-qa.mjs?static=${Date.now()}`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
