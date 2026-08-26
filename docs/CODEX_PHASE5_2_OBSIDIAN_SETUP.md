# Codex Handoff — Phase 5.2 Obsidian-compatible Local Vault

Updated: 2026-08-26

## Objective

Turn the existing `Knowledge-OS/content/` directory into a safe local Obsidian Vault without changing the website's content source of truth or breaking Vercel/Next.js behavior.

The same Markdown files must serve:

- Obsidian for local reading/navigation,
- Codex for local knowledge engineering,
- GitHub for version history,
- Knowledge OS for web rendering.

Do NOT create a second knowledge copy.

---

## Read first

1. `AGENTS.md`
2. `docs/PHASE5_AI_KNOWLEDGE_PIPELINE.md`
3. `docs/KNOWLEDGE_CURATOR_PROTOCOL.md`
4. `content/meta/taxonomy.json`
5. `.agents/skills/knowledge-curator/SKILL.md`
6. `.agents/skills/vault-health/SKILL.md`

---

## Step 1 — Sync and inspect

- Ensure local `main` is up to date with origin.
- Confirm these directories exist under `content/`:
  - inbox
  - sources
  - learning
  - knowledge
  - playbooks
  - cases
  - tools
  - meta
  - archive
- Do not rename existing website-consumed paths.

---

## Step 2 — Initialize Obsidian Vault safely

Use `content/` itself as the Vault root.

Expected Vault root:

`Knowledge-OS/content/`

Do not copy the files into another Obsidian-only directory.

If Obsidian has not yet opened this folder as a Vault, report that the user needs to select:

**Open folder as vault → Knowledge-OS/content**

Codex may prepare safe configuration files, but must not assume GUI actions succeeded unless verified.

---

## Step 3 — Minimal Obsidian configuration

Keep setup minimal and local-first.

Recommended core behavior:

- use `[[Wiki Links]]`
- auto-update internal links on rename if available
- attachments should eventually live under `inbox/assets/` or another explicit asset folder, not beside canonical knowledge files
- keep Properties/frontmatter visible and editable
- use Backlinks / Graph / Canvas / Templates core capabilities

Do NOT install a large plugin set in this phase.

Do NOT make canonical knowledge depend on Dataview, Bases, Canvas, or any community plugin format.

---

## Step 4 — Git hygiene for `.obsidian`

Inspect any generated `content/.obsidian/` files before committing.

Do not commit machine-specific/session-state files such as workspace state unless there is a clear reason.

Prefer either:

A. keep `.obsidian` local-only for this first validation, or

B. commit only stable shared settings while ignoring workspace/session/cache/plugin-state files.

If changing `.gitignore`, make the smallest safe change and explain it.

---

## Step 5 — Verify Codex Agent Skills

From the repository root, confirm Codex can discover/use:

- `knowledge-curator`
- `vault-health`

Do not rebuild or replace these skills unless necessary.

Run or follow the `vault-health` skill and execute:

`npm run knowledge:health`

Then run:

`npm run build`

Both should pass.

---

## Step 6 — Obsidian compatibility smoke test

Use a temporary, clearly marked file under `content/inbox/` to test:

- Markdown rendering
- YAML Properties rendering
- `[[wikilink]]` navigation
- rename/link behavior if practical

Do not use a canonical knowledge note for destructive testing.

After validation, delete the temporary test file unless it contains durable knowledge.

---

## Step 7 — Report back

Return a concise report with:

1. local repo path
2. whether `content/` is successfully recognized as the Obsidian Vault
3. whether `.obsidian` was created and what is tracked/ignored
4. whether Codex Agent Skills are discoverable
5. `npm run knowledge:health` result
6. `npm run build` result
7. any broken links / Obsidian incompatibilities found
8. exact files changed
9. whether changes were committed/pushed; if so, branch/commit

Do not begin Phase 5.3 curation automation until this local Vault validation is complete.
