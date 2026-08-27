---
id: agent
title: Agent
title_en: AI Agent
slug: agent
domain: ai
type: concept
tags:
  - AI
  - Tool Use
aliases:
  - AI Agent
summary: "围绕目标进行推理、调用工具、执行动作，并根据结果继续推进任务的 AI 系统。"
related:
  - llm
  - mcp
  - workflow
playbooks: []
cases: []
sources: []
created_at: 2026-08-18
updated_at: 2026-08-18
---

## WHAT

Agent 在模型生成之外增加目标、状态、工具和行动循环，使 AI 能够执行多步骤任务而不只是回答一次问题。

## WHY

许多真正有业务价值的 AI 场景需要读取数据、调用系统、检查结果并继续行动，Agent 是连接模型与工作流的重要形态。

## HOW

1. 定义目标与停止条件。
2. 提供必要上下文。
3. 暴露可控工具。
4. 执行推理与行动循环。
5. 加入权限、日志和人工确认。
