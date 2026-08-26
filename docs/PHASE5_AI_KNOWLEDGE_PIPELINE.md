# Phase 5 — AI Knowledge Pipeline

Updated: 2026-08-26

## Goal

Knowledge OS should become a system where the user mainly **learns, asks, reads, uploads and discusses**, while AI handles the maintenance work required to turn that stream into a long-term knowledge asset.

The target experience is:

`Conversation / URL / PDF / screenshot / research → capture → curate → update knowledge → maintain links/taxonomy → Git → Knowledge OS / Obsidian`

The user should not need to manually copy notes, decide folders, create duplicate concepts, or remember to update the website after every learning session.

---

## Core Principle: one knowledge asset, multiple views

The source of truth is **portable Markdown + YAML in Git**.

- ChatGPT: teacher + semantic Knowledge Curator
- Codex: local Knowledge Engineer, file operations, bulk refactors, linting, Obsidian-side work
- GitHub: version history, rollback, remote source of truth
- Obsidian: optional Knowledge IDE for backlinks, graph, Canvas, local editing and inspection
- Knowledge OS: primary high-density learning, retrieval and application interface

Obsidian and Knowledge OS must NOT maintain separate copies of knowledge. They read the same Markdown files.

---

## Three-layer knowledge model

### 1. Sources

Raw or summarized evidence that entered the system.

Examples:
- ChatGPT learning episode
- webpage/article
- PDF/report
- screenshot
- video/transcript
- user-provided note
- public research result

Sources preserve provenance and context. They are not automatically treated as truth.

Location: `content/sources/`

### 2. Learning

The user's learning process and evolving interpretation.

A Learning Episode may contain:
- questions asked
- initial understanding
- corrections
- personal insight / hypothesis
- unresolved questions
- contradictions
- concepts updated

This layer keeps the path of reasoning without polluting canonical knowledge with chronological conversation history.

Location: `content/learning/`

### 3. Canonical Knowledge

The current best reusable representation of a concept.

It should answer things such as:
- WHAT
- WHY
- WHEN
- HOW
- DATA
- TOOLS
- OUTPUT
- PITFALLS
- RELATED
- SOURCES

Canonical Knowledge is intentionally concise and de-duplicated. A long conversation may update only one or two existing cards.

Location: existing `content/knowledge/`

---

## Supporting layers

- `content/inbox/` — unprocessed capture queue
- `content/playbooks/` — problem-solving procedures
- `content/cases/` — applied examples / experiments
- `content/tools/` — tools and data resources
- `content/meta/` — taxonomy, schemas and system metadata
- `content/archive/` — superseded or intentionally retired content

Existing website paths remain valid. Phase 5.1 adds new layers without renaming the current content folders.

---

## Knowledge Delta model

Do not continuously save every chat message. Curate **knowledge deltas** at natural learning boundaries.

Allowed operations:

- `NO_CHANGE` — useful discussion but no durable knowledge change
- `SOURCE` — add provenance only
- `UPDATE` — improve an existing concept
- `CREATE` — genuinely new durable concept
- `LINK` — add or correct relationships
- `MERGE` — combine duplicate concepts
- `INSIGHT` — preserve a personal hypothesis/interpretation separately from established knowledge
- `QUESTION` — preserve an unresolved question
- `SUPERSEDE` — a newer understanding replaces an older claim/version
- `TAXONOMY_CHANGE` — current knowledge structure is no longer adequate

The objective is to save **knowledge change**, not conversation volume.

---

## Learning Episode boundaries

A learning episode can be settled when one of these occurs:

1. Semantic stability — the main concept has become coherent and is no longer changing materially.
2. Topic shift — the conversation moves to another subject.
3. Natural close — e.g. the user indicates understanding, stops, or moves on.
4. Explicit save/review request.

Near-real-time curation is preferred over message-by-message writes.

---

## Provenance and truth handling

Every durable claim should be classifiable as one of:

- `established` — broadly supported knowledge
- `source_claim` — a specific source says this
- `inference` — reasoned conclusion from evidence
- `personal_insight` — the user's interpretation/hypothesis
- `uncertain` — unresolved or insufficiently supported

Do not silently upgrade an inference or personal insight into established knowledge.

When new material contradicts existing knowledge:

1. preserve the source,
2. mark the conflict,
3. compare evidence and timestamps,
4. update canonical knowledge only when justified,
5. preserve supersession/audit history when the prior belief mattered.

---

## Dynamic taxonomy

Knowledge structure must be content-driven rather than UI-driven.

Current domains are a baseline, not a permanent ontology:

- Strategy
- Global GTM
- Growth
- AI Product
- Data
- Platform

A Taxonomy Change should be proposed when:

- one domain becomes too broad,
- multiple concepts form a stable sub-domain,
- concepts repeatedly belong to two areas,
- navigation no longer matches retrieval behavior,
- a new long-term learning domain emerges.

Taxonomy changes should be explicit and reviewable rather than silently moving dozens of notes.

---

## Agent division of labor

### ChatGPT — Knowledge Curator

Best at:
- understanding live learning context
- determining what actually changed
- distinguishing user insight vs source fact
- deciding UPDATE / CREATE / LINK / QUESTION
- drafting semantic changes

### Codex — Knowledge Engineer

Best at:
- operating the local vault
- bulk file changes
- renames and link repairs
- schema migrations
- running vault health checks
- Git operations
- Obsidian setup
- scripts, search indexes and website integration

Codex does not need to monitor ChatGPT in real time. ChatGPT records curated deltas to the shared Git/Markdown knowledge asset; Codex operates that same asset locally when engineering work is needed.

---

## Phase plan

### 5.1 — Knowledge Vault & Curator Architecture
- define three-layer model
- add inbox/source/learning/meta structure
- define curator protocol
- add agent instructions for Codex
- add first health-check rules

### 5.2 — Obsidian-compatible local Vault
- open `content/` as the vault
- configure safe `.obsidian` settings
- install/enable only necessary capabilities
- verify Codex can read/write the vault safely

### 5.3 — Curator write path
- turn a learning episode into Source + Learning + Knowledge Delta
- update existing cards instead of creating duplicates
- record operation log

### 5.4 — Taxonomy & relationship maintenance
- taxonomy file drives navigation
- Wikilink / Related compatibility
- orphan and broken-link detection

### 5.5 — Default conversation curation workflow
- professional learning conversations follow the curator protocol by default
- settle deltas at topic boundaries

### 5.6 — External capture
- optional Readwise / Web Clipper / URL / PDF inbox
- provenance-first ingest

### 5.7 — Hybrid retrieval
- lexical + semantic + reranking when the vault is large enough

### 5.8 — Knowledge OS learning UI
- show My Insights
- Open Questions
- Sources
- learning history / supersession where useful

---

## Stability rule

Automation must not turn the vault into AI-generated clutter.

- Raw/source material may grow quickly.
- Canonical Knowledge must grow slowly.
- Prefer UPDATE over CREATE.
- Prefer one strong concept over five overlapping summaries.
- Preserve unresolved questions rather than inventing certainty.
