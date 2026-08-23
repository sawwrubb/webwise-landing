import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const preview = path.join(root, "preview");
const ids = ["webwise", "clinics", "real-estate", "salons", "restaurants", "weddings", "d2c"];

assert.ok(fs.existsSync(path.join(preview, "index.html")), "gallery missing");
for (const id of ids) {
  const html = fs.readFileSync(path.join(preview, id, "index.html"), "utf8");
  assert.match(html, /noindex/);
  assert.match(html, /KIT = /);
  const rules = JSON.parse(fs.readFileSync(path.join(preview, id, "rules.json"), "utf8"));
  assert.ok(rules.never.length, `${id} needs never-list`);
  const card = JSON.parse(fs.readFileSync(path.join(preview, id, "result-card.json"), "utf8"));
  assert.ok(card.estimatedMonthlyLeakInr > 0, `${id} leak math`);
}
const webwise = fs.readFileSync(path.join(preview, "webwise", "index.html"), "utf8");
assert.match(webwise, /DOGFOOD/);
assert.match(fs.readFileSync(path.join(preview, "clinics", "index.html"), "utf8"), /No medical advice/);
console.log("kit lab ok:", ids.join(", "));
