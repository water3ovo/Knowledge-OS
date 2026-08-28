# ChatGPT → GitHub → Knowledge OS Sync Loop

## Objective

Make professional learning conversations settle into durable knowledge without requiring manual note filing or a local Codex workflow.

## Default flow

```text
Learning conversation
      ↓
ChatGPT Knowledge Curator
      ↓
Knowledge Delta
      ↓
content/ Markdown + sync-state.json
      ↓
GitHub main
      ↓
Vercel auto deploy
      ↓
Knowledge OS reflects latest knowledge
```

## What counts as a durable update

Do not persist every message. Persist when one of these occurs:

- a concept becomes clear enough to reuse,
- the user's understanding materially changes,
- a useful connection between existing concepts is established,
- a source materially changes the knowledge base,
- an unresolved question should be retained,
- a topic or learning episode reaches semantic stability.

## Required write order

1. Retrieve existing relevant knowledge.
2. Decide Knowledge Delta operations.
3. Update/create canonical knowledge, Learning Episode and/or Source.
4. Repair meaningful links and MOC only when needed.
5. Update `content/meta/sync-state.json` last.
6. Run knowledge health / build checks for structural or frontend changes.
7. Merge validated changes to `main`.

## Sync state

`content/meta/sync-state.json` is a lightweight machine-readable heartbeat for the website. It records the latest durable knowledge sync and allows the UI to show that the deployed site is reading the latest GitHub knowledge state.

It is not the knowledge history. Learning history remains in `content/02-学习记录/` and Git history.

## Interface roles

- Knowledge OS: primary reading, learning, retrieval and exploration experience.
- Obsidian: editing, mobile capture, backlinks, graph and Canvas.
- GitHub: single source of truth and version history.
- ChatGPT: semantic curator and normal GitHub writer.
- Codex: local engineering fallback only.
