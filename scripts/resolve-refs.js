// Node 18+
// Usage: node scripts/resolve-refs.js primitives.json semantic/*.json
import fs from "fs";
import path from "path";

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function findRefs(obj, refs = []) {
  if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (key === "$ref" && typeof obj[key] === "string") refs.push(obj[key]);
      else findRefs(obj[key], refs);
    }
  }
  return refs;
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node scripts/resolve-refs.js primitives.json semantic/*.json");
  process.exit(1);
}

const primitivesFile = args[0];
const semanticFiles = args.slice(1);

if (!fs.existsSync(primitivesFile)) {
  console.error("Primitives file not found:", primitivesFile);
  process.exit(1);
}

const primitives = loadJson(primitivesFile).primitives || {};
const primitiveKeys = new Set(Object.keys(primitives).map(k => `primitives.${k}`));

let errors = 0;

for (const file of semanticFiles) {
  if (!fs.existsSync(file)) {
    console.warn("Skipping missing file:", file);
    continue;
  }
  const json = loadJson(file);
  const refs = findRefs(json);
  for (const ref of refs) {
    if (!primitiveKeys.has(ref)) {
      console.error(`Unresolved reference in ${file}: ${ref}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`Found ${errors} unresolved reference(s).`);
  process.exit(1);
}

console.log("All references resolved.");
process.exit(0);