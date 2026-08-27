# Obsidian Dataview — 最小安装说明

用途：只给「知识驾驶舱」提供动态的最近知识、最近学习、待消化资料和开放问题视图。

Canonical Knowledge 不依赖 Dataview；即使卸载插件，Markdown 知识本身仍然完整。

## 一次性人工操作

1. Obsidian → 设置 → 第三方插件。
2. 如果当前处于受限模式，关闭受限模式。
3. 浏览社区插件，搜索 `Dataview`。
4. 安装并启用 `Dataview`。
5. 重新打开 `00-驾驶舱/00-首页.md`。

不需要开启 JavaScript Queries。当前驾驶舱只使用普通 Dataview Query Language（DQL）。

## 当前动态区块

- 最近更新的知识：读取 `01-知识库/`
- 最近学习：读取 `02-学习记录/`
- 待消化资料：读取 `03-资料库/收件箱/`
- 开放问题：读取 Learning Episode 的 `open_questions` 属性

## 安全原则

- 不用 Dataview 保存任何唯一数据。
- 不把 Dataview 当数据库源。
- GitHub Markdown 仍是唯一长期知识资产。
- 如果 Dataview 将来不可用，只需替换驾驶舱视图，不需要迁移知识。
