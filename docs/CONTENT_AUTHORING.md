# Knowledge OS 内容维护说明

Knowledge OS V1 使用 **Markdown / MDX 作为知识源**。首页、Drawer 与搜索索引都从 `content/` 自动读取，不再在 React 页面里维护知识正文。

## 目录

```text
content/
├── knowledge/
│   ├── strategy/
│   ├── gtm/
│   ├── growth/
│   ├── ai/
│   ├── data/
│   └── platform/
├── tools/
├── playbooks/
└── cases/
```

## 新增一张 Knowledge Card

在对应 Domain 下新建一个 `.mdx` 文件，例如：

```text
content/knowledge/growth/search-intent.mdx
```

推荐模板：

```md
---
id: search-intent
title: Search Intent
title_en: Search Intent
slug: search-intent
domain: growth
type: concept
tags:
  - SEO
aliases:
  - 搜索意图
summary: "一句话摘要"
related:
  - seo
playbooks: []
cases: []
sources: []
created_at: 2026-08-18
updated_at: 2026-08-18
---

## WHAT

它是什么。

## WHY

为什么重要。

## WHEN

- 什么时候使用。

## HOW

1. 第一步。
2. 第二步。

## DATA

- 需要的数据。

## TOOL

- 常用工具。

## OUTPUT

- 最终产出。

## PITFALLS

- 常见错误。
```

## Domain 值

V1 使用以下固定 key：

- `strategy`
- `gtm`
- `growth`
- `ai`
- `data`
- `platform`

## 自动读取规则

`lib/content.ts` 会在服务端：

1. 递归扫描 `content/knowledge/**/*.md` 与 `*.mdx`。
2. 读取 YAML frontmatter。
3. 提取 WHAT / WHY / WHEN / HOW / DATA / TOOL / OUTPUT / PITFALLS。
4. 根据 Domain 自动生成首页 Knowledge Landscape。
5. 把内容交给 Drawer 与搜索使用。

因此新增普通知识卡后，**不需要修改 `app/page.tsx`**。

## Related

`related` 请优先填写 Knowledge Card 的 `id`，例如：

```yaml
related:
  - seo
  - geo-ai-search
```

如果对应 id 已存在，Drawer 中会显示真实标题并可直接切换知识卡。

## 内容长度

V1 的目标不是保存完整长文，而是快速恢复知识：

- WHAT：尽量 1–2 段
- WHY：尽量 1 段
- HOW：3–7 步
- DATA / TOOL / OUTPUT：使用短列表
- 深度资料保留在 Sources 或未来的 Deep Dive 页面

## 修改知识

直接修改对应 `.mdx` 文件即可。GitHub / Vercel 重新构建后页面会自动使用最新内容。
