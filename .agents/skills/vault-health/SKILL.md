# Vault Health

Use this skill to audit the Knowledge OS Markdown vault after content or taxonomy changes.

## Checks

1. Duplicate canonical IDs
2. Duplicate slugs
3. Broken `related` references
4. Broken or suspicious `[[wikilinks]]`
5. Canonical notes missing required identity fields
6. Orphan concepts with no meaningful relationship (report, do not auto-delete)
7. Taxonomy IDs that no longer exist or domains not represented
8. Learning/source records pointing to missing knowledge IDs
9. Superseded/archived objects still presented as active canonical content

## Procedure

1. Run the repository health script if available: `npm run knowledge:health`.
2. Inspect warnings before making bulk edits.
3. For link repairs, prefer target ID/alias resolution over string guessing.
4. Do not merge concepts automatically unless semantic equivalence is clear.
5. For taxonomy changes, produce a proposal before large moves.
6. Re-run health check and `npm run build` after repairs.

## Output

Summarize:

- fatal errors,
- warnings,
- orphan candidates,
- broken links,
- proposed fixes,
- what was changed.
