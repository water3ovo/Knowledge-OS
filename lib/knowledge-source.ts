import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type KnowledgeSourceMeta = {
  sourcePath: string;
  sourceHash: string;
};

const KNOWLEDGE_ROOT = path.join(process.cwd(), "content", "01-知识库");

function walk(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return /\.(md|mdx)$/i.test(entry.name) ? [fullPath] : [];
  });
}

export function getKnowledgeSourceMeta(idOrSlug: string): KnowledgeSourceMeta | null {
  for (const filePath of walk(KNOWLEDGE_ROOT)) {
    const source = fs.readFileSync(filePath, "utf8");
    const { data } = matter(source);
    const id = String(data.id ?? data.slug ?? path.basename(filePath, path.extname(filePath)));
    const slug = String(data.slug ?? id);
    if (id !== idOrSlug && slug !== idOrSlug) continue;

    return {
      sourcePath: path.relative(process.cwd(), filePath).split(path.sep).join("/"),
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    };
  }
  return null;
}
