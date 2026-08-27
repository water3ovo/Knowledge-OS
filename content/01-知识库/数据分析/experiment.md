---
id: experiment
title: Experiment
title_en: Growth Experiment
slug: experiment
domain: data
type: method
tags:
  - Experiment
  - Growth
aliases:
  - 实验
summary: "通过明确假设、干预、对照和结果指标验证某个增长动作是否真正有效。"
related:
  - causal-inference
  - response-curve
  - black-box-system
playbooks:
  - amazon-traffic-diagnosis
cases:
  - amazon-traffic-intelligence
sources: []
created_at: 2026-08-18
updated_at: 2026-08-18
---

## WHAT

Experiment 把一个业务判断转化成可验证假设，通过改变变量并观察结果来减少凭经验决策。

## WHY

平台、用户和市场会同时变化，只看前后数据很容易误判。实验可以更接近回答“是不是这个动作造成了变化”。

## HOW

1. 写出明确假设。
2. 选 Treatment 和结果指标。
3. 设计 Control 或基准。
4. 执行干预并记录环境变化。
5. 分析效果与不确定性。
6. 决定放大、停止或继续验证。
