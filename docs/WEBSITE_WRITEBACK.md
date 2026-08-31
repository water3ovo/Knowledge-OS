# Knowledge OS 网站写回 GitHub

网站的“提交到知识库”不会把 GitHub Token 放进浏览器。写回由 Vercel/Next.js 服务端 Route 完成。

## Vercel 环境变量

需要一次性配置：

- `GITHUB_WRITE_TOKEN`：GitHub fine-grained token，仅授予 `water3ovo/Knowledge-OS` 的 Contents: Read and write。
- `KNOWLEDGE_EDITOR_SECRET`：自定义的个人提交口令。网站首次提交时输入，前端只保存在当前浏览器 sessionStorage。

可选：

- `GITHUB_REPO_OWNER=water3ovo`
- `GITHUB_REPO_NAME=Knowledge-OS`
- `GITHUB_WRITE_BRANCH=main`

配置后重新部署一次。

## 安全机制

1. 页面构建时记录对应 Markdown 的 SHA-256 内容 hash 与 repo 路径。
2. 用户编辑完成后点击“提交到知识库”。
3. 服务端先用 GitHub API 读取 main 上的最新原文。
4. 如果最新原文 hash 与页面打开时的 hash 不一致，返回 409，停止提交，避免覆盖 ChatGPT/其他设备刚写入的新版本。
5. 一致时，只更新允许编辑的 title/title_en/tags/WHAT/WHY/WHEN/HOW/PITFALLS；其余 frontmatter 与章节原样保留。
6. GitHub main commit 会继续触发 Vercel 自动部署。

Seed-only 概念没有独立 Markdown 源文件时，“提交到知识库”会保持禁用，只允许本地草稿与 Markdown 导出。
