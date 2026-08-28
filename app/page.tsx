import KnowledgeOSClient from "./knowledge-os-client";
import { getAllDomainGroups, getAllKnowledge } from "@/lib/all-content";
import { getLibraryItems } from "@/lib/content";
import syncState from "@/content/meta/sync-state.json";

export default function Home() {
  const knowledge = getAllKnowledge();
  const domains = getAllDomainGroups(knowledge);
  const library = getLibraryItems();

  return (
    <>
      <KnowledgeOSClient knowledge={knowledge} domains={domains} library={library} />
      <div
        aria-label="Knowledge sync status"
        title={syncState.lastDelta.summary}
        style={{
          position: "fixed",
          right: 18,
          bottom: 14,
          zIndex: 80,
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "7px 10px",
          border: "1px solid rgba(18,18,18,.10)",
          borderRadius: 999,
          background: "rgba(255,255,255,.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 8px 28px rgba(0,0,0,.06)",
          color: "#666",
          fontSize: 11,
          letterSpacing: ".02em",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6f8579" }} />
        <span>SYNCED · {syncState.lastSyncedAt.slice(5, 16).replace("T", " ")}</span>
      </div>
    </>
  );
}
