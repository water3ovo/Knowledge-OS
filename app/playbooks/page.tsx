import SectionHeader from "../section-header";
import { getLibraryItems } from "@/lib/content";

export default function PlaybooksPage(){
  const items=getLibraryItems().filter(item=>item.kind==="playbook");
  return <main className="app-shell"><SectionHeader active="Playbooks"/><section className="section-page"><header className="section-hero"><p className="section-kicker">PLAYBOOKS</p><h1>作战手册</h1><p>知识回答“是什么”，Playbook 回答“遇到这个问题下一步怎么做”。每个 Playbook 都连接到一组知识概念。</p></header><div className="playbook-list">{items.map((item,index)=><article className="playbook-card" id={item.id} key={item.id}><span className="playbook-number">{String(index+1).padStart(2,"0")}</span><div><p className="section-kicker">PLAYBOOK</p><h2>{item.title}</h2><p>{item.summary}</p><div className="mini-list">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div>{item.related.length>0&&<div className="related-chips" style={{marginTop:18}}>{item.related.map(id=><a href={`/knowledge/${id}`} key={id}>{id}</a>)}</div>}</div></article>)}</div></section></main>;
}
