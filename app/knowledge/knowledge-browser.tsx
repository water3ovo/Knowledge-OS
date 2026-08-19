"use client";

import { useMemo, useState } from "react";
import type { DomainGroup, KnowledgeItem } from "@/lib/content";

export default function KnowledgeBrowser({ knowledge, domains }: { knowledge: KnowledgeItem[]; domains: DomainGroup[] }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return knowledge.filter((item) => {
      const domainMatch = domain === "all" || item.domainKey === domain;
      if (!domainMatch) return false;
      if (!q) return true;
      return [item.title, item.titleEn, item.summary, item.what, ...item.tags, ...item.aliases]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [knowledge, query, domain]);

  return (
    <div className="knowledge-browser">
      <div className="library-search-row">
        <label className="library-search">
          <span>⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索知识：DSTE / SEO / CAC / Agent…" />
        </label>
        <span className="result-count">{filtered.length} concepts</span>
      </div>

      <div className="filter-row">
        <button onClick={() => setDomain("all")} className={domain === "all" ? "active" : ""}>ALL</button>
        {domains.map((group) => (
          <button key={group.key} onClick={() => setDomain(group.key)} className={domain === group.key ? "active" : ""}>
            {group.title}
          </button>
        ))}
      </div>

      <div className="knowledge-full-grid">
        {domains.map((group) => {
          const items = filtered.filter((item) => item.domainKey === group.key);
          if (!items.length) return null;
          return (
            <section className="knowledge-full-domain" key={group.key}>
              <header>
                <span className="domain-index">{group.index}</span>
                <h2>{group.title}</h2>
                <span>{items.length}</span>
              </header>
              <div className="knowledge-index-list">
                {items.map((item) => (
                  <a href={`/knowledge/${item.slug}`} className="knowledge-index-row" key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      {item.titleEn && <small>{item.titleEn}</small>}
                    </div>
                    <p>{item.summary}</p>
                    <span>↗</span>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
