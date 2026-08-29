"use client";

import { useWebsitePreferences } from "./editor-preferences";

export default function SectionHeader({ active }: { active: string }) {
  const { preferences } = useWebsitePreferences();
  const nav = [
    [preferences.navLabels.dashboard, "/", "Overview"],
    [preferences.navLabels.knowledge, "/knowledge", "Knowledge"],
    [preferences.navLabels.topics, "/playbooks", "Playbooks"],
    ["常用网站", "/tools", "Tools & Data"],
    [preferences.navLabels.cases, "/cases", "Cases"],
    [preferences.navLabels.map, "/map", "Map"],
  ] as const;

  return (
    <header className="topbar section-topbar">
      <a className="brand plain-link" href="/">Knowledge OS <span className="brand-dot">•</span></a>
      <nav className="topnav" aria-label="Primary">
        {nav.map(([label, href, key]) => (
          <a key={key} href={href} className={`nav-link plain-link ${active === key ? "active" : ""}`}>
            {label}
          </a>
        ))}
      </nav>
      <a className="search-trigger plain-link" href="/knowledge">
        <span className="search-icon">⌕</span><span>搜索</span><kbd>⌘K</kbd>
      </a>
      <span className="theme-button" aria-hidden="true">☼</span>
      <div className="avatar" aria-hidden="true">M</div>
    </header>
  );
}
