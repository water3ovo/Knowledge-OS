import { notFound } from "next/navigation";
import SectionHeader from "../../section-header";
import { getKnowledge } from "@/lib/content";

export function generateStaticParams() {
  return getKnowledge().map((item) => ({ slug: item.slug }));
}

export default async function KnowledgeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getKnowledge().find((entry) => entry.slug === slug || entry.id === slug);
  if (!item) notFound();

  return (
    <main className="app-shell">
      <SectionHeader active="Knowledge" />
      <article className="detail-page">
        <a className="back-link" href="/knowledge">← Knowledge</a>
        <header className="detail-hero">
          <p className="section-kicker">{item.domain} / {item.type ?? "Concept"}</p>
          <h1>{item.title}</h1>
          {item.titleEn && <p className="detail-subtitle">{item.titleEn}</p>}
          <div className="tag-list">{item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        </header>

        <div className="detail-columns">
          <div className="detail-main">
            <section><p className="section-kicker">WHAT</p><p>{item.what}</p></section>
            {item.why && <section><p className="section-kicker">WHY</p><p>{item.why}</p></section>}
            {item.when && item.when.length > 0 && <section><p className="section-kicker">WHEN</p><ul>{item.when.map((x) => <li key={x}>{x}</li>)}</ul></section>}
            {item.how.length > 0 && <section><p className="section-kicker">HOW</p><ol>{item.how.map((x) => <li key={x}>{x}</li>)}</ol></section>}
            {item.pitfalls.length > 0 && <section><p className="section-kicker">PITFALLS</p><ul>{item.pitfalls.map((x) => <li key={x}>{x}</li>)}</ul></section>}
          </div>
          <aside className="detail-side">
            {item.data.length > 0 && <section><p className="section-kicker">DATA</p><ul>{item.data.map((x) => <li key={x}>{x}</li>)}</ul></section>}
            {item.tools.length > 0 && <section><p className="section-kicker">TOOLS</p><ul>{item.tools.map((x) => <li key={x}>{x}</li>)}</ul></section>}
            {item.output.length > 0 && <section><p className="section-kicker">OUTPUT</p><ul>{item.output.map((x) => <li key={x}>{x}</li>)}</ul></section>}
            {item.related.length > 0 && <section><p className="section-kicker">RELATED</p><div className="related-chips">{item.related.map((id) => <a key={id} href={`/knowledge/${id}`}>{id}</a>)}</div></section>}
            {item.sources.length > 0 && <section><p className="section-kicker">SOURCES</p><div className="source-links">{item.sources.map((url, i) => <a href={url} target="_blank" rel="noreferrer" key={url}>Source {i + 1} ↗</a>)}</div></section>}
          </aside>
        </div>
      </article>
    </main>
  );
}
