import SectionHeader from "../section-header";
import ToolsBrowser from "./tools-browser";

export default function ToolsPage(){
  return <main className="app-shell"><SectionHeader active="Tools & Data"/><section className="section-page"><header className="section-hero"><p className="section-kicker">TOOLS & DATA</p><h1>工具与数据源</h1><p>优先收录免费或可免费使用的真实入口；付费工具会明确标记，避免把“贵但用不上”混进日常工具链。</p></header><ToolsBrowser/></section></main>;
}
