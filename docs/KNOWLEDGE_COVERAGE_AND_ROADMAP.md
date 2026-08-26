# Knowledge OS — Coverage & Roadmap

Updated: 2026-08-26

## 1. Product maturity definition

Knowledge OS is considered **stable for daily use** only when all of the following are true:

1. Overview, Knowledge, Playbooks, Tools & Data, Cases and Map are usable.
2. The major learning domains discussed with ChatGPT have broad concept coverage.
3. High-priority concepts have detailed MDX cards; long-tail concepts at least have a concise indexed card.
4. Tools & Data contains real official links and clearly marks Free / Freemium / Paid.
5. New knowledge can be added without editing React UI code.
6. Desktop and mobile can both browse and retrieve knowledge.
7. Professional learning can be captured into the knowledge asset without manual copy/paste note-taking.
8. Sources, learning process and canonical knowledge are separated so the system can evolve without becoming a transcript archive.
9. Knowledge health, provenance and taxonomy changes are auditable through Git.

## 2. Current stage

- Phase 0 — Information architecture & visual direction: DONE
- Phase 1 — Overview visual shell & Drawer: DONE
- Phase 2 — MDX content system: DONE
- Phase 2.1 — Mobile reading mode: DONE
- Phase 3 — Multi-page retrieval experience: DONE (first usable version)
- Phase 4 — Knowledge breadth baseline: DONE (137+ concept baseline; depth remains iterative)
- Phase 4.1 — Real-use review & priority deepening: CONTINUOUS
- **Phase 5.1 — Knowledge Vault & Curator Architecture: CURRENT**
- Phase 5.2 — Obsidian-compatible local Vault: NEXT
- Phase 5.3 — Curator write path: NEXT
- Phase 5.4 — Taxonomy & relationship maintenance: PLANNED
- Phase 5.5 — Default conversation curation workflow: PLANNED
- Phase 5.6 — External capture: PLANNED
- Phase 5.7 — Hybrid retrieval: LATER
- Phase 5.8 — Learning UI (Insights / Questions / Sources): LATER

## 3. Knowledge asset architecture

The system now uses three conceptual layers:

### Sources
Evidence and provenance: chats, web pages, PDFs, screenshots, reports, transcripts and notes.

Location: `content/sources/`

### Learning
Process memory: questions, corrections, personal insights, unresolved questions and knowledge deltas from meaningful learning episodes.

Location: `content/learning/`

### Canonical Knowledge
The current best reusable representation of concepts.

Location: `content/knowledge/`

Supporting layers:

- `content/inbox/`
- `content/playbooks/`
- `content/cases/`
- `content/tools/`
- `content/meta/`
- `content/archive/`

The source of truth remains portable Markdown/YAML in Git. Obsidian and Knowledge OS are different views of the same asset.

## 4. Layered canonical content strategy

### Detailed layer — MDX
Use individual MDX files for concepts that have been discussed deeply or are frequently used. These cards contain WHAT / WHY / WHEN / HOW / DATA / TOOL / OUTPUT / PITFALLS / SOURCES.

Examples: DSTE, BLM, Three Gaps, GSA, SEO, GEO / AI Search, Semrush, Amazon Distribution, Black-box System Identification, Causal Inference.

### Broad index layer — Seed JSON
Use compact structured seed cards to ensure broad coverage. They are searchable and have full detail pages, but are intentionally concise. When a topic becomes important, replace/deepen it with an MDX file using the same ID; MDX automatically overrides the seed card.

This prevents the knowledge base from being either:
- very deep but missing most topics, or
- very broad but full of long AI-generated articles.

## 5. Coverage domains

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

## 6. Tools & Data coverage

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

## 7. Initial Playbooks

- AI 产品进入新市场
- Amazon 流量下降诊断
- AI 产品竞品增长拆解
- SEO Keyword Opportunity
- Growth Funnel Diagnosis
- AI 产品 Launch

## 8. Initial Cases

- Amazon Traffic Intelligence
- AI Product US GTM
- SEO / GEO Experiment
- Growth Intelligence Agent

## 9. Current Phase 5.1 acceptance criteria

Phase 5.1 is complete when:

1. Source / Learning / Canonical layers exist without breaking the current website.
2. Curator operations and contradiction rules are documented.
3. Codex has repository-level instructions and discoverable Agent Skills.
4. A taxonomy baseline exists as machine-readable metadata.
5. A vault health check is available and runs in CI.
6. At least one real Learning Episode and Source are stored using the new model.

After that, Phase 5.2 requires local Obsidian/Codex work: opening `content/` as an Obsidian Vault and validating the local workflow.
