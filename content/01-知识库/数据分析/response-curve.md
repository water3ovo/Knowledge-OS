---
id: response-curve
title: Response Curve
title_en: Response Curve
slug: response-curve
domain: data
type: analysis
tags:
  - Experiment
  - Marginal Return
aliases:
  - 响应曲线
summary: "描述某个可控输入逐步变化时，系统输出如何响应以及边际收益何时开始衰减。"
related:
  - experiment
  - auction
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

Response Curve 用一系列不同强度的输入和对应结果描述系统反应，例如 Bid 提升 20%、50%、100% 时曝光份额和订单如何变化。

## WHY

它比只比较“调前和调后”更有价值，因为可以发现平台的边际流量、饱和点和最值得投入的区间。

## HOW

1. 选择一个可操纵变量。
2. 设计多个输入水平。
3. 记录对应输出。
4. 控制其他重要干扰。
5. 观察斜率变化与边际收益衰减。
