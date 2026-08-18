import KnowledgeOSClient from "./knowledge-os-client";
import { getDomainGroups, getKnowledge, getLibraryItems } from "@/lib/content";

export default function Home() {
  const knowledge = getKnowledge();
  const domains = getDomainGroups(knowledge);
  const library = getLibraryItems();

  return <KnowledgeOSClient knowledge={knowledge} domains={domains} library={library} />;
}
