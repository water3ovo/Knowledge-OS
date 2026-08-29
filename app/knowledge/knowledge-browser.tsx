"use client";

import { useMemo, useState } from "react";
import type { DomainGroup, KnowledgeItem } from "@/lib/content";

export default function KnowledgeBrowser({ knowledge, domains }: { knowledge: KnowledgeItem[]; domains: DomainGroup[] }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...knowledge]
      .filter((item) => {
        const domainMatch = domain === "all" || item.domainKey === domain;
        if (!domainMatch) return false;
        if (!q) return true;
        return [item.title, item.titleEn, item.summary, item.what, ...item.tags, ...item.aliases]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime || a.title.localeCompare(b.title, "zh-CN");
      });
  }, [knowledge, query, domain]);

  return (
    <div className="knowledge-browser ko-index-browser">
      <div className="library-search-row">
        <label className="library-search">
          <span>⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索标题、正文、标签或概念…" />
        </label>
        <span className="result-count">共 {filtered.length} 条知识</span>
      </div>

      <div className="filter-row">
        <button onClick={() => setDomain("all")} className={domain === "all" ? "active" : ""}>全部</button>
        {domains.map((group) => (
          <button key={group.key} onClick={() => setDomain(group.key)} className={domain === group.key ? "active" : ""}>
            {group.title} <span>{group.concepts.length}</span>
          </button>
        ))}
      </div>

      <div className="ko-index-table">
        <div className="ko-index-head"><span>知识标题</span><span>领域</span><span>标签</span><span>最后更新</span><span /></div>
        {filtered.map((item) => (
          <a href={`/knowledge/${item.slug}`} className="ko-index-row" key={item.id}>
            <div><strong>{item.title}</strong>{item.titleEn && <small>{item.titleEn}</small>}</div>
            <span>{item.domain}</span>
            <span className="ko-index-tags">{item.tags.slice(0, 2).map((tag) => <em key={tag}>{tag}</em>)}</span>
            <time>{item.updatedAt?.slice(0, 10) ?? "—"}</time>
            <b>↗</b>
          </a>
        ))}
        {!filtered.length && <div className="ko-index-empty">没有找到匹配的知识。</div>}
      </div>
    </div>
  );
}
