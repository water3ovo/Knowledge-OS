"use client";

import { useEffect, useMemo, useState } from "react";

type KnowledgeItem = {
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
  updatedAt?: string;
};

type DomainGroup = {
  index: string;
  key: string;
  title: string;
  concepts: KnowledgeItem[];
};

type LibraryItem = {
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

type Props = {
  knowledge: KnowledgeItem[];
  domains: DomainGroup[];
  library: LibraryItem[];
};

const nav = ["Overview", "Knowledge", "Playbooks", "Tools & Data", "Cases", "Map"];
const recentSeed = ["three-gaps", "amazon-distribution", "black-box-system", "experiment", "google-search"];

export default function KnowledgeOSClient({ knowledge, domains, library }: Props) {
  const knowledgeById = useMemo(
    () => Object.fromEntries(knowledge.map((item) => [item.id, item])) as Record<string, KnowledgeItem>,
    [knowledge]
  );
  const libraryById = useMemo(
    () => Object.fromEntries(library.map((item) => [item.id, item])) as Record<string, LibraryItem>,
    [library]
  );

  const initialId = knowledgeById["three-gaps"] ? "three-gaps" : knowledge[0]?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentIds, setRecentIds] = useState<string[]>(recentSeed.filter((id) => knowledgeById[id]));

  const selected = selectedId ? knowledgeById[selectedId] : null;

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = [
      ...knowledge.map((item) => ({
        id: item.id,
        title: item.title,
        titleEn: item.titleEn,
        kind: "knowledge" as const,
        label: item.domain,
        haystack: [item.title, item.titleEn, item.domain, item.summary, ...item.tags, ...item.aliases].filter(Boolean).join(" "),
      })),
      ...library.map((item) => ({
        id: item.id,
        title: item.title,
        titleEn: item.titleEn,
        kind: item.kind,
        label: item.kind === "tool" ? "Tool" : item.kind === "playbook" ? "Playbook" : "Case",
        haystack: [item.title, item.titleEn, item.summary, ...item.tags, ...item.aliases].filter(Boolean).join(" "),
      })),
    ];

    if (!q) return all.filter((item) => item.kind === "knowledge").slice(0, 8);
    return all.filter((item) => item.haystack.toLowerCase().includes(q)).slice(0, 12);
  }, [knowledge, library, query]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("knowledge-os:recent");
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        const valid = parsed.filter((id) => knowledgeById[id]);
        if (valid.length) setRecentIds(valid.slice(0, 6));
      }
    } catch {
      // Local storage is an enhancement; the page remains usable without it.
    }
  }, [knowledgeById]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        else setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const remember = (id: string) => {
    const next = [id, ...recentIds.filter((item) => item !== id)].slice(0, 6);
    setRecentIds(next);
    try {
      window.localStorage.setItem("knowledge-os:recent", JSON.stringify(next));
    } catch {
      // Ignore storage failures.
    }
  };

  const openConcept = (id: string) => {
    if (!knowledgeById[id]) return;
    setSelectedId(id);
    remember(id);
    setSearchOpen(false);
    setQuery("");
  };

  const openSearchResult = (item: (typeof searchResults)[number]) => {
    if (item.kind === "knowledge") openConcept(item.id);
  };

  const activePlaybook = libraryById["ai-market-entry"] ?? library.find((item) => item.kind === "playbook");
  const activeTool = libraryById["semrush"] ?? library.find((item) => item.kind === "tool");
  const activeCase = libraryById["amazon-traffic-intelligence"] ?? library.find((item) => item.kind === "case");
  const selectedCase = selected?.cases.map((id) => libraryById[id]).find(Boolean) ?? activeCase;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">KNOWLEDGE / OS <span className="brand-dot">•</span></div>
        <nav className="topnav" aria-label="Primary">
          {nav.map((item, index) => (
            <button key={item} className={`nav-link ${index === 0 ? "active" : ""}`}>{item}</button>
          ))}
        </nav>
        <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search knowledge">
          <span className="search-icon">⌕</span><span>Search</span><kbd>⌘K</kbd>
        </button>
        <button className="theme-button" aria-label="Theme">☼</button>
        <div className="avatar" aria-hidden="true">M</div>
      </header>

      <section className={`workspace ${selected ? "drawer-open" : ""}`}>
        <aside className="research-panel">
          <div className="research-top">
            <p className="eyebrow">正在研究</p>
            <h1>平台流量分发</h1>
            <p className="subhead">Platform Distribution</p>
            <p className="research-copy">不是平台方时，如何系统性地观察与推断不同平台的流量分发机制与偏好？</p>
            <div className="tag-list">
              {["Black-box System", "Distribution", "Experiment", "Causal Inference"].map((tag) => <span key={tag} className="tag"># {tag}</span>)}
            </div>
          </div>

          <section className="current-question">
            <p className="section-kicker accent">当前问题 / 08.18</p>
            <h2>我们不是平台方，<br />怎么观测算法机制？</h2>
            <p>Amazon → Google → TikTok</p>
          </section>

          <section className="connecting">
            <p className="section-kicker">连接中 / CONNECTING</p>
            {[
              ["black-box-system", "黑箱系统识别"],
              ["auction", "广告拍卖机制"],
              ["organic-ranking", "自然排名机制"],
              ["response-curve", "Response Curve"],
              ["causal-inference", "因果推断"],
            ].map(([id, label]) => {
              const clickable = Boolean(knowledgeById[id]);
              return (
                <button key={id} className={`connection-row ${clickable ? "clickable" : ""}`} onClick={() => clickable && openConcept(id)}>
                  <span className="connection-mark">□</span><span>{label}</span>
                </button>
              );
            })}
          </section>

          <div className="research-footer">
            <span>EDITORIAL DIRECTION / V0.3</span>
            <span>DENSE, CALM, PERSONAL</span>
          </div>
        </aside>

        <section className="landscape-panel">
          <div className="panel-heading">
            <p className="section-kicker">KNOWLEDGE LANDSCAPE</p>
            <button className="expand-link">全部展开 ↗</button>
          </div>

          <div className="domain-grid">
            {domains.map((domain) => (
              <section key={domain.key} className="domain-block">
                <header className="domain-header">
                  <span className="domain-index">{domain.index}</span>
                  <h3>{domain.title}</h3>
                  <span className="domain-count">{domain.concepts.length}</span>
                </header>
                <div className="concept-list">
                  {domain.concepts.slice(0, 5).map((item) => (
                    <button key={item.id} onClick={() => openConcept(item.id)} className={`concept-row ${selectedId === item.id ? "selected" : ""}`}>
                      <span>{item.title}</span>
                      <span className="row-arrow">›</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="active-shelf">
            <p className="section-kicker">ACTIVE SHELF</p>
            <div className="shelf-grid">
              <article className="shelf-item">
                <span className="shelf-type">PLAYBOOK</span>
                <h4>{activePlaybook?.title ?? "AI 产品进入新市场"}</h4>
                <p>{activePlaybook?.summary || "从市场、用户、竞争到 GTM 的进入判断"}</p>
                <span className="shelf-arrow">↗</span>
              </article>
              <article className="shelf-item">
                <span className="shelf-type">TOOL</span>
                <h4>{activeTool?.title ?? "Semrush"}</h4>
                <p>{activeTool?.summary || "SEO / 竞品分析 / AI Visibility"}</p>
                <span className="shelf-arrow">↗</span>
              </article>
              <article className="shelf-item">
                <span className="shelf-type">CASE</span>
                <h4>{activeCase?.title ?? "Amazon Traffic Intelligence"}</h4>
                <p>{activeCase?.summary || "平台流量来源拆解与实验"}</p>
                <span className="shelf-arrow">↗</span>
              </article>
            </div>
          </section>

          <section className="recently-viewed">
            <p className="section-kicker">RECENTLY VIEWED</p>
            <div className="recent-list">
              {recentIds.map((id) => {
                const item = knowledgeById[id];
                if (!item) return null;
                return <button key={id} onClick={() => openConcept(id)} className="recent-chip">{item.title}</button>;
              })}
            </div>
          </section>
        </section>

        {selected && (
          <aside className="knowledge-drawer" aria-label="Knowledge detail">
            <div className="drawer-topline">
              <span>知识卡片</span>
              <button className="drawer-close" onClick={() => setSelectedId(null)} aria-label="Close">×</button>
            </div>
            <div className="drawer-title-row">
              <div>
                <h2>{selected.title}</h2>
                {selected.titleEn && <p className="drawer-subtitle">{selected.titleEn}</p>}
              </div>
              <div className="drawer-actions"><span>♡</span><span>•••</span></div>
            </div>
            <div className="drawer-tags">
              <span className="tag">{selected.domain}</span>
              {selected.tags.slice(0, 2).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>

            <div className="drawer-section">
              <p className="section-kicker">WHAT</p>
              <p>{selected.what}</p>
            </div>
            {selected.why && (
              <div className="drawer-section">
                <p className="section-kicker">WHY</p>
                <p>{selected.why}</p>
              </div>
            )}
            {selected.how.length > 0 && (
              <div className="drawer-section">
                <p className="section-kicker">HOW</p>
                <ol className="how-list">
                  {selected.how.map((step, index) => <li key={`${step}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}
                </ol>
              </div>
            )}
            {selected.related.length > 0 && (
              <div className="drawer-section">
                <p className="section-kicker">RELATED</p>
                <div className="related-list">
                  {selected.related.map((id) => {
                    const related = knowledgeById[id];
                    return (
                      <button key={id} onClick={() => related && openConcept(id)} style={{ cursor: related ? "pointer" : "default" }}>
                        {related?.title ?? id}<span>›</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {selectedCase && (
              <div className="drawer-section drawer-case">
                <p className="section-kicker">LINKS & CASES</p>
                <button className="case-link"><span>{selectedCase.title}</span><small>{selectedCase.summary}</small><b>↗</b></button>
              </div>
            )}
          </aside>
        )}
      </section>

      {searchOpen && (
        <div className="search-overlay" onMouseDown={() => setSearchOpen(false)}>
          <section className="command-palette" onMouseDown={(event) => event.stopPropagation()}>
            <div className="command-input-wrap">
              <span>⌕</span>
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索知识，例如：DSTE / SEO / Amazon…" />
              <kbd>ESC</kbd>
            </div>
            <div className="command-results">
              <p className="section-kicker">SEARCH RESULTS</p>
              {searchResults.map((item) => (
                <button key={`${item.kind}-${item.id}`} onClick={() => openSearchResult(item)} className="command-result">
                  <span><b>{item.title}</b>{item.titleEn && <small>{item.titleEn}</small>}</span>
                  <em>{item.label}</em>
                </button>
              ))}
              {searchResults.length === 0 && <p className="empty-result">没有找到匹配的内容。</p>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
