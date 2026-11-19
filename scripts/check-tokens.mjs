// Fails on raw hex or Tailwind palette colour classes in src/components and src/app (globals.css is exempt).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const hex = /#[0-9a-fA-F]{3,8}\b/;
const palette = /\b(?:bg|text|border|ring|fill|stroke|from|to|via|divide|outline|decoration|shadow|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)\b/;

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const bad = ["src/components", "src/app"]
  .flatMap(walk)
  .filter((f) => /\.(tsx?|css)$/.test(f) && !f.endsWith("globals.css"))
  .flatMap((f) => readFileSync(f, "utf8").split("\n").map((l, i) => [f, i + 1, l]))
  .filter(([, , l]) => hex.test(l) || palette.test(l));

for (const [f, n, l] of bad) console.error(`${f}:${n}: ${l.trim()}`);
if (bad.length) process.exit(1);
console.log("check:tokens ok");
