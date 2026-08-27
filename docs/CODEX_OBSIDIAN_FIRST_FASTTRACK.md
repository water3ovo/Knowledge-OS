# Codex Fast Track — Obsidian-first Knowledge Workbench

Updated: 2026-08-27

## Goal

Move immediately from “website-first” to an **Obsidian-first knowledge workbench** while preserving GitHub Markdown as the source of truth.

Do this as one consolidated implementation. Do not split it into many phases unless blocked by a real technical issue.

## Context

The user has already opened `D:\Knowledge-OS\content` as the Obsidian Vault.

The existing local branch is expected to contain Phase 5.2 Obsidian settings work. Preserve that work.

Read first:

- `AGENTS.md`
- `docs/OBSIDIAN_FIRST_OPERATING_MODEL.md`
- `docs/KNOWLEDGE_CURATOR_PROTOCOL.md`
- `docs/PHASE5_AI_KNOWLEDGE_PIPELINE.md`
- `.agents/skills/knowledge-curator/SKILL.md`
- `.agents/skills/vault-health/SKILL.md`

## 1. Preserve and sync current local work

Before doing anything destructive:

1. confirm the current Phase 5.2 branch is clean/committed;
2. push it to origin as a safety point;
3. fetch latest `origin/main`;
4. bring latest main into the branch using the safest normal Git strategy;
5. do not delete or overwrite valid local `.obsidian` settings.

## 2. Convert canonical content from `.mdx` to `.md`

This is now required because Obsidian natively treats `.md` as Markdown notes, while `.mdx` is not a native note format.

Bulk rename content files under:

- `content/knowledge/**`
- `content/playbooks/**`
- `content/cases/**`
- `content/tools/**`

from `.mdx` to `.md` where the file contains ordinary Markdown/frontmatter and does not actually require JSX/React components.

Before rename, scan for JSX/MDX-only syntax. If any file genuinely requires MDX, report it instead of blindly renaming it.

After rename:

- fix explicit `.mdx` path references if any;
- preserve IDs/slugs/frontmatter;
- verify Wiki Links and Canvas file paths;
- confirm the Next.js content loader still works (it already accepts both `.md` and `.mdx`).

## 3. Activate the Obsidian cockpit

The latest main contains:

- `content/dashboard/00-Knowledge-HQ.md`
- `content/dashboard/Knowledge.base`
- `content/dashboard/Learning.base`
- `content/dashboard/Sources.base`
- `content/dashboard/Tools.base`
- `content/dashboard/Playbooks-Cases.base`
- `content/canvas/00-Knowledge-Landscape.canvas`
- `content/.obsidian/snippets/knowledge-hq.css`

Validate them in the real Vault.

Enable the required **core** plugins/settings:

- Files / File Explorer
- Properties
- Backlinks
- Graph
- Canvas
- Bases
- Search
- Quick Switcher
- Bookmarks
- Templates

Make `dashboard/00-Knowledge-HQ.md` the obvious home entry:

- bookmark it;
- open it after setup;
- if practical, pin the tab in the local workspace;
- do not track machine-specific workspace state merely to force this across devices.

Enable the `knowledge-hq` CSS snippet and confirm the dashboard renders in the Mono Research visual direction.

## 4. Validate Bases and Canvas

Open every dashboard Base and verify it renders.

Important:

- Knowledge Bases should see the newly renamed `.md` notes and their Properties.
- Learning should show Learning Episodes.
- Sources should show `sources/` and `inbox/` notes.
- Playbooks/Cases/Tools should populate.

Open `canvas/00-Knowledge-Landscape.canvas` and verify its file nodes resolve after `.mdx → .md` migration.

Fix only real compatibility problems found during validation.

## 5. Add a minimal capture template

Create `content/templates/Web Source.md` with Properties suitable for external capture:

- `type: source`
- `source_type: web`
- `status: inbox`
- `title`
- `url`
- `captured_at`
- `topics`
- `reliability`

Include sections:

- WHY I SAVED THIS
- HIGHLIGHTS / EXCERPTS
- QUESTIONS
- POSSIBLE KNOWLEDGE IMPACT

Also ensure `content/inbox/assets/` exists (use a tracked placeholder if needed).

Do not duplicate full copyrighted articles by default; clips should preserve useful excerpts/highlights, metadata and links.

## 6. Install/configure desktop Git automation if safe

Preferred plugin: the established **Obsidian Git** community plugin (`Vinzent03/obsidian-git`).

Goal:

- auto-pull on Obsidian startup;
- scheduled sync at a conservative interval (e.g. 5–10 minutes, not every few seconds);
- commit/pull/push for user edits;
- use existing system Git credentials;
- avoid committing workspace/session/cache noise.

Because the Vault is `D:\Knowledge-OS\content` and the Git repository root is its parent `D:\Knowledge-OS`, first verify from the Vault directory that Git correctly resolves the parent repository with:

`git rev-parse --show-toplevel`

Do not invent a custom base path unless the plugin actually needs it.

If plugin installation or authentication cannot be completed without a GUI/user action, prepare everything possible and report the exact single manual action needed.

Do not configure aggressive Git sync on mobile in this task.

## 7. Obsidian Web Clipper readiness

Do not attempt to control the browser UI silently.

Prepare the Vault so the user can install the official Obsidian Web Clipper later and save pages/highlights into:

`inbox/` or `sources/`

using the Web Source template/metadata model.

The actual browser-extension install/import may be a one-time user action.

## 8. Health and regression validation

Run:

- `npm run knowledge:health`
- `npm run build`

Also check:

- duplicate knowledge IDs;
- broken explicit file links introduced by rename;
- Canvas file nodes;
- dashboard Base rendering in Obsidian;
- Wiki Links / Backlinks;
- no unexpected loss of frontmatter.

## 9. Final output

Commit and push the completed branch.

Return one concise report with:

1. final branch + commit;
2. `.mdx → .md` migration counts and exceptions;
3. dashboard status;
4. Base status;
5. Canvas status;
6. CSS status;
7. Git automation status;
8. any single manual Obsidian/browser actions still required;
9. `knowledge:health` result;
10. `build` result;
11. exact warnings/errors remaining.

Do not resume custom Knowledge OS frontend development.
