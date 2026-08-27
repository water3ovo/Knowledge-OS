# Personal Knowledge System — Agent Rules

This repository contains a frozen Knowledge OS web frontend and the active Obsidian-first Markdown knowledge system.

## Core rule

`content/` is the shared knowledge asset and Obsidian Vault. Treat it as portable Markdown first. Do not create a second copy for Obsidian, the website, or another tool.

The custom website is currently **Frontend Frozen / Content Active**. Do not resume frontend work unless explicitly requested.

## Human-facing language and reading experience

- Human-facing folder names and navigation should be Chinese-first.
- Keep genuine business/product terms such as GTM, SEO, GEO, LLM, Agent, RAG, MCP, CAC/LTV in their normal professional form.
- Prefer readable narrative notes and MOC pages over database-like tables.
- Bases are secondary indexes/management views, not the primary learning experience.
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

- `content/00-驾驶舱/` — human-facing home + secondary Base indexes
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
- `content/meta/`, `content/seeds/` — technical metadata; keep stable unless schema/taxonomy work requires changes

## Obsidian compatibility

`content/` is the Vault root. Core knowledge must remain readable without Obsidian: standard Markdown + YAML + simple `[[wikilinks]]` are the durable format. Canvas/Bases/CSS are useful views, not the only representation of knowledge.

## Tool division

- ChatGPT should perform normal semantic curation and GitHub Markdown changes directly when possible.
- Use Codex only when local filesystem access, local Obsidian GUI/plugin work, bulk local refactoring, complex local Git conflict handling, or local build/debugging is genuinely necessary.

## Engineering safety

For bulk moves, renames or schema changes:

1. work on a branch,
2. validate links/IDs,
3. use CI/build checks,
4. inspect diff,
5. merge only after validation.

Do not change website layout during knowledge/Obsidian work unless explicitly required.
