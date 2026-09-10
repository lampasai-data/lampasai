// GitHub Pages serves 404.html (with an HTTP 404 status) for any path that
// isn't a real file. The SPA redirect trick in public/404.html rescues human
// visitors, but a crawler just sees "not found" - including on the very URLs
// public/sitemap.xml advertises.
//
// Emitting a copy of index.html at each of those paths makes them real files,
// so they answer 200 and the router takes over client-side with no redirect
// hop. Routes not listed in the sitemap (a leaderboard page, an unknown slug)
// still fall through to 404.html, which is what it's there for.
//
// The route list comes from the sitemap itself, so the two can't drift apart.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const shell = join(dist, "index.html");

if (!existsSync(shell)) {
  console.error("prerender: dist/index.html is missing - run vite build first");
  process.exit(1);
}

const sitemap = readFileSync(join(root, "public", "sitemap.xml"), "utf8");
const html = readFileSync(shell, "utf8");

const paths = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname.replace(/\/$/, ""))
  .filter(Boolean);

if (paths.length === 0) {
  console.error("prerender: no routes found in public/sitemap.xml");
  process.exit(1);
}

for (const p of paths) {
  const dir = join(dist, p);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

console.log(`prerender: wrote ${paths.length} route shells → ${paths.join(", ")}`);
