import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import "./library.css";
import "./mono-theme.css";
import "./daylight-v2.css";
import "./daylight-index.css";
import "./daylight-fidelity.css";
import "./daylight-fidelity-2.css";
import NavBridge from "./nav-bridge";
import { WebsitePreferencesProvider } from "./editor-preferences";

export const metadata: Metadata = {
  title: "Knowledge OS",
  description: "Personal knowledge and research operating system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <WebsitePreferencesProvider>
          <NavBridge />
          {children}
        </WebsitePreferencesProvider>
      </body>
    </html>
  );
}
