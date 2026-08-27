---
id: amazon-distribution
title: Amazon 流量分发
title_en: Amazon Traffic Distribution
slug: amazon-distribution
domain: platform
type: mechanism
tags:
  - Amazon
  - Platform Distribution
  - Search
  - Advertising
aliases:
  - Amazon Traffic Distribution
  - Amazon 流量机制
summary: 把 Amazon 看作一个由搜索、广告、推荐和商品详情页等多个分发系统组成的黑箱，并通过可观测数据与实验逼近其响应机制。
related:
  - black-box-system
  - causal-inference
  - experiment
playbooks:
  - amazon-traffic-diagnosis
cases:
  - amazon-traffic-intelligence
sources:
  - https://advertising.amazon.com/help/G7AQQUSFVZPAAXEU
  - https://advertising.amazon.com/resources/whats-new/search-term-impression-report-sponsored-products
created_at: 2026-08-18
updated_at: 2026-08-18
---

## WHAT

Amazon 流量分发不是一个单一算法，而是一组不同入口共同决定商品曝光的系统，包括自然搜索、Sponsored Products、商品详情页推荐、活动 / Deals、再营销等。卖家无法看到平台源码，但可以通过曝光、点击、搜索词份额、广告位置、转化和排名变化去观察系统响应。

## WHY

只看广告 ROAS 容易把“需求问题、分发问题、点击问题、转化问题”混在一起。研究平台分发后，可以先判断流量到底在哪一层丢失，再决定是调 Bid、优化 PDP、改价格、补库存还是重新做关键词与投放结构。

## HOW

1. **画入口地图**：区分自然搜索、广告搜索位、Product Page、推荐和活动流量。
2. **确定可观测信号**：Impression、Click、Purchase、SIS、Placement、Organic Rank 等。
3. **建立 Funnel**：Demand → Distribution → Click → Cart → Purchase。
4. **找到可操纵变量**：Bid、Budget、Placement、Price、Coupon、Title、Main Image、Targeting。
5. **做干预实验**：一次只改变少量关键变量，观察响应曲线。
6. **控制干扰**：季节、大促、竞品缺货、价格变化、Review 增长等。
7. **跨时间 / ASIN / Query 重复验证**，避免一次变化就下算法结论。

## DATA

- Search Query Performance / Search Catalog Performance（如账户可用）
- Search Term Impression Share（SIS）
- Sponsored Products Placement
- Search Term / Targeting Report
- Sales / GMV / Order
- Organic Rank / BSR
- Price / Coupon / Inventory / Review

## TOOL

- Amazon Ads Console
- Seller Central / Brand Analytics
- Excel / SQL / BI
- Experiment Tracker

## OUTPUT

- Traffic Source Map
- 流量下降根因判断
- Query / ASIN 分发诊断
- Bid / Placement Response Curve
- 广告与自然流量联动假设
- 可验证的下一轮实验

## PITFALLS

- 把“相关性”直接说成“Amazon 算法权重”
- 广告增加后自然流量也涨，就直接认定广告提升自然排名
- 不控制促销、季节、竞品库存等共同变量
- 只看总 ROAS，不看每一层的流量份额和转化效率

> Amazon 的 Search Term Impression Share 报告可以按搜索词观察账户获得的广告曝光份额与相对排名，并用于观察 Bid、Targeting、Budget 变化后曝光份额如何响应。
