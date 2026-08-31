import crypto from "node:crypto";
import matter from "gray-matter";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type DraftPayload = {
  title: string;
  titleEn?: string;
  what: string;
  why?: string;
  when?: string[];
  how?: string[];
  pitfalls?: string[];
  tags?: string[];
};

type SubmitPayload = {
  id: string;
  sourcePath: string;
  sourceHash: string;
  draft: DraftPayload;
};

const SECTION_ALIASES: Record<string, "WHAT" | "WHY" | "WHEN" | "HOW" | "PITFALLS" | undefined> = {
  WHAT: "WHAT",
  "是什么": "WHAT",
  "核心概念": "WHAT",
  WHY: "WHY",
  "为什么": "WHY",
  WHEN: "WHEN",
  "什么时候用": "WHEN",
  HOW: "HOW",
  "怎么做": "HOW",
  PITFALLS: "PITFALLS",
  "易错点": "PITFALLS",
  "常见误区": "PITFALLS",
};

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function normalizeString(value: unknown, max = 20_000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizeList(value: unknown, maxItems = 80) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => normalizeString(item, 2_000)).filter(Boolean).slice(0, maxItems);
}

function sectionValue(key: "WHAT" | "WHY" | "WHEN" | "HOW" | "PITFALLS", draft: DraftPayload) {
  if (key === "WHAT") return normalizeString(draft.what);
  if (key === "WHY") return normalizeString(draft.why);
  if (key === "WHEN") return normalizeList(draft.when).map((item) => `- ${item}`).join("\n");
  if (key === "HOW") return normalizeList(draft.how).map((item, index) => `${index + 1}. ${item}`).join("\n");
  return normalizeList(draft.pitfalls).map((item) => `- ${item}`).join("\n");
}

function mergeEditableSections(content: string, draft: DraftPayload) {
  const headingRegex = /^##\s+(.+?)\s*$/gm;
  const matches = [...content.matchAll(headingRegex)];
  const seen = new Set<string>();

  if (!matches.length) {
    const additions = (["WHAT", "WHY", "WHEN", "HOW", "PITFALLS"] as const)
      .map((key) => {
        const value = sectionValue(key, draft);
        if (!value) return "";
        seen.add(key);
        return `## ${key}\n${value}`;
      })
      .filter(Boolean)
      .join("\n\n");
    return `${content.trimEnd()}${additions ? `\n\n${additions}` : ""}\n`;
  }

  let output = content.slice(0, matches[0].index ?? 0).trimEnd();

  matches.forEach((match, index) => {
    const start = match.index ?? 0;
    const headingEnd = start + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? content.length) : content.length;
    const rawHeading = match[1].trim();
    const canonical = SECTION_ALIASES[rawHeading] ?? SECTION_ALIASES[rawHeading.toUpperCase()];

    if (!canonical) {
      output += `\n\n${content.slice(start, end).trim()}`;
      return;
    }

    seen.add(canonical);
    const replacement = sectionValue(canonical, draft);
    if (replacement) output += `\n\n${content.slice(start, headingEnd).trim()}\n${replacement}`;
  });

  for (const canonical of ["WHAT", "WHY", "WHEN", "HOW", "PITFALLS"] as const) {
    if (seen.has(canonical)) continue;
    const replacement = sectionValue(canonical, draft);
    if (replacement) output += `\n\n## ${canonical}\n${replacement}`;
  }

  return `${output.trim()}\n`;
}

export async function POST(request: Request) {
  const token = process.env.GITHUB_WRITE_TOKEN;
  const configuredSecret = process.env.KNOWLEDGE_EDITOR_SECRET;
  const suppliedSecret = request.headers.get("x-editor-secret") ?? "";

  if (!token || !configuredSecret) {
    return NextResponse.json(
      { error: "writeback_not_configured", message: "服务器尚未配置知识库写回凭证。" },
      { status: 503 }
    );
  }

  if (!suppliedSecret || !safeEqual(configuredSecret, suppliedSecret)) {
    return NextResponse.json({ error: "unauthorized", message: "提交口令不正确。" }, { status: 401 });
  }

  let payload: SubmitPayload;
  try {
    payload = (await request.json()) as SubmitPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json", message: "提交内容格式错误。" }, { status: 400 });
  }

  const id = normalizeString(payload.id, 200);
  const sourcePath = normalizeString(payload.sourcePath, 600);
  const sourceHash = normalizeString(payload.sourceHash, 128);
  const draft = payload.draft ?? ({} as DraftPayload);

  if (!id || !sourcePath || !sourceHash || !sourcePath.startsWith("content/01-知识库/") || !/\.(md|mdx)$/i.test(sourcePath)) {
    return NextResponse.json({ error: "invalid_source", message: "知识源路径不合法。" }, { status: 400 });
  }

  const owner = process.env.GITHUB_REPO_OWNER ?? "water3ovo";
  const repo = process.env.GITHUB_REPO_NAME ?? "Knowledge-OS";
  const branch = process.env.GITHUB_WRITE_BRANCH ?? "main";
  const encodedPath = sourcePath.split("/").map(encodeURIComponent).join("/");
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const currentResponse = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers, cache: "no-store" });
  if (!currentResponse.ok) {
    const detail = await currentResponse.text();
    return NextResponse.json({ error: "github_read_failed", message: "读取 GitHub 原文失败。", detail }, { status: 502 });
  }

  const current = (await currentResponse.json()) as { content?: string; sha?: string; html_url?: string };
  if (!current.content || !current.sha) {
    return NextResponse.json({ error: "github_invalid_file", message: "GitHub 返回的知识文件无效。" }, { status: 502 });
  }

  const raw = Buffer.from(current.content.replace(/\n/g, ""), "base64").toString("utf8");
  const currentHash = crypto.createHash("sha256").update(raw).digest("hex");

  if (!safeEqual(currentHash, sourceHash)) {
    return NextResponse.json(
      {
        error: "source_changed",
        message: "GitHub 原文已在你编辑期间发生变化。为避免覆盖新知识，本次提交已停止。请刷新页面后重新确认修改。",
      },
      { status: 409 }
    );
  }

  const parsed = matter(raw);
  const nextData = {
    ...parsed.data,
    title: normalizeString(draft.title, 500) || parsed.data.title || id,
    ...(normalizeString(draft.titleEn, 500) ? { title_en: normalizeString(draft.titleEn, 500) } : {}),
    tags: normalizeList(draft.tags, 60),
    updated_at: new Date().toISOString().slice(0, 10),
  };

  if (!normalizeString(draft.titleEn, 500) && "title_en" in nextData) delete (nextData as Record<string, unknown>).title_en;

  const nextBody = mergeEditableSections(parsed.content, draft);
  const nextSource = matter.stringify(nextBody, nextData);
  const commitMessage = `content: update ${id} from Knowledge OS editor`;

  const updateResponse = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(nextSource, "utf8").toString("base64"),
      sha: current.sha,
      branch,
    }),
  });

  if (!updateResponse.ok) {
    const detail = await updateResponse.text();
    return NextResponse.json({ error: "github_write_failed", message: "写入 GitHub 失败。", detail }, { status: 502 });
  }

  const updated = (await updateResponse.json()) as { commit?: { sha?: string; html_url?: string }; content?: { html_url?: string } };
  return NextResponse.json({
    ok: true,
    message: "已提交到知识库。GitHub main 更新后会触发网站重新部署。",
    commitSha: updated.commit?.sha,
    commitUrl: updated.commit?.html_url,
    fileUrl: updated.content?.html_url,
  });
}
