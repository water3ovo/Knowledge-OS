"use client";

import { useEffect, useMemo, useState } from "react";
import type { KnowledgeItem } from "@/lib/content";
import { useWebsitePreferences } from "../../editor-preferences";

type Draft = {
  title: string;
  titleEn: string;
  what: string;
  why: string;
  when: string[];
  how: string[];
  pitfalls: string[];
  tags: string[];
};

function toDraft(item: KnowledgeItem): Draft {
  return {
    title: item.title,
    titleEn: item.titleEn ?? "",
    what: item.what,
    why: item.why ?? "",
    when: item.when ?? [],
    how: item.how,
    pitfalls: item.pitfalls,
    tags: item.tags,
  };
}

function toMarkdown(item: KnowledgeItem, draft: Draft) {
  const list = (items: string[]) => items.map((value) => `- ${value}`).join("\n");
  const steps = (items: string[]) => items.map((value, index) => `${index + 1}. ${value}`).join("\n");
  return [
    `# ${draft.title}`,
    draft.titleEn ? `\n_${draft.titleEn}_` : "",
    `\n## WHAT\n${draft.what}`,
    draft.why ? `\n## WHY\n${draft.why}` : "",
    draft.when.length ? `\n## WHEN\n${list(draft.when)}` : "",
    draft.how.length ? `\n## HOW\n${steps(draft.how)}` : "",
    draft.pitfalls.length ? `\n## PITFALLS\n${list(draft.pitfalls)}` : "",
    draft.tags.length ? `\n## TAGS\n${draft.tags.map((tag) => `#${tag}`).join(" ")}` : "",
    `\n<!-- Local draft based on ${item.id} -->`,
  ].filter(Boolean).join("\n");
}

export default function KnowledgeDetailClient({ item }: { item: KnowledgeItem }) {
  const { preferences } = useWebsitePreferences();
  const storageKey = `knowledge-os:document-draft:${item.id}`;
  const [draft, setDraft] = useState<Draft>(() => toDraft(item));
  const [editing, setEditing] = useState(false);
  const [hasLocalDraft, setHasLocalDraft] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        setDraft({ ...toDraft(item), ...(JSON.parse(raw) as Partial<Draft>) });
        setHasLocalDraft(true);
      }
    } catch {}
  }, [item, storageKey]);

  const displayItem = useMemo(() => ({
    ...item,
    title: draft.title,
    titleEn: draft.titleEn,
    what: draft.what,
    why: draft.why,
    when: draft.when,
    how: draft.how,
    pitfalls: draft.pitfalls,
    tags: draft.tags,
  }), [item, draft]);

  const saveDraft = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
      setHasLocalDraft(true);
      setEditing(false);
    } catch {}
  };

  const restoreSource = () => {
    setDraft(toDraft(item));
    try { window.localStorage.removeItem(storageKey); } catch {}
    setHasLocalDraft(false);
    setEditing(false);
  };

  const exportMarkdown = () => {
    const blob = new Blob([toMarkdown(item, draft)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${item.slug}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const updateArray = (key: "when" | "how" | "pitfalls" | "tags", value: string) => {
    setDraft((current) => ({ ...current, [key]: value.split("\n").map((line) => line.trim()).filter(Boolean) }));
  };

  if (editing) {
    return (
      <div className="ko-document-editor">
        <label><span>标题</span><input className="title-input" value={draft.title} onChange={(e) => setDraft((current) => ({ ...current, title: e.target.value }))} /></label>
        <label><span>英文标题</span><input value={draft.titleEn} onChange={(e) => setDraft((current) => ({ ...current, titleEn: e.target.value }))} /></label>
        <label><span>WHAT / 核心内容</span><textarea rows={7} value={draft.what} onChange={(e) => setDraft((current) => ({ ...current, what: e.target.value }))} /></label>
        <label><span>WHY / 为什么</span><textarea rows={5} value={draft.why} onChange={(e) => setDraft((current) => ({ ...current, why: e.target.value }))} /></label>
        <label><span>WHEN / 什么时候用（每行一条）</span><textarea rows={4} value={draft.when.join("\n")} onChange={(e) => updateArray("when", e.target.value)} /></label>
        <label><span>HOW / 怎么做（每行一步）</span><textarea rows={7} value={draft.how.join("\n")} onChange={(e) => updateArray("how", e.target.value)} /></label>
        <label><span>PITFALLS / 常见误区（每行一条）</span><textarea rows={5} value={draft.pitfalls.join("\n")} onChange={(e) => updateArray("pitfalls", e.target.value)} /></label>
        <label><span>标签（每行一个）</span><textarea rows={4} value={draft.tags.join("\n")} onChange={(e) => updateArray("tags", e.target.value)} /></label>
        <div className="ko-document-actions">
          <button className="ko-subtle-button" onClick={() => setEditing(false)}>取消</button>
          <button className="ko-subtle-button" onClick={exportMarkdown}>导出 Markdown</button>
          <button className="ko-primary-button" onClick={saveDraft}>保存本地草稿</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {preferences.editMode && (
        <div className="ko-doc-edit-banner">
          <span>{hasLocalDraft ? "当前显示本地草稿；GitHub 原文未被改动。" : "文档编辑模式已开启。修改会先保存为当前浏览器的本地草稿。"}</span>
          <div className="ko-document-actions">
            {hasLocalDraft && <button className="ko-subtle-button" onClick={restoreSource}>恢复 GitHub 原文</button>}
            <button className="ko-doc-edit-button" onClick={() => setEditing(true)}>编辑文档</button>
          </div>
        </div>
      )}

      <header className="detail-hero">
        <p className="section-kicker">{displayItem.domain} / {displayItem.type ?? "Concept"}</p>
        <h1>{displayItem.title}</h1>
        {displayItem.titleEn && <p className="detail-subtitle">{displayItem.titleEn}</p>}
        <div className="tag-list">{displayItem.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
      </header>

      <div className="detail-columns">
        <div className="detail-main">
          <section><p className="section-kicker">WHAT</p><p>{displayItem.what}</p></section>
          {displayItem.why && <section><p className="section-kicker">WHY</p><p>{displayItem.why}</p></section>}
          {displayItem.when && displayItem.when.length > 0 && <section><p className="section-kicker">WHEN</p><ul>{displayItem.when.map((x) => <li key={x}>{x}</li>)}</ul></section>}
          {displayItem.how.length > 0 && <section><p className="section-kicker">HOW</p><ol>{displayItem.how.map((x) => <li key={x}>{x}</li>)}</ol></section>}
          {displayItem.pitfalls.length > 0 && <section><p className="section-kicker">PITFALLS</p><ul>{displayItem.pitfalls.map((x) => <li key={x}>{x}</li>)}</ul></section>}
        </div>
        <aside className="detail-side">
          {item.data.length > 0 && <section><p className="section-kicker">DATA</p><ul>{item.data.map((x) => <li key={x}>{x}</li>)}</ul></section>}
          {item.tools.length > 0 && <section><p className="section-kicker">TOOLS</p><ul>{item.tools.map((x) => <li key={x}>{x}</li>)}</ul></section>}
          {item.output.length > 0 && <section><p className="section-kicker">OUTPUT</p><ul>{item.output.map((x) => <li key={x}>{x}</li>)}</ul></section>}
          {item.related.length > 0 && <section><p className="section-kicker">RELATED</p><div className="related-chips">{item.related.map((id) => <a key={id} href={`/knowledge/${id}`}>{id}</a>)}</div></section>}
          {item.sources.length > 0 && <section><p className="section-kicker">SOURCES</p><div className="source-links">{item.sources.map((url, i) => <a href={url} target="_blank" rel="noreferrer" key={url}>Source {i + 1} ↗</a>)}</div></section>}
        </aside>
      </div>
    </>
  );
}
