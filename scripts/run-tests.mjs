import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";

const testDir = path.resolve("tests");
const files = (await readdir(testDir))
  .filter((name) => name.endsWith(".test.mjs"))
  .sort()
  .map((name) => path.join(testDir, name));

if (!files.length) throw new Error("No current tests found in tests/");

const child = spawn(process.execPath, ["--test", ...files], { stdio: "inherit" });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
