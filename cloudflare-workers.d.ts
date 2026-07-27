interface EkzamD1Statement {
  bind(...values: unknown[]): EkzamD1Statement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

interface EkzamD1Database {
  prepare(query: string): EkzamD1Statement;
  batch(statements: EkzamD1Statement[]): Promise<unknown>;
}

type D1Database = EkzamD1Database;

interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

declare module "cloudflare:workers" {
  export const env: { DB: EkzamD1Database };
}
