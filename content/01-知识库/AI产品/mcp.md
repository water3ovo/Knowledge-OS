---
id: mcp
title: MCP
title_en: Model Context Protocol
slug: mcp
domain: ai
type: protocol
tags:
  - AI
  - Tools
aliases: []
summary: "用于让 AI 应用以标准化方式连接外部工具、数据和上下文的协议。"
related:
  - agent
  - workflow
playbooks: []
cases: []
sources: []
created_at: 2026-08-18
updated_at: 2026-08-18
---

## WHAT

MCP 为模型侧应用与外部能力之间提供统一连接方式，使工具、资源和提示等上下文能够以标准接口被发现和调用。

## WHY

当 AI 产品要连接越来越多外部系统时，标准化协议可以减少每个集成都重新设计一套接口的成本。

## HOW

1. MCP Server 暴露资源或工具。
2. Client 发现可用能力。
3. 模型根据任务选择调用。
4. Server 执行并返回结构化结果。
5. 应用继续推理或展示结果。
