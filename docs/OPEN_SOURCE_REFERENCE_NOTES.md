# Open-source reference notes — AI-native personal knowledge systems

Updated: 2026-08-26

The goal is not to replace Knowledge OS with another project. These projects are references for specific mechanisms that match our requirements.

## 1. arkangelai/second-brain

Reference: https://github.com/arkangelai/second-brain

Useful pattern:

- Markdown as portable storage
- Obsidian as a reading/navigation layer
- coding agents including Codex as vault writers
- hybrid retrieval (BM25 + vector + reranking)
- local-first search

What we borrow:

- keep Markdown as source of truth
- treat Obsidian as a Knowledge IDE, not the database
- reserve hybrid search for a later scale threshold
- let agents operate the same vault the user reads

What we do differently:

- our primary consumption UI remains Knowledge OS
- our main problem is curation of learning conversations into canonical knowledge, not only retrieval

---

## 2. NicholasSpisak/second-brain

Reference: https://github.com/NicholasSpisak/second-brain

Useful pattern:

- `raw/` inbox separated from LLM-maintained wiki
- one source summary per ingested source
- structured concept/entity/synthesis pages
- master index and operation log
- ingest/query/lint as explicit agent skills
- broken-link / index health checks

What we borrow:

- capture layer must be separate from canonical knowledge
- source provenance is first-class
- health/lint should become an explicit operation
- agents need a durable protocol rather than ad-hoc prompts

What we do differently:

- add a dedicated Learning layer between source and canonical knowledge
- distinguish user insights, open questions and established knowledge
- existing Knowledge / Playbook / Case / Tool structure remains

---

## 3. eugeniughelbur/obsidian-second-brain

Reference: https://github.com/eugeniughelbur/obsidian-second-brain

Useful pattern:

- Codex-compatible Agent Skills
- save conversations into distributed cross-linked notes
- ingest sources and rewrite affected pages
- synthesize across sources
- reconcile contradictions
- supersession-aware knowledge maintenance
- periodic vault health routines

What we borrow:

- Agent Skills for Codex
- contradiction/reconciliation protocol
- supersession instead of silent overwrites
- eventual periodic health checks

What we avoid for now:

- large command surface
- heavy scheduled automation before the data model is stable
- large plugin dependency footprint

---

## 4. Khoj

Reference: https://github.com/khoj-ai/khoj
Docs: https://docs.khoj.dev/

Useful pattern:

- natural-language retrieval across personal documents
- Markdown/PDF/Notion ingestion
- semantic embeddings
- Obsidian and web access

What we borrow later:

- semantic retrieval as a complementary layer to keyword search
- search should return relevant chunks/concepts, not only filename matches

What we do differently:

- retrieval alone is not enough; Knowledge OS must actively curate and evolve the knowledge structure

---

## 5. Reor

Reference: https://github.com/reorproject/reor

Useful pattern:

- local Markdown directory
- automatic linking of related notes
- semantic search
- local AI-first philosophy

Caution:

- the original repository was archived in 2026, so it is primarily an architectural reference rather than a dependency candidate.

---

## Decision for Knowledge OS

We will not migrate to one of these projects.

We will combine the strongest patterns:

`Capture separation + Learning Episodes + Canonical Knowledge + Agent Skills + provenance + reconciliation + Git audit + optional Obsidian + later hybrid search`

The differentiator is the Knowledge Curator: normal learning conversations should become minimal, structured knowledge deltas without requiring the user to manually take notes.
