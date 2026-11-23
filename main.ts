// The One-Line Laugh — entry program (make.fun competition
// u-ronigrv-the-one-line-laugh-7ccca46f).
//
// Reads the single funny line from entry.txt next to this file and writes it,
// byte for byte, to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
// Deterministic: the same input always produces the same output file.
//
// Node 22, standard library only. No network, no secrets, no arguments.

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "entry.txt");

// The house gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space. Refuse to write anything invalid.
const MAX_CHARS = 200;

function readLine(): string {
  const raw = readFileSync(SOURCE, "utf8");
  const line = raw.replace(/\r\n/g, "\n").replace(/\n$/, "");
  if (line.trim().length === 0) {
    throw new Error("entry.txt is empty or only white space");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`entry line is ${line.length} chars, over the ${MAX_CHARS} limit`);
  }
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  return line;
}

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) {
    return resolve(fromEnv);
  }
  return "/output";
}

function main(): void {
  const line = readLine();
  const outDir = outputDir();
  mkdirSync(outDir, { recursive: true });
  copyFileSync(SOURCE, join(outDir, "entry.txt"));
  // Confirm what landed matches the validated line, byte for byte.
  const written = readFileSync(join(outDir, "entry.txt"), "utf8");
  if (written.replace(/\r\n/g, "\n").replace(/\n$/, "") !== line) {
    throw new Error("written entry.txt does not match entry.txt");
  }
  const size = statSync(join(outDir, "entry.txt")).size;
  console.log(`wrote entry.txt: ${line.length} chars, ${size} bytes -> ${join(outDir, "entry.txt")}`);
}

main();
