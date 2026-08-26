---
id: learning-20260826-personal-ai-knowledge-system-architecture
type: learning
status: settled
started_at: 2026-08-26
topics:
  - personal knowledge system
  - Knowledge OS
  - Obsidian
  - Codex
  - AI curation
source_ids:
  - source-20260826-open-source-ai-second-brain-research
knowledge_ids: []
---

# Personal AI Knowledge System architecture

## QUESTIONS

- Should long-term knowledge live only in the custom website, in Obsidian, or in a combined system?
- If Codex can operate the local Obsidian Vault, does Obsidian add enough value?
- How can large ChatGPT learning conversations, external material, questions and personal interpretations become durable knowledge without manual note-taking?
- How should the knowledge framework evolve dynamically rather than remain a fixed folder tree?

## INITIAL UNDERSTANDING

The first design treated Knowledge OS mainly as a custom website backed by Markdown. Obsidian initially looked like an optional editor that might add manual work.

## WHAT CHANGED

- Once Codex is able to operate the local Vault, Obsidian becomes high-value as a Knowledge IDE rather than a second database.
- The core architecture should not be website vs Obsidian. It should be one portable Markdown asset with multiple views.
- A missing layer was identified: Source → Learning → Canonical Knowledge.
- ChatGPT is best positioned as the semantic Knowledge Curator because it sees the live learning context; Codex is best positioned as the local Knowledge Engineer.
- The system should curate knowledge deltas at topic/semantic boundaries rather than save every chat turn.
- Taxonomy must be content-driven and reviewable, with explicit proposals for structural changes.

## MY INSIGHTS

- The real product is not a note-taking app; it is an AI-maintained personal knowledge system.
- Obsidian's main value is saving us from rebuilding backlinks, graph/navigation, Canvas and local editing inside Knowledge OS.
- The durable asset is Markdown + Git. Any specific application should remain replaceable.

## CORRECTIONS

- Do not require Codex to monitor ChatGPT conversations in real time. ChatGPT can curate semantic deltas directly into the shared knowledge asset, while Codex handles local file-system and Obsidian engineering tasks.
- Do not create one note per long conversation. Preserve source/process separately and update canonical concepts minimally.

## OPEN QUESTIONS

- What is the best mechanism for automatic external capture: Readwise, Obsidian Web Clipper, browser extension, or a custom inbox?
- At what vault size does hybrid search become worth the complexity?
- Which Obsidian settings/plugins are truly necessary versus unnecessary maintenance overhead?
- How much of taxonomy change should be automatic versus proposal-and-review?

## KNOWLEDGE DELTA

- CREATE system architecture documentation for the AI Knowledge Pipeline.
- CREATE Knowledge Curator protocol.
- CREATE Source and Learning layers.
- CREATE Codex Agent Skills for curation and vault health.
- CREATE machine-readable taxonomy baseline.
