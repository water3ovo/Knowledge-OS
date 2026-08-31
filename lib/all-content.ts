import { getDomainGroups, getKnowledge, type DomainGroup, type KnowledgeItem } from "./content";

/**
 * Canonical website knowledge now comes exclusively from real Markdown files
 * under content/01-知识库.
 *
 * content/seeds/*.json remains in the repository as historical scaffolding,
 * but it is intentionally excluded from the website's index, search, counts,
 * homepage modules and knowledge map.
 */
export function getAllKnowledge(): KnowledgeItem[] {
  return getKnowledge();
}

export function getAllDomainGroups(knowledge = getAllKnowledge()): DomainGroup[] {
  return getDomainGroups(knowledge);
}
