import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const contentRoot = path.join(root, "content");

const fatal = [];
const warnings = [];
const records = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function addRecord(file, data, kind) {
  if (!data?.id) return;
  records.push({
    file: rel(file),
    kind,
    id: String(data.id),
    slug: data.slug ? String(data.slug) : undefined,
    title: data.title ? String(data.title) : undefined,
    titleEn: data.title_en ? String(data.title_en) : data.titleEn ? String(data.titleEn) : undefined,
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    knowledgeIds: Array.isArray(data.knowledge_ids) ? data.knowledge_ids.map(String) : [],
    domainKey: data.domain_key ? String(data.domain_key) : data.domainKey ? String(data.domainKey) : undefined,
    raw: fs.readFileSync(file, "utf8"),
  });
}

for (const file of walk(contentRoot)) {
  const fileRel = rel(file);
  if (fileRel.includes("/meta/templates/")) continue;
  if (fileRel.endsWith("README.md")) continue;

  if (file.endsWith(".md") || file.endsWith(".mdx")) {
    try {
      const raw = fs.readFileSync(file, "utf8");
      const parsed = matter(raw);
      if (parsed.data?.id) {
        const kind = fileRel.includes("/01-知识库/") ? "knowledge" : String(parsed.data.type ?? "markdown");
        addRecord(file, parsed.data, kind);
      }
    } catch (error) {
      fatal.push(`${fileRel}: frontmatter parse failed — ${error.message}`);
    }
  }
}

const seedDir = path.join(contentRoot, "seeds");
if (fs.existsSync(seedDir)) {
  for (const file of fs.readdirSync(seedDir).filter((name) => name.endsWith(".json"))) {
    const full = path.join(seedDir, file);
    try {
      const items = JSON.parse(fs.readFileSync(full, "utf8"));
      if (!Array.isArray(items)) throw new Error("seed file must contain an array");
      for (const item of items) {
        if (!item?.id) continue;
        records.push({
          file: rel(full),
          kind: "knowledge-seed",
          id: String(item.id),
          slug: item.slug ? String(item.slug) : undefined,
          title: item.title ? String(item.title) : undefined,
          titleEn: item.titleEn ? String(item.titleEn) : undefined,
          related: Array.isArray(item.related) ? item.related.map(String) : [],
          knowledgeIds: [],
          domainKey: item.domainKey ? String(item.domainKey) : undefined,
          raw: "",
        });
      }
    } catch (error) {
      fatal.push(`${rel(full)}: JSON parse failed — ${error.message}`);
    }
  }
}

const byId = new Map();
for (const record of records) {
  const existing = byId.get(record.id) ?? [];
  existing.push(record);
  byId.set(record.id, existing);
}

for (const [id, matches] of byId) {
  const detailed = matches.filter((x) => x.kind === "knowledge");
  const seeds = matches.filter((x) => x.kind === "knowledge-seed");
  const other = matches.filter((x) => x.kind !== "knowledge" && x.kind !== "knowledge-seed");

  // Detailed Markdown intentionally overrides seed entries with the same ID.
  const validOverride = detailed.length === 1 && seeds.length >= 1 && other.length === 0;
  if (matches.length > 1 && !validOverride) {
    fatal.push(`duplicate id '${id}': ${matches.map((x) => x.file).join(", ")}`);
  }
}

const canonical = records.filter((x) => x.kind === "knowledge" || x.kind === "knowledge-seed");
const effectiveCanonical = new Map();
for (const record of canonical) {
  const current = effectiveCanonical.get(record.id);
  if (!current || record.kind === "knowledge") effectiveCanonical.set(record.id, record);
}

const slugMap = new Map();
for (const record of effectiveCanonical.values()) {
  if (!record.slug) continue;
  const existing = slugMap.get(record.slug);
  if (existing && existing.id !== record.id) {
    fatal.push(`duplicate canonical slug '${record.slug}': ${existing.file}, ${record.file}`);
  } else {
    slugMap.set(record.slug, record);
  }
}

const knownIds = new Set(records.map((x) => x.id));
for (const record of records) {
  for (const target of record.related) {
    if (!knownIds.has(target)) warnings.push(`${record.file}: related target '${target}' not found`);
  }
  for (const target of record.knowledgeIds) {
    if (!effectiveCanonical.has(target)) warnings.push(`${record.file}: knowledge_id '${target}' not found`);
  }
}

const linkNames = new Set();
for (const record of effectiveCanonical.values()) {
  for (const value of [record.id, record.slug, record.title, record.titleEn]) {
    if (value) linkNames.add(String(value).trim().toLowerCase());
  }
}

for (const record of records.filter((x) => x.raw)) {
  const links = [...record.raw.matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)].map((m) => m[1].trim());
  for (const link of links) {
    if (link === "..." || link.includes("YYYY")) continue;
    if (!linkNames.has(link.toLowerCase())) warnings.push(`${record.file}: wikilink '[[${link}]]' could not be resolved`);
  }
}

let taxonomy;
const taxonomyPath = path.join(contentRoot, "meta", "taxonomy.json");
if (fs.existsSync(taxonomyPath)) {
  try {
    taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, "utf8"));
    const domainIds = new Set((taxonomy.domains ?? []).map((x) => x.id));
    const usedDomainIds = new Set([...effectiveCanonical.values()].map((x) => x.domainKey).filter(Boolean));
    for (const domain of usedDomainIds) {
      if (!domainIds.has(domain)) warnings.push(`taxonomy: domain '${domain}' is used by knowledge but missing from taxonomy.json`);
    }
  } catch (error) {
    fatal.push(`content/meta/taxonomy.json: parse failed — ${error.message}`);
  }
}

const counts = records.reduce((acc, record) => {
  acc[record.kind] = (acc[record.kind] ?? 0) + 1;
  return acc;
}, {});

console.log("Knowledge OS health check");
console.log("-------------------------");
console.log(`Effective canonical concepts: ${effectiveCanonical.size}`);
for (const [kind, count] of Object.entries(counts).sort()) console.log(`${kind}: ${count}`);

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length})`);
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (fatal.length) {
  console.error(`\nFatal errors (${fatal.length})`);
  for (const error of fatal) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\nHealth check passed (warnings do not fail CI).");
