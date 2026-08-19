"use client";

import { useEffect } from "react";

const routes: Record<string, string> = {
  Overview: "/",
  Knowledge: "/knowledge",
  Playbooks: "/playbooks",
  "Tools & Data": "/tools",
  Cases: "/cases",
  Map: "/map",
};

export default function NavBridge() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button.nav-link") as HTMLButtonElement | null;
      if (!button) return;
      const label = button.textContent?.trim() ?? "";
      const href = routes[label];
      if (!href) return;
      event.preventDefault();
      window.location.href = href;
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
