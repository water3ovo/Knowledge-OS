import SectionHeader from "../section-header";
import { getDomainGroups, getKnowledge } from "@/lib/content";

export default function MapPage(){
  const knowledge=getKnowledge(); const groups=getDomainGroups(knowledge);
  return <main className="app-shell"><SectionHeader active="Map"/><section className="section-page"><header className="section-hero"><p className="section-kicker">KNOWLEDGE MAP</p><h1>关系地图</h1><p>V1 先用可读的领域 → 概念 → Related 结构，不急着做满屏蜘蛛网。后续再升级语义图谱。</p></header><div className="map-columns">{groups.map(group=><section key={group.key}><div className="map-domain-title"><span>{group.index}</span><h2>{group.title}</h2></div>{group.concepts.map(item=><a className="map-item" href={`/knowledge/${item.slug}`} key={item.id}><strong>{item.title}</strong><small>{item.related.slice(0,3).join(" · ")||"—"}</small></a>)}</section>)}</div></section></main>;
}
