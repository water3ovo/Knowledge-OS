import { notFound } from "next/navigation";
import SectionHeader from "../../section-header";
import KnowledgeDetailClient from "./knowledge-detail-client";
import { getAllKnowledge } from "@/lib/all-content";

export function generateStaticParams() {
  return getAllKnowledge().map((item) => ({ slug: item.slug }));
}

export default async function KnowledgeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getAllKnowledge().find((entry) => entry.slug === slug || entry.id === slug);
  if (!item) notFound();

  return (
    <main className="app-shell">
      <SectionHeader active="Knowledge" />
      <article className="detail-page">
        <a className="back-link" href="/knowledge">← 知识索引</a>
        <KnowledgeDetailClient item={item} />
      </article>
    </main>
  );
}
