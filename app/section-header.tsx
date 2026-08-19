const nav = [
  ["Overview", "/"],
  ["Knowledge", "/knowledge"],
  ["Playbooks", "/playbooks"],
  ["Tools & Data", "/tools"],
  ["Cases", "/cases"],
  ["Map", "/map"],
] as const;

export default function SectionHeader({ active }: { active: string }) {
  return (
    <header className="topbar section-topbar">
      <a className="brand plain-link" href="/">KNOWLEDGE / OS <span className="brand-dot">•</span></a>
      <nav className="topnav" aria-label="Primary">
        {nav.map(([label, href]) => (
          <a key={label} href={href} className={`nav-link plain-link ${active === label ? "active" : ""}`}>
            {label}
          </a>
        ))}
      </nav>
      <a className="search-trigger plain-link" href="/knowledge">
        <span className="search-icon">⌕</span><span>Search</span><kbd>⌘K</kbd>
      </a>
      <span className="theme-button" aria-hidden="true">☼</span>
      <div className="avatar" aria-hidden="true">M</div>
    </header>
  );
}
