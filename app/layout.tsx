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

const heroArtworkOverride = `
.hero-eye { display: none !important; }
.ko-hero::after {
  content: "" !important;
  position: absolute !important;
  z-index: 1 !important;
  top: -2% !important;
  right: -1% !important;
  width: 49% !important;
  height: 104% !important;
  pointer-events: none !important;
  background-image: url("/assets/visual/ChatGPT%20Image%202026%E5%B9%B48%E6%9C%8831%E6%97%A5%2016_04_24.png?v=hero-20260831-2") !important;
  background-repeat: no-repeat !important;
  background-size: 168% auto !important;
  background-position: 84% 19% !important;
  opacity: .52 !important;
  mix-blend-mode: multiply !important;
  filter: contrast(1.03) saturate(.62) !important;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.50) 17%, #000 39%, #000 100%) !important;
  mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.50) 17%, #000 39%, #000 100%) !important;
}
@media (max-width: 760px) {
  .ko-hero::after {
    width: 66% !important;
    right: -24% !important;
    opacity: .24 !important;
  }
}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <WebsitePreferencesProvider>
          <NavBridge />
          {children}
        </WebsitePreferencesProvider>
        <style id="ko-hero-artwork-override">{heroArtworkOverride}</style>
      </body>
    </html>
  );
}
