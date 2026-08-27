# Obsidian-first Operating Model

Updated: 2026-08-27

## Decision

Pause active development of the custom Knowledge OS frontend.

The website remains a low-maintenance read-only mirror because it already consumes the same Markdown content, but new product work should prioritize Obsidian and the AI knowledge pipeline.

## Roles

- **ChatGPT** — learning, research, explanation, semantic curation.
- **Markdown Vault (`content/`)** — single source of truth.
- **Obsidian** — primary knowledge workbench: Files, Properties, Backlinks, Graph, Canvas, Bases, manual restructuring.
- **Codex** — local knowledge engineering, bulk refactors, file moves/renames, lint and automation.
- **GitHub** — version history, remote source of truth, bridge between ChatGPT and local vault.
- **Knowledge OS website** — optional read-only/mobile mirror; frontend feature development is frozen unless a clear Obsidian gap appears.

## What migrates from the website to Obsidian

| Knowledge OS idea | Obsidian replacement |
| --- | --- |
| Overview | `dashboard/00-Knowledge-HQ.md` |
| Knowledge Landscape | `Knowledge.base` + `canvas/00-Knowledge-Landscape.canvas` |
| Active Shelf | `Learning.base#Active & Recent` |
| Recently Viewed / Updated | Bases sorted/filtered by file or knowledge metadata |
| Knowledge page | File Explorer + `Knowledge.base` |
| Map | Graph + Canvas |
| Tools & Data | `Tools.base` |
| Playbooks / Cases | `Playbooks-Cases.base` |
| Search | Obsidian Search / Quick Switcher; semantic search later only if needed |
| Mono Research visual style | `knowledge-hq.css` snippet |

## Default daily workflow

1. Learn in ChatGPT normally.
2. At a semantic/topic boundary, ChatGPT applies the Knowledge Curator protocol and writes only meaningful deltas to GitHub.
3. Obsidian Git (desktop) auto-pulls remote changes so the Vault updates without manual copying.
4. When the user edits or adds notes in Obsidian, Git auto-commit/push returns them to GitHub.
5. ChatGPT can read the updated GitHub state in later learning conversations.
6. Codex is used only for structural/bulk operations rather than every knowledge update.

## External web capture

Two supported paths:

### Path A — Send the URL to ChatGPT

Best for material that should immediately affect canonical knowledge.

`URL → ChatGPT research → Source note → Knowledge Delta → GitHub → Obsidian`

### Path B — Obsidian Web Clipper

Best while freely browsing.

`Browser → Web Clipper → inbox/sources → Git auto-push → GitHub → Curator processing`

Web Clipper should capture metadata such as title, URL, captured date, source type and the selected/highlighted content. Raw clips are Sources, not Canonical Knowledge.

## Sync strategy

### Desktop

Use Obsidian Git with:

- auto-pull on startup
- scheduled pull
- commit-and-sync on a reasonable interval
- existing system Git credentials

The Vault is a subfolder of the repository (`Knowledge-OS/content`), so Codex must validate the plugin against the parent repository layout before enabling unattended sync.

### Multi-device

For the simplest reliable mobile experience, Obsidian Sync can sync the Vault across devices while GitHub remains the durable version/history layer. Avoid running two aggressive bidirectional sync engines on the same files without testing conflicts.

If Git-only mobile sync is desired later, evaluate a mobile-capable Git plugin separately; do not make it a prerequisite for the first usable system.

## Core principle

**Raw information may grow quickly. Canonical Knowledge must grow slowly.**

Do not turn every conversation turn or every clipped article into a new knowledge card.
