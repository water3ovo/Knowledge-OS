import SectionHeader from "../section-header";
import KnowledgeBrowser from "./knowledge-browser";
import { getDomainGroups, getKnowledge } from "@/lib/content";

export default function KnowledgePage() {
  const knowledge = getKnowledge();
  const domains = getDomainGroups(knowledge);

  return (
    <main className="app-shell">
      <SectionHeader active="Knowledge" />
      <section className="section-page">
        <header className="section-hero">
          <p className="section-kicker">KNOWLEDGE INDEX</p>
          <h1>完整知识库</h1>
          <p>按领域浏览，也可以直接搜索概念。这里显示全部知识，不受 Overview 每个 Domain 只展示 5 条的限制。</p>
        </header>
        <KnowledgeBrowser knowledge={knowledge} domains={domains} />
      </section>
    </main>
  );
}
