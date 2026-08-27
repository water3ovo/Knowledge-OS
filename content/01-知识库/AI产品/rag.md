---
id: rag
title: RAG
title_en: Retrieval-Augmented Generation
slug: rag
domain: ai
type: architecture
tags:
  - AI
  - Retrieval
aliases: []
summary: "在生成前检索外部知识，用检索结果增强模型回答的相关性与可验证性。"
related:
  - llm
  - agent
playbooks: []
cases: []
sources: []
created_at: 2026-08-18
updated_at: 2026-08-18
---

## WHAT

RAG 先从文档、数据库或知识库中检索与问题相关的信息，再把这些信息作为上下文交给模型生成回答。

## WHY

模型参数知识可能过时或缺少私有信息，RAG 可以把企业和个人知识接入生成过程，同时保留来源依据。

## HOW

1. 准备和切分知识源。
2. 建立检索索引。
3. 根据问题召回相关内容。
4. 将召回结果加入上下文。
5. 评估检索质量与最终回答。
