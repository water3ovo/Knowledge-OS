# Personal Knowledge System — Agent Rules

This repository contains a shared Markdown knowledge system with two interfaces:

- **Knowledge OS website** — primary reading / learning / retrieval experience.
- **Obsidian** — primary editing / note-taking / Canvas / backlink workspace.

Both use the same `content/` files. Do not create a second copy of the knowledge base.

## Core rule

`content/` is the single knowledge asset layer and source of truth in GitHub. The website and Obsidian are two views over the same Markdown.

The website is now **Primary Experience / Content Active**. Obsidian remains **Editor + Canvas + Mobile Companion**. Do not build a second custom frontend inside Obsidian unless explicitly requested.

## ChatGPT → GitHub → Website sync loop

Professional learning conversations should default to curation when a durable knowledge change has stabilized.

1. retrieve existing relevant knowledge before writing,
2. determine the Knowledge Delta (`NO_CHANGE / SOURCE / UPDATE / CREATE / LINK / MERGE / INSIGHT / QUESTION / SUPERSEDE / TAXONOMY_CHANGE`),
3. update the canonical Markdown / Learning Episode / Source as appropriate,
4. update `content/meta/sync-state.json` as the final knowledge-write operation,
5. merge validated changes to `main`,
6. Vercel deployment from `main` makes the Knowledge OS website reflect the latest repository content.

Do not require the user to say “同步” for every durable learning episode. Do not write every chat message; settle knowledge at semantic stability, topic shift, or conversation end.

## Human-facing language and reading experience

- Human-facing folder names and navigation should be Chinese-first.
- Keep genuine business/product terms such as GTM, SEO, GEO, LLM, Agent, RAG, MCP, CAC/LTV in their normal professional form.
- Prefer readable narrative notes and MOC pages over database-like tables.
- Stable canonical notes should progressively prefer Chinese section headings such as `是什么 / 为什么 / 什么时候用 / 怎么做 / 数据与输入 / 工具 / 输出 / 常见误区`.
- Never rename stable `id` / `slug` merely to translate the UI.

## Before modifying knowledge

Read:

1. `docs/KNOWLEDGE_CURATOR_PROTOCOL.md`
2. `content/meta/taxonomy.json`
3. relevant MOC under `content/01-知识库/`

## Knowledge write principles

- retrieve before creating a new concept,
- prefer UPDATE over CREATE,
- preserve source provenance,
- keep user insights separate from established knowledge,
- preserve unresolved questions rather than manufacturing certainty,
- do not silently overwrite contradictory or superseded knowledge,
- keep canonical notes concise, readable and reusable,
- keep learning history in `content/02-学习记录/`, not in canonical notes,
- after a durable update, repair meaningful links and update a MOC only when the mental model actually changed.

## File roles

- `content/00-驾驶舱/` — supporting human-facing indexes for Obsidian
- `content/01-知识库/` — canonical concepts + readable domain MOCs
- `content/02-学习记录/` — Learning Episodes
- `content/03-资料库/收件箱/` — unprocessed capture
- `content/03-资料库/资料来源/` — provenance/evidence
- `content/04-实战手册/` — problem-solving procedures
- `content/05-案例/` — applied cases
- `content/06-工具与数据/` — tools/data resources
- `content/07-白板/` — Canvas thinking artifacts
- `content/08-模板/` — capture/note templates
- `content/99-归档/` — retired/superseded objects
- `content/meta/`, `content/seeds/` — technical metadata and sync state

## Obsidian role

`content/` is also the Obsidian Vault root. Core knowledge must remain readable without Obsidian: standard Markdown + YAML + simple `[[wikilinks]]` are the durable format. Canvas/Bases/CSS/plugins are useful editing views, not the only representation of knowledge.

Use Obsidian for editing, mobile capture, backlinks, graph exploration and Canvas. Do not spend engineering effort making Obsidian imitate the Knowledge OS website.

## Tool division

- ChatGPT should perform normal semantic curation and GitHub Markdown changes directly when possible.
- Use Codex only when local filesystem access, local Obsidian GUI/plugin work, bulk local refactoring, complex local Git conflict handling, or local build/debugging is genuinely necessary.

## Engineering safety

For bulk moves, renames, schema changes or frontend changes:

1. work on a branch,
2. validate links/IDs,
3. use CI/build checks,
4. inspect diff,
5. merge only after validation.

Website visual changes should be deliberate product work, not a side effect of knowledge curation.
