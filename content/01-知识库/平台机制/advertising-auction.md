---
id: auction
title: 广告拍卖机制
title_en: Advertising Auction
slug: advertising-auction
domain: platform
type: mechanism
tags:
  - Ads
  - Auction
aliases: []
summary: "平台根据竞价、预估效果与质量等信号动态决定广告是否展示、展示在哪以及支付多少。"
related:
  - amazon-distribution
  - meta
  - response-curve
playbooks:
  - amazon-traffic-diagnosis
cases:
  - amazon-traffic-intelligence
sources: []
created_at: 2026-08-18
updated_at: 2026-08-18
---

## WHAT

广告拍卖是平台在每次可展示机会中对候选广告进行排序与定价的机制，出价通常只是其中一个输入。

## WHY

理解拍卖机制后，才能把 Bid、预算、素材、转化率和 Placement 看成同一个分发系统中的不同杠杆。

## HOW

1. 明确拍卖入口和竞争集合。
2. 观察 Bid、CPC 与曝光份额。
3. 记录质量和转化相关信号。
4. 分层测试不同出价。
5. 形成流量响应曲线。
