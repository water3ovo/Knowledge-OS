# Knowledge OS — Agent Rules

This repository contains both the Knowledge OS application and its long-term Markdown knowledge asset.

## Core rule

`content/` is the shared knowledge asset. Treat it as portable Markdown first and website content second.

Do not create a second copy of knowledge for Obsidian or another tool.

## Before modifying knowledge

Read:

1. `docs/PHASE5_AI_KNOWLEDGE_PIPELINE.md`
2. `docs/KNOWLEDGE_CURATOR_PROTOCOL.md`
3. `content/meta/taxonomy.json`

## Knowledge write principles

- retrieve before creating a new concept,
- prefer UPDATE over CREATE,
- preserve source provenance,
- keep user insights separate from established knowledge,
- preserve unresolved questions rather than manufacturing certainty,
- do not silently overwrite contradictory or superseded knowledge,
- keep canonical notes concise and reusable,
- keep learning history in `content/learning/`, not in canonical notes.

## File roles

- `content/inbox/` — unprocessed capture
- `content/sources/` — provenance/evidence
- `content/learning/` — learning episodes
- `content/knowledge/` — canonical concepts
- `content/playbooks/` — procedures
- `content/cases/` — applied cases
- `content/tools/` — tools/data resources
- `content/meta/` — taxonomy/system metadata
- `content/archive/` — intentionally retired/superseded objects

## Obsidian compatibility

When the repository is used locally, `content/` may be opened directly as an Obsidian Vault.

Core knowledge must remain readable without Obsidian. Use standard Markdown + YAML frontmatter + simple `[[wikilinks]]` where helpful. Avoid making canonical content depend on plugin-specific databases or proprietary formats.

## Engineering safety

For bulk moves, renames or schema changes:

1. create a branch,
2. run/build validation,
3. check broken links and duplicate IDs,
4. inspect the diff,
5. merge only after validation.

Do not change website layout while performing a pure knowledge migration unless explicitly required.
