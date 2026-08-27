# Knowledge Curator

Use this skill when ingesting a learning discussion, source, note, URL-derived summary, or research result into the personal knowledge system.

## Read first

- `AGENTS.md`
- `docs/KNOWLEDGE_CURATOR_PROTOCOL.md`
- `content/meta/taxonomy.json`
- relevant MOC under `content/01-知识库/`

## Objective

Turn new material into the smallest justified set of durable knowledge changes while keeping the Obsidian experience human-readable and self-growing.

## Procedure

1. Identify the learning topic and source type.
2. Search `content/01-知识库/` for matching concepts, aliases and related notes before creating anything.
3. Classify candidate changes as NO_CHANGE / SOURCE / UPDATE / CREATE / LINK / MERGE / INSIGHT / QUESTION / SUPERSEDE / TAXONOMY_CHANGE.
4. Preserve provenance under `content/03-资料库/资料来源/` when the source matters; unprocessed captures belong in `content/03-资料库/收件箱/`.
5. Create or update one Learning Episode under `content/02-学习记录/` for the topic/session when useful.
6. Mirror durable unresolved questions into the Learning Episode `open_questions` frontmatter so the cockpit can surface them automatically.
7. UPDATE existing canonical notes before CREATE.
8. Keep personal hypotheses in `我的理解 / 类比` or the Learning Episode; do not blend them into established facts.
9. If new information conflicts with current knowledge, do not silently overwrite. Follow the contradiction protocol.
10. Add or repair meaningful wikilinks/relations.
11. If the durable mental model changed, update the relevant domain MOC; do not turn every small edit into MOC churn.
12. If the user's current major learning focus changed, update `content/00-驾驶舱/01-当前学习.md`.
13. Summarize the Knowledge Delta before committing.

## Writing style

- Human-facing prose is Chinese-first; preserve real professional acronyms/terms where natural.
- Prefer readable article-like headings such as `一句话理解 / 它是什么 / 为什么重要 / 什么时候会用到 / 怎么理解或怎么做 / 一个例子 / 关键数据或判断信号 / 常见误区 / 我的理解 / 还没解决的问题 / 相关知识 / 来源`.
- Keep `id`, `slug`, machine fields and technical metadata stable.
- Bases are indexes; canonical Markdown and MOCs are the primary reading layer.

## Quality bar

A long conversation should usually produce only a few canonical edits.

Good outcome: one source record, one Learning Episode, a few precise UPDATEs/LINKs, one genuinely new concept only if necessary, and preserved open questions.

Avoid one-note-per-message, duplicated summaries, invented certainty, lost provenance, or dumping raw transcripts into canonical knowledge.

## Commit style

Use semantic messages such as:

- `knowledge: deepen GEO and link AI visibility`
- `learning: settle Google Ads auction episode`
- `source: add Google Search documentation evidence`
- `taxonomy: propose acquisition subdomains`
