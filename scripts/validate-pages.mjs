import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const pagesDir = path.resolve("docs");
const html = readFileSync(path.join(pagesDir, "index.html"), "utf8");
const references = [
  ...html.matchAll(/(?:src|href)="\.\/([^"#?]+)/g),
].map((match) => match[1]);
const missing = [...new Set(references)].filter(
  (reference) => !existsSync(path.join(pagesDir, reference)),
);

if (missing.length) {
  throw new Error(`Missing static assets: ${missing.join(", ")}`);
}
if (/(?:src|href)="\//.test(html)) {
  throw new Error("Root-relative asset reference remains");
}
if (/(?<!\.)\/assets\//.test(html)) {
  throw new Error("Root-relative runtime asset reference remains");
}
if (!html.includes('import("./assets/')) {
  throw new Error("Relative client runtime import is missing");
}
if (!html.includes("Gemini Notebook 교사 연수")) {
  throw new Error("Expected page content is missing");
}

console.log(`Static Pages bundle validated: ${references.length} references`);
