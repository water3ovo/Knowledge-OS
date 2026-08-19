"use client";

import { useMemo, useState } from "react";

type Tool = { name:string; category:string; access:string; url:string; summary:string; bestFor:string[]; alternatives?:string };

const tools: Tool[] = [
  {name:"Google Trends",category:"Market & Demand",access:"Free",url:"https://trends.google.com/trends/",summary:"看搜索兴趣随时间、地区和主题的变化，适合判断需求趋势与国家差异。",bestFor:["需求趋势","国家比较","上升主题"]},
  {name:"Google Keyword Planner",category:"Search",access:"Free",url:"https://ads.google.com/home/tools/keyword-planner/",summary:"Google Ads 官方关键词工具，用于关键词发现、近似搜索量与广告预测。",bestFor:["Keyword","Search Volume","CPC"]},
  {name:"Google Search Console",category:"Search",access:"Free",url:"https://search.google.com/search-console/",summary:"自有网站最重要的 Google 搜索一方数据：查询词、曝光、点击、CTR、页面表现。",bestFor:["Own SEO","Query","Indexing"]},
  {name:"Bing Webmaster Tools",category:"Search & GEO",access:"Free",url:"https://www.bing.com/webmasters/",summary:"Bing 官方站长平台，含搜索表现、关键词、Backlink、Site Scan 与 SEO/GEO 工具。",bestFor:["Bing SEO","GEO","Backlinks"]},
  {name:"Ahrefs Free",category:"SEO",access:"Free / Freemium",url:"https://ahrefs.com/free",summary:"免费 SEO 工具集合；对已验证站点还有 Site Explorer、Site Audit、Web Analytics 等免费能力。",bestFor:["SEO Audit","Backlink","AI Visibility"],alternatives:"Semrush free / Search Console"},
  {name:"Semrush Free Keyword Tool",category:"SEO",access:"Free limited",url:"https://www.semrush.com/analytics/keywordmagic/",summary:"Semrush 官方免费关键词入口，可快速看关键词建议、搜索量、难度、意图和 CPC。",bestFor:["Keyword Research","Intent","CPC"],alternatives:"Keyword Planner / Ahrefs Free"},
  {name:"Semrush",category:"SEO & Competitive Intelligence",access:"Paid / Trial",url:"https://www.semrush.com/",summary:"完整 SEO、竞品、Paid Search、Backlink、市场与 AI Visibility 数据平台；学习阶段不必购买完整套餐。",bestFor:["Competitor SEO","Keyword Gap","AI Visibility"],alternatives:"Ahrefs Free / Similarweb free / Google tools"},
  {name:"Similarweb Website Checker",category:"Competitive Intelligence",access:"Free limited",url:"https://www.similarweb.com/website/",summary:"公开网站流量与渠道估算，适合快速判断竞品规模、来源渠道和地域结构。",bestFor:["Website Traffic","Channel Mix","Competitor"]},
  {name:"Meta Ad Library",category:"Ads Intelligence",access:"Free",url:"https://www.facebook.com/ads/library/",summary:"搜索 Meta 平台当前正在运行的广告，研究竞品创意、Messaging 与投放节奏。",bestFor:["Meta Ads","Creative","Competitor"]},
  {name:"TikTok Creative Center",category:"Ads Intelligence",access:"Free",url:"https://ads.tiktok.com/business/creativecenter",summary:"TikTok 官方公开创意情报平台，可看 Top Ads、趋势、关键词和创意灵感。",bestFor:["TikTok Ads","Top Ads","Trends"]},
  {name:"Product Hunt",category:"Product & Launch",access:"Free",url:"https://www.producthunt.com/",summary:"观察新科技产品、Launch 表达、Early Adopter 反馈与产品趋势。",bestFor:["AI Products","Launch","Competitor Discovery"]},
  {name:"G2",category:"Voice of Customer",access:"Free browsing",url:"https://www.g2.com/",summary:"B2B 软件评论站，适合抽取用户真实使用场景、优缺点和替代品。",bestFor:["Reviews","Pain Points","Competitors"]},
  {name:"Reddit",category:"Voice of Customer",access:"Free",url:"https://www.reddit.com/",summary:"高价值真实讨论源，适合找用户痛点、购买理由、替代方案和原话。",bestFor:["User Research","Community","Pain Points"]},
  {name:"Hacker News",category:"Product & Tech",access:"Free",url:"https://news.ycombinator.com/",summary:"技术和创业社区，适合追踪开发者产品、AI 工具与早期市场反馈。",bestFor:["Developer Audience","AI Trends","Launch"]},
  {name:"GitHub",category:"Product & Tech",access:"Free / Freemium",url:"https://github.com/",summary:"通过 Star、Release、Issue、Commit 与生态项目观察开源产品和技术采用。",bestFor:["Open Source","Tech Trends","Competitor"]},
  {name:"Hugging Face",category:"AI",access:"Free / Freemium",url:"https://huggingface.co/",summary:"模型、数据集与 Demo 生态，用于理解 AI 能力供给与新模型趋势。",bestFor:["Models","Datasets","AI Trends"]},
  {name:"World Bank Data",category:"Macro & Market",access:"Free",url:"https://data.worldbank.org/",summary:"国家人口、经济、数字化等宏观指标，适合市场进入和国家比较。",bestFor:["Macro","Country Selection","Market Context"]},
  {name:"Eurostat",category:"Macro & Market",access:"Free",url:"https://ec.europa.eu/eurostat",summary:"欧盟官方统计数据，做欧洲国家市场分析时优先级很高。",bestFor:["EU Market","Demographics","Economy"]},
  {name:"UN Comtrade",category:"Trade Data",access:"Free",url:"https://comtradeplus.un.org/",summary:"联合国国际贸易数据库，适合研究国家间商品进出口规模与结构。",bestFor:["Trade","Category Size","Country"]},
  {name:"DataReportal",category:"Digital Market",access:"Free",url:"https://datareportal.com/",summary:"国家级互联网、社媒与数字行为报告，适合海外数字市场快速扫描。",bestFor:["Digital Adoption","Social Media","Country"]},
  {name:"StatCounter",category:"Digital Market",access:"Free",url:"https://gs.statcounter.com/",summary:"浏览器、操作系统、搜索引擎、设备等市场份额趋势。",bestFor:["Device","Browser","Search Share"]},
  {name:"Wappalyzer",category:"Tech Intelligence",access:"Freemium",url:"https://www.wappalyzer.com/",summary:"识别网站技术栈与第三方服务，用于竞品技术与增长基础设施研究。",bestFor:["Tech Stack","Website","Competitor"]},
  {name:"BuiltWith",category:"Tech Intelligence",access:"Freemium",url:"https://builtwith.com/",summary:"网站技术识别与技术使用趋势，适合补充竞品技术栈判断。",bestFor:["Tech Stack","Market Tech","Competitor"]},
  {name:"Sensor Tower",category:"App Intelligence",access:"Paid",url:"https://sensortower.com/",summary:"移动应用市场与竞品情报平台，数据强但价格高；学习阶段先了解能力，不作为日常必需工具。",bestFor:["App Downloads","App Competitor","Market Share"],alternatives:"App Store/Google Play reviews + public rankings"}
];

export default function ToolsBrowser(){
  const [q,setQ]=useState(""); const [category,setCategory]=useState("all");
  const categories=useMemo(()=>Array.from(new Set(tools.map(x=>x.category))).sort(),[]);
  const filtered=useMemo(()=>tools.filter(x=>(category==="all"||x.category===category)&&(!q||[x.name,x.summary,x.category,...x.bestFor].join(" ").toLowerCase().includes(q.toLowerCase()))),[q,category]);
  return <>
    <div className="library-search-row"><label className="library-search"><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="搜索工具 / 数据源 / 用途…"/></label><span className="result-count">{filtered.length} resources</span></div>
    <div className="filter-row"><button className={category==="all"?"active":""} onClick={()=>setCategory("all")}>ALL</button>{categories.map(x=><button key={x} className={category===x?"active":""} onClick={()=>setCategory(x)}>{x}</button>)}</div>
    <div className="tool-grid">{filtered.map(item=><article className="tool-card" key={item.name}><div className="tool-card-top"><span className="tool-category">{item.category}</span><span className="access-badge">{item.access}</span></div><h2>{item.name}</h2><p>{item.summary}</p><div className="mini-list">{item.bestFor.map(x=><span key={x}>{x}</span>)}</div><div className="tool-card-footer"><a href={item.url} target="_blank" rel="noreferrer">Open official ↗</a>{item.alternatives&&<small>Alternative: {item.alternatives}</small>}</div></article>)}</div>
  </>;
}
