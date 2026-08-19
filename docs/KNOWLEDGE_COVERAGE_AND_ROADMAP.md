# Knowledge OS — Coverage & Roadmap

Updated: 2026-08-19

## 1. Product maturity definition

Knowledge OS is considered **stable for daily use** only when all of the following are true:

1. Overview, Knowledge, Playbooks, Tools & Data, Cases and Map are usable.
2. The major learning domains discussed with ChatGPT have broad concept coverage.
3. High-priority concepts have detailed MDX cards; long-tail concepts at least have a concise indexed card.
4. Tools & Data contains real official links and clearly marks Free / Freemium / Paid.
5. New knowledge can be added without editing React UI code.
6. Desktop and mobile can both browse and retrieve knowledge.
7. After reaching this stage, normal work changes to: **discussion → update/add knowledge → optional small feature iteration**.

## 2. Current stage

- Phase 0 — Information architecture & visual direction: DONE
- Phase 1 — Overview visual shell & Drawer: DONE
- Phase 2 — MDX content system: DONE
- Phase 2.1 — Mobile reading mode: DONE
- Phase 3 — Multi-page retrieval experience: DONE (first usable version)
- Phase 4 — Knowledge breadth baseline: DONE (137+ concept baseline; depth remains iterative)
- Phase 4.1 — Real-use review & priority deepening: CURRENT
- Phase 5 — Stable daily-use & continuous maintenance: NEXT TARGET

## 3. Layered content strategy

### Detailed layer — MDX
Use individual MDX files for concepts that have been discussed deeply or are frequently used. These cards contain WHAT / WHY / WHEN / HOW / DATA / TOOL / OUTPUT / PITFALLS / SOURCES.

Examples: DSTE, BLM, Three Gaps, GSA, SEO, GEO / AI Search, Semrush, Amazon Distribution, Black-box System Identification, Causal Inference.

### Broad index layer — Seed JSON
Use compact structured seed cards to ensure broad coverage. They are searchable and have full detail pages, but are intentionally concise. When a topic becomes important, replace/deepen it with an MDX file using the same ID; MDX automatically overrides the seed card.

This prevents the knowledge base from being either:
- very deep but missing most topics, or
- very broad but full of long AI-generated articles.

## 4. Coverage domains

### Strategy / Business / Strategic Operations
DSTE, SP, BP, BLM, BEM, Three Gaps, Five Looks & Three Decisions, GSA, Strategy Map, BSC, CSF, KSF, KPI, CTQ, TOPN, Budget, Forecast, Business Review, PMO, PESTEL, Porter Five Forces, SWOT/TOWS, VRIO, Value Chain, Business Design, Ansoff, Three Horizons, BCG, GE/McKinsey, business portfolio, financial statements, P&L, ROI/ROIC, organization design, talent strategy, performance management, RACI, milestones, risk/dependency management, MECE/Issue Tree, Pyramid/SCQA, Scenario Planning, AAR/PDCA.

### Global GTM
Market Intelligence, TAM/SAM/SOM, Country Selection, ICP, Persona, JTBD, Positioning, Messaging, Pricing, Localization, Channel Strategy, Launch, Product Hunt, Content Growth, Community Growth, Affiliate/Referral, Influencer/KOL, Product Marketing, Developer Marketing, Global GTM, Go/No-Go.

### Growth
SEO, Keyword Research, Search Intent, SERP, On-page SEO, Technical SEO, Backlinks, Programmatic SEO, GEO/AI Search, SEM, Google Ads, Paid Social, Meta Ads, TikTok Ads, YouTube Growth, PLG, AARRR, Activation, Aha Moment, Onboarding, Retention, Referral, Churn.

### AI Product
LLM, Agent, RAG, MCP, Workflow, API, Token, Context Window, Embedding, Vector Database, Tool Calling, Multimodal AI, Prompt Engineering, Evals, Agentic Workflow.

### Data / Growth Analytics
Funnel, Cohort, Retention Analysis, CAC/LTV, ARPU, MRR/ARR, Unit Economics, GA4, SQL, Dashboard, Attribution, Experiment, A/B Test, Causal Inference, Incrementality, Difference-in-Differences, Regression, Panel Data, Response Curve, Sensitivity Analysis.

### Platform Growth
Black-box System Identification, Traffic Allocation, Recommendation, Ranking, Advertising Auction, Amazon Distribution, SQP, SCP, SIS, Placement, Organic Rank, Google Search, TikTok Distribution, Meta, App Store.

## 5. Tools & Data coverage

The practical catalog prioritizes legal, official and low-cost sources:

- Google Trends
- Google Keyword Planner
- Google Search Console
- Bing Webmaster Tools
- Ahrefs Free
- Semrush Free Keyword Tool
- Semrush (paid, optional)
- Similarweb Website Checker
- Meta Ad Library
- TikTok Creative Center
- Product Hunt
- G2
- Reddit
- Hacker News
- GitHub
- Hugging Face
- World Bank Data
- Eurostat
- UN Comtrade
- DataReportal
- StatCounter
- Wappalyzer
- BuiltWith
- Sensor Tower (paid, optional)

Paid tools should not be treated as required learning prerequisites. Unauthorized cracked/shared-account links are not part of the knowledge base.

## 6. Initial Playbooks

- AI 产品进入新市场
- Amazon 流量下降诊断
- AI 产品竞品增长拆解
- SEO Keyword Opportunity
- Growth Funnel Diagnosis
- AI 产品 Launch

## 7. Initial Cases

- Amazon Traffic Intelligence
- AI Product US GTM
- SEO / GEO Experiment
- Growth Intelligence Agent

## 8. Remaining work before Phase 5

1. Review the merged multi-page experience on desktop and mobile in real use.
2. Deepen highest-value seed cards based on real learning/discussion rather than generating long articles in bulk.
3. Add user-specific cases and playbooks as they are actually used.
4. Keep improving link integrity, sources and tool usefulness based on actual usage.
5. Use the recurring maintenance rule: after a substantive learning conversation, update existing cards first; create a new card only when the concept is genuinely new.
