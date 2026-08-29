import KnowledgeOSClient from "./knowledge-os-client";
import { getAllDomainGroups, getAllKnowledge } from "@/lib/all-content";
import { getLibraryItems } from "@/lib/content";
import syncState from "@/content/meta/sync-state.json";

export default function Home() {
  const knowledge = getAllKnowledge();
  const domains = getAllDomainGroups(knowledge);
  const library = getLibraryItems();

  return <KnowledgeOSClient knowledge={knowledge} domains={domains} library={library} syncState={syncState} />;
}
