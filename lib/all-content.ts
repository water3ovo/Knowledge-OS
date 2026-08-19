import fs from "node:fs";
import path from "node:path";
import { getDomainGroups, getKnowledge, type DomainGroup, type KnowledgeItem } from "./content";

type SeedItem = {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  domainKey: string;
  type?: string;
  tags?: string[];
  aliases?: string[];
  summary: string;
  related?: string[];
};

const domainLabels: Record<string,string> = {
  strategy: "Strategy",
  gtm: "Global GTM",
  growth: "Growth",
  ai: "AI Product",
  data: "Data",
  platform: "Platform",
};

function readSeeds(): SeedItem[] {
  const dir = path.join(process.cwd(), "content", "seeds");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .flatMap((name) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir,name), "utf8")) as SeedItem[];
      } catch {
        return [];
      }
    });
}

function toKnowledge(seed: SeedItem): KnowledgeItem {
  return {
    id: seed.id,
    title: seed.title,
    titleEn: seed.titleEn,
    slug: seed.slug,
    domain: domainLabels[seed.domainKey] ?? seed.domainKey,
    domainKey: seed.domainKey,
    type: seed.type,
    tags: seed.tags ?? [],
    aliases: seed.aliases ?? [],
    summary: seed.summary,
    what: seed.summary,
    why: `理解 ${seed.title} 在完整业务链路中的作用，并知道它什么时候值得使用。`,
    when: [],
    how: ["明确它解决的业务问题", "找到需要的数据或上下文", "形成判断或行动", "与相关概念交叉验证"],
    data: [],
    tools: [],
    output: [],
    pitfalls: ["只记定义，不知道什么时候使用", "套框架但没有业务事实或数据支撑"],
    related: seed.related ?? [],
    playbooks: [],
    cases: [],
    sources: [],
    createdAt: "2026-08-19",
    updatedAt: "2026-08-19",
  };
}

export function getAllKnowledge(): KnowledgeItem[] {
  const mdx = getKnowledge();
  const detailedIds = new Set(mdx.map((item) => item.id));
  const seeds = readSeeds().filter((item) => !detailedIds.has(item.id)).map(toKnowledge);
  return [...mdx, ...seeds].sort((a,b) => a.title.localeCompare(b.title, "zh-CN"));
}

export function getAllDomainGroups(knowledge = getAllKnowledge()): DomainGroup[] {
  return getDomainGroups(knowledge);
}
