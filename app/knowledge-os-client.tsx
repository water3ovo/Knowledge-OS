"use client";

import { useEffect, useMemo, useState } from "react";
import { useWebsitePreferences } from "./editor-preferences";

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

type SyncState = {
  lastSyncedAt: string;
  lastDelta: {
    summary: string;
    operations: string[];
    changed: string[];
  };
};

type Props = {
  knowledge: KnowledgeItem[];
  domains: DomainGroup[];
  library: LibraryItem[];
  syncState: SyncState;
};

const COMMON_LINKS = [
  ["Meta 广告库", "检索 Meta 平台的广告创意与投放信息", "https://www.facebook.com/ads/library/", "M"],
  ["Google Ads 帮助中心", "官方文档与操作指引", "https://support.google.com/google-ads/", "G"],
  ["Similarweb", "网站流量与市场洞察分析", "https://www.similarweb.com/", "S"],
  ["Semrush", "SEO / 竞品 / 关键词研究工具", "https://www.semrush.com/", "S"],
  ["TikTok 创意中心", "发现热门创意与趋势素材", "https://ads.tiktok.com/business/creativecenter/", "T"],
  ["Amazon Ads 文档中心", "亚马逊广告产品与投放指南", "https://advertising.amazon.com/library", "A"],
] as const;

function formatTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  const now = Date.now();
  const diff = now - date.getTime();
  if (diff >= 0 && diff < 86_400_000) {
    const hours = Math.max(1, Math.round(diff / 3_600_000));
    return `${hours} 小时前`;
  }
  return value.slice(0, 10);
}

function HeroEye() {
  return (
    <svg className="hero-eye" viewBox="0 0 520 330" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M96 185 C156 116 249 94 365 145 C323 206 249 234 170 213 C139 205 113 195 96 185Z" strokeWidth="2.2" />
        <path d="M130 165 C184 122 258 114 338 148" strokeWidth="1.1" opacity=".72" />
        <path d="M134 201 C194 228 278 220 340 171" strokeWidth="1.1" opacity=".6" />
        <ellipse cx="244" cy="174" rx="43" ry="50" strokeWidth="2" />
        <ellipse cx="244" cy="177" rx="18" ry="24" strokeWidth="1.4" />
        <path d="M70 110 L178 148 M72 126 L185 155 M88 86 L196 143 M110 73 L209 139 M315 137 L432 103 M313 145 L448 128 M310 155 L454 154 M314 164 L446 181" strokeWidth=".8" opacity=".48" />
        <path d="M122 244 C187 274 294 273 380 220 M155 267 C224 286 306 278 361 247" strokeWidth=".75" opacity=".32" />
      </g>
    </svg>
  );
}

export default function KnowledgeOSClient({ knowledge, domains, library, syncState }: Props) {
  const { preferences, moduleStyle } = useWebsitePreferences();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recentIds, setRecentIds] = useState<string[]>([]);

  const knowledgeById = useMemo(() => Object.fromEntries(knowledge.map((item) => [item.id, item])) as Record<string, KnowledgeItem>, [knowledge]);
  const recentKnowledge = useMemo(() => [...knowledge].sort((a, b) => {
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bTime - aTime;
  }).slice(0, 7), [knowledge]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = [
      ...knowledge.map((item) => ({ id: item.id, slug: item.slug, title: item.title, meta: item.domain, haystack: [item.title, item.titleEn, item.domain, item.summary, ...item.tags, ...item.aliases].filter(Boolean).join(" ") })),
      ...library.map((item) => ({ id: item.id, slug: item.slug, title: item.title, meta: item.kind, haystack: [item.title, item.titleEn, item.summary, ...item.tags, ...item.aliases].filter(Boolean).join(" ") })),
    ];
    if (!q) return all.slice(0, 8);
    return all.filter((item) => item.haystack.toLowerCase().includes(q)).slice(0, 12);
  }, [knowledge, library, query]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("knowledge-os:recent");
      if (stored) setRecentIds((JSON.parse(stored) as string[]).filter((id) => knowledgeById[id]).slice(0, 4));
    } catch {}
  }, [knowledgeById]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openKnowledge = (item: KnowledgeItem) => {
    const next = [item.id, ...recentIds.filter((id) => id !== item.id)].slice(0, 4);
    setRecentIds(next);
    try { window.localStorage.setItem("knowledge-os:recent", JSON.stringify(next)); } catch {}
    window.location.href = `/knowledge/${item.slug}`;
  };

  const deltaOperations = new Set(syncState.lastDelta.operations.map((op) => op.toUpperCase()));
  const changedCount = syncState.lastDelta.changed.length;
  const delta = [
    ["新知识", deltaOperations.has("CREATE") ? changedCount : 0, "✧"],
    ["更新", deltaOperations.has("UPDATE") ? changedCount : 0, "↻"],
    ["新关联", deltaOperations.has("LINK") ? changedCount : 0, "⌁"],
    ["开放问题", deltaOperations.has("QUESTION") ? changedCount : 0, "?"],
  ] as const;

  const currentResearchDays = 3;
  const currentResearchNotes = Math.min(knowledge.length, 18);
  const openQuestionCount = preferences.openQuestions.length;

  const recentEntryItems = recentIds.map((id) => knowledgeById[id]).filter(Boolean);
  const fallbackEntryItems = recentKnowledge.slice(0, 4);
  const entryItems = recentEntryItems.length ? recentEntryItems : fallbackEntryItems;

  const topNav = [
    [preferences.navLabels.dashboard, "/"],
    [preferences.navLabels.knowledge, "/knowledge"],
    [preferences.navLabels.topics, "/playbooks"],
    [preferences.navLabels.learning, "/#learning"],
    [preferences.navLabels.cases, "/cases"],
    [preferences.navLabels.map, "/map"],
  ] as const;

  return (
    <main className="ko-day-app">
      <aside className="ko-sidebar">
        <a className="ko-brand" href="/">
          <span className="ko-brand-mark">◇</span>
          <span><b>Knowledge OS</b><small>知识操作系统</small></span>
        </a>
        <nav className="ko-side-nav">
          <a className="active" href="/"><span>⌂</span>首页</a>
          <a href="/knowledge"><span>▤</span>知识库</a>
          <a href="#learning"><span>▣</span>学习记录</a>
          <a href="/playbooks"><span>◫</span>实战手册</a>
          <a href="/cases"><span>▱</span>案例库</a>
          <a href="#links"><span>◎</span>常用网站</a>
          <a href="/map"><span>⌘</span>知识地图</a>
        </nav>
        <a className="ko-settings-link" href="#" onClick={(event) => event.preventDefault()}><span>⚙</span>设置</a>
      </aside>

      <section className="ko-main-shell">
        <header className="ko-topbar">
          <button className="ko-search" onClick={() => setSearchOpen(true)}><span>⌕</span>搜索知识、笔记、案例、网站…<kbd>⌘K</kbd></button>
          <div className="ko-top-actions"><span>☼</span><span>♧</span><span className="ko-avatar">M</span></div>
        </header>

        <nav className="ko-topnav">
          {topNav.map(([label, href], index) => <a key={href} className={index === 0 ? "active" : ""} href={href}>{label}</a>)}
        </nav>

        <div className="ko-dashboard-grid">
          <section className="ko-panel ko-hero" data-ko-module="hero" style={moduleStyle("hero")}>
            <div className="ko-hero-content">
              <p className="ko-mono-label">{preferences.heroEyebrow}</p>
              <h1>{preferences.heroTitle}</h1>
              <p className="ko-hero-summary">{preferences.heroSummary}</p>
              <p className="ko-current-question"><span>当前问题：</span>{preferences.heroQuestion}</p>
              <div className="ko-research-meta">
                <span>▣ <b>学习 {currentResearchDays} 天</b></span>
                <span>◇ <b>已沉淀 {currentResearchNotes} 个知识点</b></span>
                <span>？ <b>{openQuestionCount} 个开放问题</b></span>
                <span>↗ <b>最近同步 {syncState.lastSyncedAt.slice(5, 16).replace("T", " ")}</b></span>
              </div>
              <div className="ko-hero-actions"><a className="ko-primary-action" href="#learning">继续学习 →</a><a className="ko-secondary-action" href="#recent">查看本次沉淀</a></div>
            </div>
            <HeroEye />
          </section>

          <section className="ko-panel ko-delta" data-ko-module="delta" style={moduleStyle("delta")}>
            <header><h2>最近知识变化</h2><small>{syncState.lastDelta.summary}</small></header>
            <div className="ko-delta-grid">
              {delta.map(([label, count, icon]) => (
                <div className="ko-delta-item" key={label}><span className="ko-delta-icon">{icon}</span><small>{label}</small><strong>{count}</strong><em>{count ? `本次 +${count}` : "本次无变化"}</em></div>
              ))}
            </div>
          </section>

          <section className="ko-panel ko-list-panel" id="recent" data-ko-module="recent" style={moduleStyle("recent")}>
            <header><h2>最近沉淀</h2><a href="/knowledge">查看全部 →</a></header>
            <div className="ko-rows">
              {recentKnowledge.slice(0, 5).map((item) => <button key={item.id} onClick={() => openKnowledge(item)}><span>▧</span><b>{item.title}</b><time>{formatTime(item.updatedAt)}</time></button>)}
            </div>
          </section>

          <section className="ko-panel ko-list-panel" data-ko-module="questions" style={moduleStyle("questions")}>
            <header><h2>开放问题</h2><span>{preferences.openQuestions.length}</span></header>
            <div className="ko-rows ko-question-rows">
              {preferences.openQuestions.slice(0, 5).map((question, index) => <div key={`${question}-${index}`}><span>?</span><b>{question}</b><time>{index === 0 ? "刚刚" : `${index} 小时前`}</time></div>)}
            </div>
          </section>

          <section className="ko-panel ko-links-panel" id="links" data-ko-module="links" style={moduleStyle("links")}>
            <header><h2>常用网站和链接</h2><small>仅保存网址，不接入任何外部应用</small></header>
            <div className="ko-link-list">
              {COMMON_LINKS.map(([title, description, href, mark]) => <a href={href} target="_blank" rel="noreferrer" key={title}><span className="ko-site-mark">{mark}</span><span><b>{title}</b><small>{description}</small></span><em>↗</em></a>)}
            </div>
          </section>

          <section className="ko-panel ko-list-panel ko-recent-entry" id="learning" data-ko-module="recent" style={moduleStyle("recent")}>
            <header><h2>最近进入</h2><a href="/knowledge">查看全部历史 →</a></header>
            <div className="ko-rows">
              {entryItems.slice(0, 4).map((item) => <button key={item.id} onClick={() => openKnowledge(item)}><span>◈</span><b>{item.title}</b><time>{formatTime(item.updatedAt)}</time></button>)}
            </div>
          </section>

          <section className="ko-panel ko-map-panel" data-ko-module="map" style={moduleStyle("map")}>
            <header><h2>知识版图</h2><a href="/map">查看完整知识地图 →</a></header>
            <div className="ko-domain-strip">
              {domains.map((domain) => <a href={`/knowledge?domain=${domain.key}`} key={domain.key}><span>{domain.title}</span><b>{domain.concepts.length}</b></a>)}
            </div>
          </section>
        </div>
      </section>

      {searchOpen && (
        <div className="search-overlay ko-search-overlay" onMouseDown={() => setSearchOpen(false)}>
          <section className="command-palette ko-command" onMouseDown={(event) => event.stopPropagation()}>
            <div className="command-input-wrap"><span>⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索知识、笔记、案例…" /><kbd>ESC</kbd></div>
            <div className="command-results">
              <p className="section-kicker">SEARCH RESULTS</p>
              {searchResults.map((item) => <a key={item.id} className="command-result" href={knowledgeById[item.id] ? `/knowledge/${item.slug}` : "/knowledge"}><span><b>{item.title}</b><small>{item.meta}</small></span><em>↗</em></a>)}
              {!searchResults.length && <p className="empty-result">没有找到匹配的内容。</p>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
