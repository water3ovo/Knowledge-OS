# Knowledge OS V1 开发规格说明

**版本：V1.0**  
**阶段：Prototype / Personal Use**  
**核心目标：学习汇总 + 快速检索 + 知识关联**

## 1. 产品定位

Knowledge OS 是一个面向个人长期使用的知识学习、整理、浏览与检索系统。

它不是传统博客，不是 Notion 式文档库，也不是 SaaS 管理后台。

V1 首先解决一个非常具体的问题：

> ChatGPT 对话、网页、学习资料里积累了大量知识，但聊天记录和长文档不适合快速回顾。需要把知识压缩成结构化、可浏览、可检索、有关联的知识卡片。

因此 V1 只关注四件事：

- **看得全**：打开首页即可快速恢复整个知识体系。
- **找得快**：知道关键词时能够快速定位知识。
- **读得快**：知识默认以摘要和卡片形式呈现，而不是长文章。
- **连得起来**：知道一个概念和哪些知识、工具、案例、Playbook 有关系。

## 2. V1 核心设计原则

### 2.1 产品概念

采用：

**C 的页面骨架 + A 的字体、留白与编辑感 + B 的搜索、轻导航和 Drawer 产品交互**

最终设计关键词：

**Editorial × Product × Personal × Dense × Calm**

即：

- 编辑感，而非模板感。
- 工具感，而非后台感。
- 个人感，而非企业知识库。
- 高信息密度，但不拥挤。
- 克制、安静、长期耐看。

## 3. V1 明确不是什么

### 不做传统 Dashboard Admin

避免：

- 深色固定侧边栏
- 满屏 KPI
- 满屏圆角 Card
- 企业后台式图标菜单

### 不做传统 Digital Garden Blog

避免：

- 首页文章列表
- 巨量长文章
- 时间线式博客

### 不做传统 Notion Wiki

避免：

- 目录 → Page → 子 Page → 长文档

Knowledge OS 的主要交互单位应当是：

> **Concept / Knowledge Card**

而不是 Document。

## 4. V1 一级信息架构

顶部主导航固定为：

- **Overview**：首页 / 当前研究 / Knowledge Landscape
- **Knowledge**：完整知识库浏览与检索
- **Playbooks**：将知识转化为实际工作步骤
- **Tools & Data**：工具库和数据源
- **Cases**：真实案例、实验与作品
- **Map**：知识关系探索

其中 Map V1 可以仅保留入口，不要求完整实现。

## 5. Overview 首页

Overview 是整个 V1 最重要的页面。

它承担的不是“统计 Dashboard”，而是：

> **一眼恢复我当前在研究什么，以及我的整个知识结构。**

桌面端采用三层布局：

**Top Navigation → Current Research + Knowledge Landscape → Active Shelf / Recently Viewed**

当知识详情打开时：

**Right Drawer 覆盖页面右侧。**

## 6. Top Navigation

顶部导航视觉必须轻。

推荐结构：

`KNOWLEDGE / OS`

`Overview  Knowledge  Playbooks  Tools & Data  Cases  Map`

右侧：

`Search ⌘K`

可选：

- 主题切换
- 个人头像 / Personal 标识

导航禁止：

- 固定深色 Sidebar
- 大量图标
- 按钮式导航堆叠

导航更接近：

**编辑网站的章节目录**

而不是：

**SaaS 后台菜单。**

当前页面使用非常轻的下划线 / 小色点 / 字重表示 Active 状态。

## 7. Current Research 左侧区域

首页左侧是整个产品“个人感”的主要来源。

### 正在研究

例如：

**平台流量分发**

`Platform Distribution`

描述：

> 不是平台方时，如何系统性观察与推断不同平台的流量分发机制与偏好？

### Topic Tags

例如：

`Black-box System` `Distribution` `Experiment` `Causal Inference`

标签只用于快速识别。视觉轻量，不使用饱和色大标签。

### 当前问题

例如：

**我们不是平台方，怎么观测算法机制？**

`Amazon → Google → TikTok`

Current Question 应当具备明显的编辑层级，与普通 Knowledge Card 区分。

### Connecting

显示与当前问题正在连接的知识：

- 黑箱系统识别
- 广告拍卖机制
- 自然排名机制
- Response Curve
- 因果推断

这些内容点击后可以打开对应知识 Drawer。

## 8. Knowledge Landscape

这是首页最核心的信息区域。

V1 固定六个一级 Domain：

### 01 Strategy

- DSTE
- BLM
- 三差分析
- GSA
- 五看三定

### 02 Global GTM

- Market Intelligence
- ICP / JTBD
- Positioning
- Pricing
- Launch

### 03 Growth

- SEO
- GEO / AI Search
- PLG
- AARRR
- Retention

### 04 AI Product

- LLM
- Agent
- RAG
- MCP
- Workflow

### 05 Data

- Funnel
- Cohort
- CAC / LTV
- Experiment
- Causal Inference

### 06 Platform

- Amazon
- Google
- TikTok
- Meta
- App Store

### 展示原则

每个 Domain 显示：

- 编号
- Domain Name
- 知识数量
- 前 5 个核心 Knowledge
- 详情入口

不要把每一个知识点做成独立大卡片。

主要依靠：Typography、Spacing、Divider、Column、Number 建立信息结构。

## 9. Knowledge Card Drawer

点击任何 Knowledge Concept：

不离开当前页面。

从右侧打开：

**Knowledge Detail Drawer**

Drawer 是 V1 最重要的产品交互之一。

目标：

> 用户仍然保留对整个 Knowledge Landscape 的空间记忆，同时查看一个知识的具体信息。

## 10. Knowledge Drawer 内容模板

所有 Knowledge Card 强制使用相同结构。

### Header

- 中文名称
- English Name
- Category
- Tags

### WHAT

一句话解释：**它是什么？**

原则：3–5 行以内解决。

### WHY

回答：**为什么值得学习？**

说明它解决的问题，而不是重复定义。

### WHEN

回答：**什么时候使用？**

属于可选模块。

### HOW

实际使用框架。

优先使用步骤、流程、公式、判断逻辑，而非长篇解释。

### DATA

需要什么数据。

例如三差分析：

- 内部经营数据
- 市场规模
- 竞争数据
- Benchmark

### TOOL

常用工具，例如：

- Semrush
- Similarweb
- GA4
- SQL

### OUTPUT

使用这个方法最终应得到什么。

### RELATED

关联 Knowledge。

点击 Related：当前 Drawer 内容切换至对应知识，不要求关闭 Drawer。

### LINKS & CASES

关联：

- Playbook
- Case
- Tool
- 外部 Source

### Deep Dive

V1 默认不展示长内容。

如果未来某知识确实需要详细内容，底部提供：

**Deep Dive →**

进入完整 Knowledge 页面。

## 11. Knowledge Card 内容长度原则

默认 Drawer 应当：

**一屏能够阅读 60%–80% 的核心内容。**

禁止一张卡片出现几千字。

理想目标：

- WHAT：50–120 字
- WHY：50–150 字
- HOW：3–7 步
- RELATED：3–8 个
- DATA：3–8 项
- TOOL：0–6 个

一个 Knowledge Card 的核心信息尽量控制在：

**300–800 字以内。**

## 12. Active Shelf

Knowledge Landscape 下方加入：

**ACTIVE SHELF**

V1 分三列：

### Playbook

例如：AI 产品进入新市场

### Tool

例如：Semrush

### Case

例如：Amazon Traffic Intelligence

每列：首页只显示一个主要项目。

下面可以显示：更新时间、分类、一句话信息、箭头入口。

Active Shelf 的目标不是收藏夹，而是：

> 当前最值得反复调用的知识资产。

## 13. Recently Viewed

首页下方保留：

**RECENTLY VIEWED**

以轻量 Chip / Text Button 形式展示：

- 三差分析
- Amazon 流量下降诊断
- 黑箱系统识别
- Response Curve
- Google 排名机制

V1 可以先使用 LocalStorage 存储浏览记录，不需要数据库。

点击即可重新打开 Drawer。

## 14. 全局搜索

V1 搜索属于核心功能。

入口：顶部 `Search ⌘K`

点击或键盘 `⌘K / Ctrl + K` 打开：

**Command Palette**

## 15. Search V1 搜索范围

搜索：

- Knowledge Title
- English Title
- Alias
- Tags
- Category
- WHAT
- Related
- Tool
- Playbook
- Case

V1 暂时不需要：

- Embedding
- Semantic Search
- Vector Database
- RAG

先做可靠的：

**全文关键词搜索。**

后续再升级 AI Search。

## 16. Search Result 结构

搜索：`流量`

展示：

### Knowledge

- Amazon 流量分发
- Platform Distribution
- Traffic Allocation

### Playbooks

- Amazon 流量下降诊断

### Cases

- Amazon Traffic Intelligence

### Tools

- Similarweb

不同内容类型必须明确区分。

搜索结果点击 Knowledge：关闭 Search，打开当前页面上的 Drawer。

## 17. Knowledge 页面

Overview 只显示精选知识。

Knowledge 页面显示：

**全部 Knowledge。**

页面结构：

顶部：Knowledge / 搜索 / Domain Filter / Tag Filter

主体：Domain 分组 → Knowledge List

视觉仍然以 Typography + List + Grid 为主。

不要变成大量 Card Grid。

## 18. Knowledge 页面 Filter

V1 支持：

- All
- Strategy
- Global GTM
- Growth
- AI Product
- Data
- Platform

后期才考虑：

- 熟练度
- 学习状态
- 来源
- 更新时间
- Priority

因此 V1 不要出现：

- 熟练
- 进行中
- 入门
- 未学习

这部分延后到 V2。

## 19. Playbook 页面

Knowledge 解决：

> **这是什么？**

Playbook 解决：

> **碰到这个问题到底怎么做？**

例如：

**AI 产品进入新国家**

Market Demand → Customer → Competition → Positioning → GTM Channel → Unit Economics → Go / No Go

每一个 Step 点击后可以打开对应 Knowledge Drawer。

## 20. V1 第一批 Playbook

建议仅建立：

- AI 产品进入新市场
- AI 产品竞品增长拆解
- Amazon 流量下降诊断
- SEO Keyword Opportunity

后续逐步添加。

## 21. Tools & Data 页面

页面顶部：

`TOOLS | DATA SOURCES`

两个视图。

## 22. Tool 数据结构

Tool 不是百科。

每个 Tool 回答：

- 它解决什么问题
- 什么时候用
- 核心能力
- 输入什么
- 输出什么
- Free / Paid
- 免费替代
- Related Playbook
- Related Knowledge
- 官方网站

例如：

**Semrush**

Category：SEO / Competitive Intelligence

Use For：

- Keyword Research
- Competitor SEO
- Backlink
- Traffic Intelligence
- AI Visibility

## 23. Data Source 页面

按照：

> **“我想知道什么？”**

组织，而不是按照网站名字组织。

### Market Size

- World Bank
- Eurostat
- UN Comtrade
- Industry Reports

### Search Demand

- Google Trends
- Keyword Planner
- Semrush

### Competitor Traffic

- Similarweb
- Semrush

### User Voice

- Reddit
- G2
- YouTube
- App Store

### Competitor Ads

- Meta Ad Library
- TikTok Creative Center

### Amazon

- SQP
- SCP
- SIS
- Ads Reports

## 24. Cases 页面

Case 用于证明：

> **这个知识不是“我看过”，而是“我真的应用过”。**

V1 第一批 Case：

- Amazon Traffic Intelligence
- AI Product US GTM
- SEO / GEO Experiment
- Growth Intelligence Agent

Case 页面可以比 Knowledge Card 更长。

结构：

Problem → Context → Data → Framework → Analysis → Decision → Result → Learning → Related Knowledge

## 25. Map 页面

V1：保留导航入口。

可以只实现简单的 Related Concept 网络。

暂不要求完整 Knowledge Graph。

重要原则：

> **Graph 是知识关系的辅助视图，不是主导航。**

后续再考虑 Graphology、Sigma.js、React Flow、Embedding Relationship、Semantic Linking。

## 26. V1 Knowledge 数据 Schema

每个 Knowledge 建议使用以下字段：

```yaml
id:
title:
title_en:
slug:

domain:
type:
tags:
aliases:

summary:
what:
why:
when:

how:
data:
tools:
output:
pitfalls:

related:
playbooks:
cases:

sources:

created_at:
updated_at:
```

V1 不加入：

- mastery
- progress
- status
- score
- study_count
- learning_level

这些字段留到 V2。

## 27. 内容存储方案

V1 推荐：

**Markdown / MDX First**

目录：

```text
/content

  /knowledge
    /strategy
    /gtm
    /growth
    /ai
    /data
    /platform

  /playbooks

  /tools

  /data-sources

  /cases
```

每一个 Concept：一个 Markdown / MDX 文件。

例如：

```text
/content/knowledge/strategy/dste.mdx
/content/knowledge/strategy/three-gaps.mdx
/content/knowledge/growth/seo.mdx
/content/tools/semrush.mdx
```

## 28. 为什么 V1 不使用数据库

当前网站主要由一个人使用。

内容规模：几十到几百条。

并且主要是读取、检索、关联、展示。

因此 V1 使用 Markdown 有明显优势：

- Git 可追踪
- Codex 可直接编辑
- ChatGPT 可生成
- 内容易迁移
- 没有数据库维护成本

未来仍可导入 Supabase。

数据库升级应由真实需求触发，而不是提前建设。

## 29. 推荐技术栈

V1 推荐：

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui / Radix Primitives
- MDX

可选：Fuse.js 用于前端快速搜索。

可选：Contentlayer / Velite / 自定义 MDX Loader 负责内容索引。

## 30. UI 组件清单

V1 开发组件建议：

```text
AppHeader
TopNavigation
CommandSearch
CurrentResearch
CurrentQuestion
ConnectingConcepts
KnowledgeLandscape
KnowledgeDomain
KnowledgeConceptRow
KnowledgeDrawer
KnowledgeTags
RelatedConcepts
ActiveShelf
ShelfItem
RecentlyViewed
PlaybookPreview
ToolPreview
CasePreview
FilterTabs
```

避免过度组件化。

## 31. Drawer 交互规则

Desktop：宽度约 **340–420 px**，或者页面宽度约 **24%–28%**。

Drawer 出现：主页面保持可见。

背景：不使用重型黑色 Overlay，仅轻微缩暗或无遮罩。

点击 X、Esc、重新点击知识均可关闭 / 切换。

## 32. Responsive 优先级

V1：**Desktop First。**

设计目标：1440px / 1600px / 1920px。

因为 Knowledge OS 的核心价值：

> 一屏显示大量知识结构。

Tablet：基本可用即可。

Mobile：V1 不重点优化。

移动端未来可以变成：搜索 + Knowledge 阅读器，不需要复刻桌面大屏。

## 33. Typography 原则

视觉层级主要依靠字体。

建议：

- 英文 UI：现代 Sans Serif
- 大标题 / 研究标题：可以适度使用 Serif
- 中文：保持清晰、克制

建议层级：

- Hero / Research Question：32–48px
- Knowledge Domain：18–24px
- Knowledge Concept：14–16px
- Metadata：11–13px
- Body：14–16px

避免满屏 Bold。只有真正需要层级的位置加粗。

## 34. Color 原则

整体：暖白 / 米白 / 极浅灰。

- 主文字：深灰黑，而非纯黑
- 辅助文字：暖灰
- Divider：极浅灰
- Accent：只使用一种低饱和强调色，例如砖红 / 暖橙红

禁止：

- AI 紫色渐变
- 蓝紫霓虹
- 大量彩色卡片
- 高饱和状态色

## 35. Card 原则

不是所有内容都应该 Card 化。

优先：文字、Divider、Column、Whitespace。

只在以下情况使用 Card：

- Current Question
- Case
- Playbook
- Tool Preview
- 需要明显区分的特殊模块

Knowledge Landscape 本身尽量不要大面积 Card。

## 36. Motion 原则

V1 只保留必要动效：

- Drawer Slide
- Search Fade
- Hover Highlight
- Tag Hover
- Navigation Underline

动画：150–250ms。

禁止：

- Parallax
- 复杂 Three.js
- 背景粒子
- 大量 Loading 动画
- 花哨页面切换

## 37. 首页 V1 首批真实内容

第一版必须直接放真实知识，不使用 Lorem Ipsum / Fake Dashboard Data / Random Metrics。

建议第一批 30 个 Knowledge：

### Strategy

- DSTE
- BLM
- 三差分析
- GSA
- 五看三定

### Global GTM

- Market Intelligence
- ICP
- JTBD
- Positioning
- Pricing

### Growth

- SEO
- GEO / AI Search
- PLG
- AARRR
- Retention

### AI Product

- LLM
- Agent
- RAG
- MCP
- Workflow

### Data

- Funnel
- Cohort
- CAC / LTV
- Experiment
- Causal Inference

### Platform

- Amazon Distribution
- Google Search
- TikTok Distribution
- Meta Ads Auction
- App Store Distribution

## 38. 首页 Current Research V1

首版直接使用当前真实研究主题：

### 当前研究

**平台流量分发**

Platform Distribution

描述：

> 不是平台方时，如何系统性地观察与推断不同平台的流量分发机制与偏好？

Tags：

- Black-box System
- Distribution
- Experiment
- Causal Inference

### 当前问题

**我们不是平台方，怎么观测算法机制？**

`Amazon → Google → TikTok`

### Connecting

- 黑箱系统识别
- 广告拍卖机制
- 自然排名机制
- Response Curve
- 因果推断

## 39. V1 首屏验收标准

打开网站 5 秒以内，用户应当能够回答：

- 我现在主要在研究什么？
- 整个知识体系包含哪些方向？
- 最近最重要的 Playbook / Tool / Case 是什么？

点击任意知识后 2 秒以内：

- 能理解这个知识大概是什么。

按下 `Ctrl/Cmd + K`：

能快速搜索到：DSTE、Semrush、Amazon 流量分发、SEO。

## 40. V1 产品成功标准

V1 成功不以功能数量、页面数量、数据库复杂度判断。

唯一核心判断：

> **它是否比重新翻 ChatGPT 聊天记录和长文档，更快地让我找到、恢复和调用知识？**

如果答案是 Yes，V1 成立。

## 41. V1 开发阶段

### Phase 1 — Visual Shell

完成：

- Global layout
- Header
- Current Research
- Knowledge Landscape
- Drawer
- Active Shelf
- Recently Viewed

使用静态数据。

目标：**先做到和基准原型视觉接近。**

### Phase 2 — Content System

加入：

- Markdown / MDX
- Schema
- Content Loader
- 真实 Knowledge
- 自动构建 Domain

### Phase 3 — Search

完成：

- ⌘K
- Knowledge Search
- Tool / Playbook / Case Search

### Phase 4 — Secondary Pages

完成：

- Knowledge
- Playbooks
- Tools & Data
- Cases
- Map Placeholder

### Phase 5 — Polish

完成：

- Responsive
- Hover
- Transition
- Typography
- Spacing
- Recently Viewed
- URL State
- Deep Linking

## 42. V1 明确延期至 V2

V2 再考虑：

- 熟练度
- 学习状态
- Learning Path 自动化
- 知识掌握度
- AI Semantic Search
- RAG
- Ask Knowledge
- 自动提取 ChatGPT 对话
- 自动分类
- 知识推荐
- Semantic Graph
- 知识重复检测
- Source Quality
- 学习计划
- Supabase
- 账号登录
- 跨设备编辑

这些功能现在都不得阻塞 V1。

## 43. Codex 开发原则

后续所有 Codex 开发必须遵守：

**视觉参考以已确认的 Knowledge OS 原型图为最高优先级。**

不要擅自改为：

- 标准 SaaS Dashboard
- Admin Template
- Notion Clone
- Obsidian Clone
- 紫蓝 AI Dashboard
- Dark Cyber UI

不要未经确认增加：

- Dashboard KPI
- 复杂 Analytics
- 学习进度
- 大型 Graph
- 重型 Sidebar
- 数据库

每次开发应遵循：

**先还原视觉 → 再保证交互 → 再接真实内容 → 最后增加功能。**

不得反过来。

## 44. V1 核心一句话

> **Knowledge OS V1 是一个高信息密度、编辑化、个人化的知识学习与检索界面：通过 Knowledge Landscape 看全局，通过 Search 找知识，通过 Drawer 快速理解，通过 Playbook / Tool / Case 把知识连接到真实实践。**
