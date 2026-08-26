# Knowledge Curator

Use this skill when asked to ingest a learning discussion, source, note, URL-derived summary, or research result into Knowledge OS.

## Read first

- `AGENTS.md`
- `docs/KNOWLEDGE_CURATOR_PROTOCOL.md`
- `content/meta/taxonomy.json`

## Objective

Turn new material into the smallest justified set of durable knowledge changes.

## Procedure

1. Identify the learning topic and source type.
2. Search existing canonical knowledge for matching concepts, aliases and related notes.
3. Classify candidate changes as:
   - NO_CHANGE
   - SOURCE
   - UPDATE
   - CREATE
   - LINK
   - MERGE
   - INSIGHT
   - QUESTION
   - SUPERSEDE
   - TAXONOMY_CHANGE
4. Preserve provenance in `content/sources/` when the source matters.
5. Create or update one Learning Episode in `content/learning/` for the session/topic when useful.
6. Update existing canonical notes before creating new ones.
7. Keep personal hypotheses under `MY INSIGHTS` or in the Learning Episode; do not blend them into established facts.
8. If new information conflicts with current knowledge, do not silently overwrite. Follow the contradiction protocol.
9. Add or repair related links.
10. Summarize the Knowledge Delta before committing.

## Quality bar

A long conversation should usually produce only a few canonical edits.

Bad:
- one new note per message,
- duplicated summaries,
- invented certainty,
- losing source context,
- dumping raw transcript into canonical knowledge.

Good:
- one source record,
- one learning episode,
- two precise updates,
- one genuinely new concept only when needed,
- preserved open questions.

## Commit style

Use semantic messages such as:

- `knowledge: deepen GEO and link AI visibility`
- `learning: settle programmatic SEO episode`
- `source: add Google Search documentation evidence`
- `taxonomy: propose acquisition subdomains`
