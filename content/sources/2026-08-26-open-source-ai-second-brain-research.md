---
id: source-20260826-open-source-ai-second-brain-research
type: source
source_type: web
status: active
title: Open-source AI second-brain architecture research
captured_at: 2026-08-26
topics:
  - personal knowledge system
  - Obsidian
  - Codex
  - hybrid search
reliability: secondary
related:
  - personal-ai-knowledge-system
---

# Open-source AI second-brain architecture research

## CONTEXT

Research performed while designing Phase 5 of Knowledge OS. The goal was to find projects close to the desired workflow: AI-assisted capture, automatic organization, Markdown/Obsidian compatibility, search, and agent maintenance.

## RELEVANT CLAIMS

- `arkangelai/second-brain` uses Markdown as storage, Obsidian for reading/navigation, QMD hybrid search, and coding agents including Codex for vault operations.
- `NicholasSpisak/second-brain` separates raw sources from an LLM-maintained wiki and exposes ingest/query/lint as agent operations.
- `eugeniughelbur/obsidian-second-brain` supports Codex Agent Skills and includes conversation save, source ingest, synthesis, contradiction reconciliation and supersession-aware maintenance.
- Khoj demonstrates natural-language/semantic retrieval across personal documents.
- Reor demonstrates local Markdown + automatic linking + semantic search, but its original repository is archived and is used only as an architectural reference.

## EVIDENCE / LIMITS

These projects solve overlapping but not identical problems. Most optimize either retrieval or AI-maintained notes. Knowledge OS additionally needs a dedicated Learning layer and strict separation between established knowledge, user insight, and unresolved questions.

## KNOWLEDGE IMPACT

- CREATE: Personal AI Knowledge System architecture
- UPDATE: Phase 5 roadmap
- CREATE: Knowledge Curator protocol
- LINK: Obsidian ↔ GitHub Markdown ↔ Knowledge OS ↔ Codex
