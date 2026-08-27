---
id: causal-inference
title: 因果推断
title_en: Causal Inference
slug: causal-inference
domain: data
type: discipline
tags:
  - Experiment
  - Causality
  - Growth Analytics
aliases:
  - Causal Inference
summary: 用实验或准实验方法区分“只是一起变化”与“某个动作真正造成了结果变化”。
related:
  - black-box-system
  - amazon-distribution
  - experiment
playbooks:
  - amazon-traffic-diagnosis
cases:
  - amazon-traffic-intelligence
sources: []
created_at: 2026-08-18
updated_at: 2026-08-18
---

## WHAT

因果推断研究的是：**如果我们没有采取某个动作，结果本来会怎样？** 通过构造对照、随机实验或准实验，尽量估计某个干预对结果产生的真实增量影响，而不是只观察相关性。

## WHY

Growth 和平台分析里最常见的误判是：广告增加后自然单上涨，就认定广告提升自然排名；页面改版后 CVR 上升，就认定改版有效。但同期可能还有促销、季节、流量结构和竞争变化。因果推断用来尽量隔离这些共同影响。

## WHEN

- 判断广告是否带来增量自然流量
- 判断价格、Coupon、页面改版是否真正提升转化
- 无法直接做完全随机 A/B Test 时
- 需要评估平台策略、市场活动或运营动作的真实效果时

## HOW

1. 定义 **Treatment / Intervention**：到底改变了什么。
2. 定义结果指标：例如 Organic Share、CVR、Order。
3. 构造合理的 Control / Counterfactual。
4. 优先使用随机实验；不可行时使用准实验。
5. 检查 Treatment 与 Control 在干预前是否具有可比性。
6. 估计 Incremental Effect，并做稳健性检验。
7. 把结论限制在实验支持的范围内，不无限外推。

## DATA

- Treatment / Control 标记
- 干预前后数据
- 时间维度
- 结果指标
- 可能的混杂变量
- 样本特征

## TOOL

- A/B Test
- Regression
- Difference-in-Differences
- Matching
- Synthetic Control
- Python / R / SQL

## OUTPUT

- Incremental Effect Estimate
- 机制假设的支持 / 反驳证据
- 实验置信区间与不确定性
- 下一轮实验设计

## PITFALLS

- 把 Correlation 当 Causation
- Control Group 本身不可比
- 干预前趋势完全不同却直接做 DiD
- 同期存在其他重大策略变化却未控制
- 只报告“显著 / 不显著”，不看效应大小和业务价值
