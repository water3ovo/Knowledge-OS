"use client";

import { useEffect, useMemo, useState } from "react";

type Concept = {
  id: string;
  title: string;
  titleEn?: string;
  domain: string;
  tags?: string[];
  what: string;
  why?: string;
  how?: string[];
  related?: string[];
};

type Domain = {
  index: string;
  title: string;
  count: number;
  concepts: string[];
};

const domains: Domain[] = [
  { index: "01", title: "STRATEGY", count: 18, concepts: ["dste", "blm", "three-gaps", "gsa", "five-looks-three-decisions"] },
  { index: "02", title: "GLOBAL GTM", count: 24, concepts: ["market-intelligence", "icp-jtbd", "positioning", "pricing", "launch"] },
  { index: "03", title: "GROWTH", count: 22, concepts: ["seo", "geo-ai-search", "plg", "aarrr", "retention"] },
  { index: "04", title: "AI PRODUCT", count: 19, concepts: ["llm", "agent", "rag", "mcp", "workflow"] },
  { index: "05", title: "DATA", count: 20, concepts: ["funnel", "cohort", "cac-ltv", "experiment", "causal-inference"] },
  { index: "06", title: "PLATFORM", count: 18, concepts: ["amazon-distribution", "google-search", "tiktok", "meta", "app-store"] },
];

const concepts: Record<string, Concept> = {
  dste: {
    id: "dste", title: "DSTE", titleEn: "Develop Strategy to Execution", domain: "Strategy", tags: ["Strategy", "SP", "BP"],
    what: "把战略规划、年度经营计划、执行监控与复盘连接成端到端闭环的战略管理框架。",
    why: "战略的难点不只在于做出选择，还在于把选择落实到年度目标、预算、组织和关键任务。",
    how: ["识别差距与战略议题", "制定中长期战略（SP）", "战略解码", "形成年度 BP 与资源配置", "执行、监控与复盘"],
    related: ["BLM", "三差分析", "GSA"],
  },
  blm: {
    id: "blm", title: "BLM", titleEn: "Business Leadership Model", domain: "Strategy", tags: ["Strategy", "Business Design"],
    what: "把战略选择与执行能力放在同一框架中分析，强调战略必须与组织、人才和文化相匹配。",
    why: "它帮助区分到底是战略选错了，还是执行和组织能力不足。",
    how: ["从差距出发", "进行市场洞察", "形成业务设计", "明确关键任务", "检查组织、人才和文化是否支撑"],
    related: ["DSTE", "三差分析", "业务设计"],
  },
  "three-gaps": {
    id: "three-gaps", title: "三差分析", titleEn: "Three Gaps Analysis", domain: "Strategy", tags: ["Strategy", "Gap Analysis", "Benchmark"],
    what: "从业绩差距、机会差距、对标差距三个视角识别：为什么需要调整战略，以及应该优先解决什么。",
    why: "三类差距对应不同问题：没完成既定目标、没有抓住更大机会、或与优秀竞争者之间存在能力差距。",
    how: ["比较目标与实际：业绩差距", "比较当前目标与潜在机会：机会差距", "比较自身与最佳实践：对标差距", "继续拆解根因", "转化为战略议题与关键任务"],
    related: ["DSTE", "BLM", "GSA", "Market Intelligence"],
  },
  gsa: {
    id: "gsa", title: "GSA", titleEn: "Goal · Strategy · Action", domain: "Strategy", tags: ["Goal", "Strategy", "Action"],
    what: "用 Goal、Strategy、Action 三层把共识从结果目标拆成路径选择和具体行动。",
    why: "避免战略停留在口号，让每一个行动都能够追溯到某条策略和最终目标。",
    how: ["定义成果 Goal", "确定关键 Strategy", "拆解可执行 Action", "绑定 Owner 与里程碑", "检查 G-S-A 因果关系"],
    related: ["DSTE", "三差分析", "BP"],
  },
  "five-looks-three-decisions": { id: "five-looks-three-decisions", title: "五看三定", domain: "Strategy", what: "通过多维市场洞察形成战略判断，再把判断落实为方向、目标和关键策略。" },
  "market-intelligence": { id: "market-intelligence", title: "Market Intelligence", domain: "Global GTM", what: "持续收集市场、用户、竞争和趋势信号，支持市场选择与 GTM 判断。" },
  "icp-jtbd": { id: "icp-jtbd", title: "ICP / JTBD", domain: "Global GTM", what: "明确最值得服务的客户是谁，以及用户真正想完成的任务是什么。" },
  positioning: { id: "positioning", title: "Positioning", domain: "Global GTM", what: "定义产品在目标用户心智中的位置：为谁、解决什么、为什么选我们。" },
  pricing: { id: "pricing", title: "Pricing", domain: "Global GTM", what: "围绕价值、支付意愿、竞争和单位经济设计价格与套餐。" },
  launch: { id: "launch", title: "Launch", domain: "Global GTM", what: "组织产品进入市场的首次集中曝光、验证与用户获取。" },
  seo: { id: "seo", title: "SEO", titleEn: "Search Engine Optimization", domain: "Growth", tags: ["Search", "Organic Growth"], what: "通过内容、技术和站点权威性提升网页在搜索结果中的自然可见度。", why: "把持续存在的搜索需求转化为长期自然获客入口。", how: ["Keyword / Topic Research", "判断 Search Intent", "研究 SERP", "创建满足意图的页面", "持续用 Search Console 复盘"], related: ["GEO / AI Search", "Semrush", "Search Intent"] },
  "geo-ai-search": { id: "geo-ai-search", title: "GEO / AI Search", titleEn: "AI Search Visibility", domain: "Growth", tags: ["GEO", "AEO", "AI Search"], what: "研究品牌和内容如何在生成式搜索与 AI 回答中被发现、提及和引用。", why: "用户的信息发现正在从传统搜索扩展到 AI 生成答案。", how: ["先做好基础 SEO", "研究 Prompt / Topic", "提供原创且可验证的信息", "建立品牌实体与可信信号", "监控 Mention / Citation / Prompt Gap"], related: ["SEO", "Semrush", "Black-box System"] },
  plg: { id: "plg", title: "PLG", titleEn: "Product-Led Growth", domain: "Growth", what: "让产品体验本身承担获客、激活、留存、付费和传播的一部分增长职责。" },
  aarrr: { id: "aarrr", title: "AARRR", domain: "Growth", what: "Acquisition、Activation、Retention、Revenue、Referral 五阶段增长漏斗。" },
  retention: { id: "retention", title: "Retention", domain: "Growth", what: "衡量用户是否持续回到产品并形成长期价值。" },
  llm: { id: "llm", title: "LLM", titleEn: "Large Language Model", domain: "AI Product", what: "能够理解和生成语言等内容的大规模生成式模型，是大量 AI 产品的基础能力层。" },
  agent: { id: "agent", title: "Agent", domain: "AI Product", what: "能够围绕目标进行推理、调用工具、执行动作并根据结果继续推进任务的 AI 系统。" },
  rag: { id: "rag", title: "RAG", titleEn: "Retrieval-Augmented Generation", domain: "AI Product", what: "先检索外部知识，再用检索结果约束或增强模型生成。" },
  mcp: { id: "mcp", title: "MCP", titleEn: "Model Context Protocol", domain: "AI Product", what: "用于让模型和外部工具、数据源以标准化方式连接的协议。" },
  workflow: { id: "workflow", title: "Workflow", domain: "AI Product", what: "把多个 AI / 工具 / 人工步骤编排成可重复执行的业务流程。" },
  funnel: { id: "funnel", title: "Funnel", domain: "Data", what: "把用户从进入到关键转化的连续行为拆成阶段，定位损失发生在哪一层。" },
  cohort: { id: "cohort", title: "Cohort", domain: "Data", what: "把具有共同起点或特征的用户分组，比较不同群体随时间变化的行为。" },
  "cac-ltv": { id: "cac-ltv", title: "CAC / LTV", domain: "Data", what: "用获客成本和客户生命周期价值判断增长是否具有可持续的单位经济。" },
  experiment: { id: "experiment", title: "Experiment", domain: "Data", what: "通过明确假设、干预、对照和结果指标验证某个增长动作是否有效。" },
  "causal-inference": { id: "causal-inference", title: "因果推断", titleEn: "Causal Inference", domain: "Data", tags: ["Experiment", "Causality"], what: "通过实验或准实验方法区分“只是一起变化”与“某个动作真正造成了结果变化”。", why: "增长分析最容易把相关性误当成因果，进而做出错误优化。", how: ["定义 Treatment", "定义结果指标", "构造合理 Control / Counterfactual", "估计 Incremental Effect", "做稳健性检验"], related: ["Black-box System", "Experiment", "Amazon 流量分发"] },
  "amazon-distribution": { id: "amazon-distribution", title: "Amazon 流量分发", titleEn: "Amazon Traffic Distribution", domain: "Platform", tags: ["Amazon", "Distribution", "Search"], what: "把 Amazon 看作由自然搜索、广告、推荐和商品详情页等多个分发系统组成的黑箱，并通过可观测数据与实验逼近其响应机制。", why: "帮助区分需求、分发、点击和转化问题，而不是把所有变化都归结为广告 ROAS。", how: ["画流量入口地图", "确定可观测信号", "建立 Demand → Distribution → Click → Purchase 漏斗", "找到可操纵变量", "做干预实验并控制干扰", "跨时间和 ASIN 重复验证"], related: ["Black-box System", "Causal Inference", "Experiment"] },
  "google-search": { id: "google-search", title: "Google Search", domain: "Platform", what: "研究 Google 的抓取、索引、排名和 AI Search 如何共同决定网页可见度。" },
  tiktok: { id: "tiktok", title: "TikTok", domain: "Platform", what: "研究短视频内容如何通过用户反馈信号进入推荐分发并持续扩散。" },
  meta: { id: "meta", title: "Meta", domain: "Platform", what: "研究广告竞价、素材和用户响应如何共同影响 Meta 广告投放与分发。" },
  "app-store": { id: "app-store", title: "App Store", domain: "Platform", what: "研究关键词、转化、评分和用户行为等因素与应用商店发现和排名的关系。" },
  "black-box-system": { id: "black-box-system", title: "黑箱系统识别", titleEn: "Black-box System Identification", domain: "Platform", tags: ["Platform", "Experiment"], what: "在看不到平台内部算法的情况下，通过输入变化、输出变化和重复实验逼近系统行为。", why: "业务上不需要知道精确算法源码，更需要知道哪些可控变量能够稳定改变结果。", how: ["明确研究入口", "列出可观测信号", "找到可操纵变量", "实施干预", "测量响应", "控制干扰并重复验证"], related: ["Amazon 流量分发", "因果推断", "Experiment"] },
};

const nav = ["Overview", "Knowledge", "Playbooks", "Tools & Data", "Cases", "Map"];

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>("three-gaps");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = selectedId ? concepts[selectedId] : null;

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return Object.values(concepts).slice(0, 8);
    return Object.values(concepts).filter((item) =>
      [item.title, item.titleEn, item.domain, ...(item.tags ?? [])]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    ).slice(0, 10);
  }, [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        else setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const openConcept = (id: string) => {
    setSelectedId(id);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">KNOWLEDGE / OS <span className="brand-dot">•</span></div>
        <nav className="topnav" aria-label="Primary">
          {nav.map((item, index) => (
            <button key={item} className={`nav-link ${index === 0 ? "active" : ""}`}>{item}</button>
          ))}
        </nav>
        <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search knowledge">
          <span className="search-icon">⌕</span><span>Search</span><kbd>⌘K</kbd>
        </button>
        <button className="theme-button" aria-label="Theme">☼</button>
        <div className="avatar" aria-hidden="true">M</div>
      </header>

      <section className={`workspace ${selected ? "drawer-open" : ""}`}>
        <aside className="research-panel">
          <div className="research-top">
            <p className="eyebrow">正在研究</p>
            <h1>平台流量分发</h1>
            <p className="subhead">Platform Distribution</p>
            <p className="research-copy">不是平台方时，如何系统性地观察与推断不同平台的流量分发机制与偏好？</p>
            <div className="tag-list">
              {["Black-box System", "Distribution", "Experiment", "Causal Inference"].map((tag) => <span key={tag} className="tag"># {tag}</span>)}
            </div>
          </div>

          <section className="current-question">
            <p className="section-kicker accent">当前问题 / 08.18</p>
            <h2>我们不是平台方，<br />怎么观测算法机制？</h2>
            <p>Amazon → Google → TikTok</p>
          </section>

          <section className="connecting">
            <p className="section-kicker">连接中 / CONNECTING</p>
            {["black-box-system", "auction", "organic-ranking", "response-curve", "causal-inference"].map((id, index) => {
              const labels = ["黑箱系统识别", "广告拍卖机制", "自然排名机制", "Response Curve", "因果推断"];
              const clickable = Boolean(concepts[id]);
              return (
                <button key={id} className={`connection-row ${clickable ? "clickable" : ""}`} onClick={() => clickable && openConcept(id)}>
                  <span className="connection-mark">□</span><span>{labels[index]}</span>
                </button>
              );
            })}
          </section>

          <div className="research-footer">
            <span>EDITORIAL DIRECTION / V0.3</span>
            <span>DENSE, CALM, PERSONAL</span>
          </div>
        </aside>

        <section className="landscape-panel">
          <div className="panel-heading">
            <p className="section-kicker">KNOWLEDGE LANDSCAPE</p>
            <button className="expand-link">全部展开 ↗</button>
          </div>

          <div className="domain-grid">
            {domains.map((domain) => (
              <section key={domain.title} className="domain-block">
                <header className="domain-header">
                  <span className="domain-index">{domain.index}</span>
                  <h3>{domain.title}</h3>
                  <span className="domain-count">{domain.count}</span>
                </header>
                <div className="concept-list">
                  {domain.concepts.map((id) => {
                    const item = concepts[id];
                    return (
                      <button key={id} onClick={() => openConcept(id)} className={`concept-row ${selectedId === id ? "selected" : ""}`}>
                        <span>{item.title}</span>
                        <span className="row-arrow">›</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <section className="active-shelf">
            <p className="section-kicker">ACTIVE SHELF</p>
            <div className="shelf-grid">
              <article className="shelf-item">
                <span className="shelf-type">PLAYBOOK</span>
                <h4>AI 产品进入新市场</h4>
                <p>更新于 2 天前 · 12 步骤</p>
                <span className="shelf-arrow">↗</span>
              </article>
              <article className="shelf-item">
                <span className="shelf-type">TOOL</span>
                <h4>Semrush</h4>
                <p>SEO / 竞品分析 / AI Visibility</p>
                <span className="shelf-arrow">↗</span>
              </article>
              <article className="shelf-item">
                <span className="shelf-type">CASE</span>
                <h4>Amazon Traffic Intelligence</h4>
                <p>平台流量来源拆解与实验</p>
                <span className="shelf-arrow">↗</span>
              </article>
            </div>
          </section>

          <section className="recently-viewed">
            <p className="section-kicker">RECENTLY VIEWED</p>
            <div className="recent-list">
              {[
                ["three-gaps", "三差分析"],
                ["amazon-distribution", "Amazon 流量分发"],
                ["black-box-system", "黑箱系统识别"],
                ["experiment", "Experiment"],
                ["google-search", "Google 排名机制"],
              ].map(([id, label]) => (
                <button key={id} onClick={() => openConcept(id)} className="recent-chip">{label}</button>
              ))}
            </div>
          </section>
        </section>

        {selected && (
          <aside className="knowledge-drawer" aria-label="Knowledge detail">
            <div className="drawer-topline">
              <span>知识卡片</span>
              <button className="drawer-close" onClick={() => setSelectedId(null)} aria-label="Close">×</button>
            </div>
            <div className="drawer-title-row">
              <div>
                <h2>{selected.title}</h2>
                {selected.titleEn && <p className="drawer-subtitle">{selected.titleEn}</p>}
              </div>
              <div className="drawer-actions"><span>♡</span><span>•••</span></div>
            </div>
            <div className="drawer-tags">
              <span className="tag">{selected.domain}</span>
              {(selected.tags ?? []).slice(0, 2).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>

            <div className="drawer-section">
              <p className="section-kicker">WHAT</p>
              <p>{selected.what}</p>
            </div>
            {selected.why && (
              <div className="drawer-section">
                <p className="section-kicker">WHY</p>
                <p>{selected.why}</p>
              </div>
            )}
            {selected.how && (
              <div className="drawer-section">
                <p className="section-kicker">HOW</p>
                <ol className="how-list">
                  {selected.how.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}
                </ol>
              </div>
            )}
            {selected.related && (
              <div className="drawer-section">
                <p className="section-kicker">RELATED</p>
                <div className="related-list">
                  {selected.related.map((item) => <button key={item}>{item}<span>›</span></button>)}
                </div>
              </div>
            )}
            <div className="drawer-section drawer-case">
              <p className="section-kicker">LINKS & CASES</p>
              <button className="case-link"><span>Amazon 流量下降诊断</span><small>案例 · 流量分析</small><b>↗</b></button>
            </div>
          </aside>
        )}
      </section>

      {searchOpen && (
        <div className="search-overlay" onMouseDown={() => setSearchOpen(false)}>
          <section className="command-palette" onMouseDown={(e) => e.stopPropagation()}>
            <div className="command-input-wrap">
              <span>⌕</span>
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索知识，例如：DSTE / SEO / Amazon…" />
              <kbd>ESC</kbd>
            </div>
            <div className="command-results">
              <p className="section-kicker">KNOWLEDGE</p>
              {searchResults.map((item) => (
                <button key={item.id} onClick={() => openConcept(item.id)} className="command-result">
                  <span><b>{item.title}</b>{item.titleEn && <small>{item.titleEn}</small>}</span>
                  <em>{item.domain}</em>
                </button>
              ))}
              {searchResults.length === 0 && <p className="empty-result">没有找到匹配的知识。</p>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
