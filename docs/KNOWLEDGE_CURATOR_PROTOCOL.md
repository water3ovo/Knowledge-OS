# Knowledge Curator Protocol

Updated: 2026-08-27

This document defines how an AI agent should convert learning conversations and external material into a maintainable long-term knowledge base.

## 1. Default behavior

For substantive professional learning, do not ask the user to manually summarize or classify the conversation.

At an appropriate episode boundary:

1. identify the topic(s),
2. retrieve related existing knowledge,
3. compare new information with the current canonical state,
4. decide the minimum required Knowledge Delta,
5. preserve provenance,
6. update only what materially changed.

Do not create a new canonical note merely because a conversation was long.

---

## 2. Required operation decision

For every candidate insight, choose one operation:

### NO_CHANGE
Use when the existing canonical knowledge already covers the durable learning.

### SOURCE
Use when material is worth preserving as provenance, but should not change canonical knowledge yet.

### UPDATE
Use when an existing concept should become more accurate, useful, connected or actionable.

### CREATE
Use only when the concept is truly distinct and durable.

A new term is not automatically a new concept.

### LINK
Use when the main change is a relationship between existing concepts.

### MERGE
Use when multiple notes represent the same conceptual object.

### INSIGHT
Use for the user's hypothesis, interpretation, analogy, strategic judgement or emerging mental model.

Never present this as established fact unless evidence later supports that promotion.

### QUESTION
Use for a meaningful unresolved question that could guide future learning or research.

### SUPERSEDE
Use when a previous belief, claim or framework is materially replaced by newer evidence or understanding.

### TAXONOMY_CHANGE
Use when navigation/category structure no longer represents the knowledge well.

---

## 3. Retrieval-before-write rule

Before CREATE, search existing:

- title
- aliases
- tags
- related concepts
- semantic equivalents

Prefer UPDATE or MERGE when possible.

This is the primary anti-duplication rule.

---

## 4. Source handling

A Source record should preserve enough provenance to revisit the evidence without reproducing unnecessary full copyrighted content.

Recommended frontmatter:

```yaml
id: source-YYYYMMDD-slug
type: source
source_type: chat | web | pdf | screenshot | video | report | note
title: ...
captured_at: YYYY-MM-DD
url: ...
file_ref: ...
topics: []
reliability: primary | secondary | community | unknown
status: active
related: []
```

Recommended body can be Chinese-first for human reading:

```markdown
## 为什么保存它
## 关键结论 / 证据
## 局限
## 可能影响哪些知识
```

---

## 5. Learning Episode handling

Recommended frontmatter:

```yaml
id: learning-YYYYMMDD-slug
type: learning
title: ...
started_at: YYYY-MM-DD
status: settled | active
topics: []
source_ids: []
knowledge_ids: []
open_questions: []
```

`open_questions` is a compact dashboard field. Keep the full context in the note body, but mirror durable unresolved questions here so the Obsidian cockpit can surface them automatically.

Recommended body:

```markdown
## 我在解决什么问题
## 原来的理解
## 这次真正搞懂了什么
## 我的理解 / 类比
## 被纠正的地方
## 还没解决的问题
## 对知识库产生了什么变化
```

Learning files are process memory. They should not replace canonical notes.

---

## 6. Canonical knowledge handling

Canonical notes represent the current best reusable understanding.

They should not read like chat transcripts, database rows or dated journals. Human-facing notes should progressively prefer readable Chinese-first section headings while keeping genuine professional terms in their standard form.

Preferred sections where relevant:

- 一句话理解
- 它是什么
- 为什么重要
- 什么时候会用到
- 怎么理解 / 怎么做
- 一个例子
- 关键数据 / 判断信号
- 常见误区
- 我的理解
- 还没解决的问题
- 相关知识
- 来源

### 我的理解
Only user-specific hypotheses, analogies or mental models. Keep them clearly separated from established facts.

### 还没解决的问题
Questions worth revisiting. Remove or migrate when resolved.

### 来源
Prefer stable source IDs / links. Do not create a citation list that cannot be traced.

---

## 7. Claim status and confidence

When a claim is contested, changing or inferential, record its epistemic status explicitly.

Suggested inline convention when needed:

```markdown
- **Established:** ...
- **Source claim:** ...
- **Inference:** ...
- **My insight:** ...
- **Uncertain:** ...
```

Do not assign fake numerical confidence percentages.

---

## 8. Contradiction protocol

When new material conflicts with canonical knowledge:

1. do not overwrite immediately,
2. locate the exact conflicting claim,
3. compare source authority, dates and scope,
4. determine whether the conflict is real or caused by different definitions/contexts,
5. if resolved, UPDATE or SUPERSEDE,
6. if unresolved, preserve both as source claims and create an OPEN QUESTION.

Where a prior belief was materially important, preserve a Learning Episode that records the shift.

---

## 9. Taxonomy protocol

Taxonomy changes should be proposed rather than casually performed.

A proposal contains:

```markdown
## TAXONOMY CHANGE

### Problem
Why the current structure is failing.

### Before
...

### Proposed
...

### Affected knowledge
...

### Migration risk
...
```

Bulk moves/renames should be handled by Codex only when local filesystem work is actually necessary.

---

## 10. Episode settlement triggers

Settle a learning episode when:

- the core mental model stabilizes,
- the topic changes,
- the user indicates understanding / closure,
- the conversation has accumulated enough durable change that waiting creates loss risk.

Do not settle every message.

When the current learning focus materially changes, update `content/00-驾驶舱/01-当前学习.md` so the cockpit reflects what the user is actually studying.

---

## 11. Minimal-write principle

A good curator aggressively compresses duplication.

Example:

30 chat turns about Programmatic SEO may produce:

- 1 Source summary
- 1 Learning Episode
- UPDATE `programmatic-seo`
- UPDATE `search-intent`
- CREATE `thin-content` only if it is truly missing
- 2 new Related links
- 1 Open Question

It should not produce 30 notes.

---

## 12. Auditability

All automated knowledge changes should be reviewable through Git history.

Commit messages should describe semantic impact, for example:

- `knowledge: deepen programmatic SEO and link search intent`
- `learning: settle GEO citation episode`
- `taxonomy: split acquisition into search and paid`

Avoid meaningless commit messages such as `update notes`.
