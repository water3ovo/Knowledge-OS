import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type KnowledgeItem = {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  domain: string;
  domainKey: string;
  type?: string;
  tags: string[];
  aliases: string[];
  summary: string;
  what: string;
  why?: string;
  when?: string[];
  how: string[];
  data: string[];
  tools: string[];
  output: string[];
  pitfalls: string[];
  related: string[];
  playbooks: string[];
  cases: string[];
  sources: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type LibraryItem = {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  kind: "tool" | "playbook" | "case";
  summary: string;
  tags: string[];
  aliases: string[];
  related: string[];
  updatedAt?: string;
};

export type DomainGroup = {
  index: string;
  key: string;
  title: string;
  concepts: KnowledgeItem[];
};

const CONTENT_ROOT = path.join(process.cwd(), "content");
const KNOWLEDGE_DIR = "01-知识库";

const DOMAIN_CONFIG = [
  { index: "01", key: "strategy", title: "战略与经营" },
  { index: "02", key: "gtm", title: "GTM" },
  { index: "03", key: "growth", title: "增长" },
  { index: "04", key: "ai", title: "AI 产品" },
  { index: "05", key: "data", title: "数据分析" },
  { index: "06", key: "platform", title: "平台机制" },
] as const;

const PREFERRED_ORDER: Record<string, string[]> = {
  strategy: ["dste", "blm", "three-gaps", "gsa", "five-looks-three-decisions"],
  gtm: ["market-intelligence", "icp-jtbd", "positioning", "pricing", "launch"],
  growth: ["seo", "geo-ai-search", "plg", "aarrr", "retention"],
  ai: ["llm", "agent", "rag", "mcp", "workflow"],
  data: ["funnel", "cohort", "cac-ltv", "experiment", "causal-inference"],
  platform: ["amazon-distribution", "google-search", "tiktok", "meta", "app-store", "black-box-system"],
};

const DOMAIN_LABELS: Record<string, string> = {
  strategy: "战略与经营",
  gtm: "GTM",
  growth: "增长",
  ai: "AI 产品",
  data: "数据分析",
  platform: "平台机制",
};

const DOMAIN_FOLDERS: Record<string, string> = {
  strategy: "战略与经营",
  gtm: "GTM",
  growth: "增长",
  ai: "AI产品",
  data: "数据分析",
  platform: "平台机制",
};

const SECTION_ALIASES: Record<string, string> = {
  WHAT: "WHAT",
  "是什么": "WHAT",
  "核心概念": "WHAT",
  WHY: "WHY",
  "为什么": "WHY",
  WHEN: "WHEN",
  "什么时候用": "WHEN",
  HOW: "HOW",
  "怎么做": "HOW",
  DATA: "DATA",
  "数据": "DATA",
  "关键数据": "DATA",
  INPUT: "INPUT",
  "输入": "INPUT",
  TOOL: "TOOL",
  TOOLS: "TOOL",
  "工具": "TOOL",
  OUTPUT: "OUTPUT",
  "输出": "OUTPUT",
  PITFALLS: "PITFALLS",
  "易错点": "PITFALLS",
  "常见误区": "PITFALLS",
};

function walkFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkFiles(fullPath);
    return /\.(md|mdx)$/i.test(entry.name) ? [fullPath] : [];
  });
}

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function cleanInlineMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s?/gm, "")
    .trim();
}

function sectionMap(body: string): Record<string, string> {
  const parts = body.split(/^##\s+(.+?)\s*$/gm);
  const sections: Record<string, string> = {};
  for (let index = 1; index < parts.length; index += 2) {
    const rawHeading = parts[index]?.trim() ?? "";
    const normalized = rawHeading.toUpperCase();
    const heading = SECTION_ALIASES[rawHeading] ?? SECTION_ALIASES[normalized] ?? normalized;
    const content = parts[index + 1]?.trim() ?? "";
    if (heading) sections[heading] = content;
  }
  return sections;
}

function paragraph(value?: string): string {
  if (!value) return "";
  return cleanInlineMarkdown(
    value
      .split("\n")
      .filter((line) => !/^\s*(?:[-*]|\d+[.)])\s+/.test(line))
      .join(" ")
      .replace(/\s+/g, " ")
  );
}

function list(value?: string): string[] {
  if (!value) return [];
  const items = value
    .split("\n")
    .map((line) => line.match(/^\s*(?:[-*]|\d+[.)])\s+(.+)$/)?.[1])
    .filter((item): item is string => Boolean(item))
    .map(cleanInlineMarkdown);
  if (items.length) return items;
  const fallback = paragraph(value);
  return fallback ? [fallback] : [];
}

function normalizeDomain(rawDomain: unknown, filePath: string): { key: string; label: string } {
  const raw = String(rawDomain ?? "").trim().toLowerCase();
  if (DOMAIN_LABELS[raw]) return { key: raw, label: DOMAIN_LABELS[raw] };

  const normalizedPath = filePath.split(path.sep).join("/").toLowerCase();
  for (const [key, folder] of Object.entries(DOMAIN_FOLDERS)) {
    if (normalizedPath.includes(`/${KNOWLEDGE_DIR.toLowerCase()}/${folder.toLowerCase()}/`)) {
      return { key, label: DOMAIN_LABELS[key] };
    }
  }

  return { key: raw || "other", label: raw ? String(rawDomain) : "其他" };
}

function parseKnowledgeFile(filePath: string): KnowledgeItem {
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const sections = sectionMap(content);
  const domain = normalizeDomain(data.domain, filePath);
  const id = String(data.id ?? data.slug ?? path.basename(filePath, path.extname(filePath)));
  const title = String(data.title ?? id);
  const summary = String(data.summary ?? paragraph(sections.WHAT) ?? "").trim();

  return {
    id,
    title,
    titleEn: data.title_en ? String(data.title_en) : undefined,
    slug: String(data.slug ?? id),
    domain: domain.label,
    domainKey: domain.key,
    type: data.type ? String(data.type) : undefined,
    tags: stringArray(data.tags),
    aliases: stringArray(data.aliases),
    summary,
    what: paragraph(sections.WHAT) || summary,
    why: paragraph(sections.WHY) || undefined,
    when: list(sections.WHEN),
    how: list(sections.HOW),
    data: list(sections.DATA ?? sections.INPUT),
    tools: list(sections.TOOL),
    output: list(sections.OUTPUT),
    pitfalls: list(sections.PITFALLS),
    related: stringArray(data.related),
    playbooks: stringArray(data.playbooks),
    cases: stringArray(data.cases),
    sources: stringArray(data.sources),
    createdAt: data.created_at ? String(data.created_at) : undefined,
    updatedAt: data.updated_at ? String(data.updated_at) : undefined,
  };
}

function parseLibraryFile(filePath: string, kind: LibraryItem["kind"]): LibraryItem {
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const sections = sectionMap(content);
  const id = String(data.id ?? data.slug ?? path.basename(filePath, path.extname(filePath)));
  const title = String(data.title ?? id);

  return {
    id,
    title,
    titleEn: data.title_en ? String(data.title_en) : undefined,
    slug: String(data.slug ?? id),
    kind,
    summary: String(data.summary ?? paragraph(sections.WHAT) ?? "").trim(),
    tags: stringArray(data.tags),
    aliases: stringArray(data.aliases),
    related: stringArray(data.related),
    updatedAt: data.updated_at ? String(data.updated_at) : undefined,
  };
}

function sortDomainItems(items: KnowledgeItem[], domainKey: string): KnowledgeItem[] {
  const preferred = PREFERRED_ORDER[domainKey] ?? [];
  return [...items].sort((a, b) => {
    const aIndex = preferred.indexOf(a.id);
    const bIndex = preferred.indexOf(b.id);
    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }
    return a.title.localeCompare(b.title, "zh-CN");
  });
}

export function getKnowledge(): KnowledgeItem[] {
  return walkFiles(path.join(CONTENT_ROOT, KNOWLEDGE_DIR))
    .map(parseKnowledgeFile)
    .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
}

export function getDomainGroups(knowledge: KnowledgeItem[]): DomainGroup[] {
  return DOMAIN_CONFIG.map((domain) => ({
    ...domain,
    concepts: sortDomainItems(
      knowledge.filter((item) => item.domainKey === domain.key),
      domain.key
    ),
  }));
}

export function getLibraryItems(): LibraryItem[] {
  const groups: Array<{ dir: string; kind: LibraryItem["kind"] }> = [
    { dir: "06-工具与数据", kind: "tool" },
    { dir: "04-实战手册", kind: "playbook" },
    { dir: "05-案例", kind: "case" },
  ];

  return groups.flatMap(({ dir, kind }) =>
    walkFiles(path.join(CONTENT_ROOT, dir)).map((filePath) => parseLibraryFile(filePath, kind))
  );
}
