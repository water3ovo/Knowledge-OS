import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import "./library.css";
import "./mono-theme.css";
import NavBridge from "./nav-bridge";

export const metadata: Metadata = {
  title: "Knowledge OS",
  description: "Personal knowledge and research operating system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body><NavBridge />{children}</body>
    </html>
  );
}
