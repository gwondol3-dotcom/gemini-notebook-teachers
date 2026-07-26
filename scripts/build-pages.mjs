import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(projectRoot, "dist", "client");
const pagesDir = path.join(projectRoot, "docs");
const sourceUrl = process.env.PAGE_SOURCE_URL || "http://127.0.0.1:3000/";

if (!pagesDir.startsWith(projectRoot + path.sep)) {
  throw new Error("Refusing to write outside the project");
}

const response = await fetch(sourceUrl);
if (!response.ok) {
  throw new Error(`Unable to render the page: ${response.status}`);
}

let html = await response.text();
html = html
  .replaceAll('href="/', 'href="./')
  .replaceAll('src="/', 'src="./')
  .replaceAll(`${sourceUrl.replace(/\/$/, "")}/`, "./");

await rm(pagesDir, { recursive: true, force: true });
await mkdir(pagesDir, { recursive: true });
await cp(clientDir, pagesDir, { recursive: true });
await writeFile(path.join(pagesDir, "index.html"), html, "utf8");
await writeFile(path.join(pagesDir, ".nojekyll"), "", "utf8");

console.log(`GitHub Pages bundle created at ${pagesDir}`);
