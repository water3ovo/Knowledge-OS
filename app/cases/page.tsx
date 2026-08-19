import SectionHeader from "../section-header";
import { getLibraryItems } from "@/lib/content";

export default function CasesPage(){
  const items=getLibraryItems().filter(item=>item.kind==="case");
  return <main className="app-shell"><SectionHeader active="Cases"/><section className="section-page"><header className="section-hero"><p className="section-kicker">CASES & EXPERIMENTS</p><h1>案例与实验</h1><p>把知识放进真实问题中验证，逐步沉淀成可以展示、复用和继续迭代的案例。</p></header><div className="case-grid">{items.map(item=><article className="case-card" key={item.id}><p className="section-kicker">CASE</p><h2>{item.title}</h2><p>{item.summary}</p><div className="mini-list">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div>{item.related.length>0&&<div className="related-chips" style={{marginTop:18}}>{item.related.map(id=><a href={`/knowledge/${id}`} key={id}>{id}</a>)}</div>}</article>)}</div></section></main>;
}
