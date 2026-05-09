---
version: 1
product: pharmacist-ai-coach-miniprogram
platform: wechat-miniprogram
source-of-truth:
  product: agent.md
  ui-reference: uploaded-8-screen-prototype
principles:
  - high-density-training-workspace
  - medical-blue-trust
  - clear-risk-feedback
  - no-marketing-hero
  - service-boundary-first
tokens:
  color:
    primary: "#1769FF"
    primary-strong: "#0B5CFF"
    primary-soft: "#E8F1FF"
    primary-gradient-start: "#1769FF"
    primary-gradient-middle: "#3D8CFF"
    primary-gradient-end: "#72AAFF"
    background-page: "#F4F8FF"
    background-surface: "#FFFFFF"
    background-soft-blue: "#F8FBFF"
    border-default: "#E1EAF7"
    border-soft: "#E8EEF8"
    text-primary: "#111827"
    text-secondary: "#64748B"
    text-muted: "#8A96A8"
    success: "#18BF74"
    success-soft: "#E8FFF4"
    warning: "#FF9B21"
    warning-soft: "#FFF8ED"
    danger: "#EF4444"
    danger-soft: "#FFF1ED"
    purple: "#7569FF"
    cyan: "#22B8CF"
  typography:
    font-family:
      - "-apple-system"
      - "BlinkMacSystemFont"
      - "PingFang SC"
      - "Helvetica Neue"
      - "Arial"
      - "sans-serif"
    nav-title:
      size: "27rpx"
      weight: 800
      line-height: 1.25
    screen-title:
      size: "30rpx"
      weight: 900
      line-height: 1.25
    section-title:
      size: "24rpx"
      weight: 800
      line-height: 1.35
    body:
      size: "23rpx"
      weight: 500
      line-height: 1.5
    label:
      size: "20rpx"
      weight: 700
      line-height: 1.25
    micro:
      size: "18rpx"
      weight: 700
      line-height: 1.25
  layout:
    design-width: "750rpx"
    header-height: "120rpx"
    bottom-nav-height: "100rpx"
    page-padding-x: "24rpx"
    page-padding-top: "16rpx"
    card-gap-compact: "12rpx"
    card-gap-default: "14rpx"
    card-gap-loose: "16rpx"
    row-height-compact: "50rpx"
    row-height-default: "56rpx"
    touch-target-min: "44rpx"
  radius:
    xs: "8rpx"
    sm: "10rpx"
    md: "12rpx"
    card: "14rpx"
    card-large: "16rpx"
    hero: "16rpx"
    pill: "99rpx"
  shadow:
    card: "0 10rpx 24rpx rgba(30, 64, 175, 0.05)"
    card-raised: "0 12rpx 30rpx rgba(30, 64, 175, 0.06)"
    hero: "0 18rpx 38rpx rgba(23, 105, 255, 0.22)"
    bottom-nav: "0 -8rpx 24rpx rgba(30, 64, 175, 0.05)"
  component:
    hero-card:
      height: "176rpx"
      radius: "16rpx"
      background: "linear-gradient(135deg, #1769FF 0%, #3D8CFF 55%, #72AAFF 100%)"
    category-card:
      height: "100rpx"
      radius: "13rpx"
    scenario-row:
      min-height: "50rpx"
    test-row:
      min-height: "96rpx"
    path-card:
      min-height: "174rpx"
---

# Pharmacist AI Coach Design System

## Overview

`DESIGN.md` 是本微信小程序的视觉与交互设计源文件。`agent.md` 定义产品定位、医学服务边界和训练业务规则；本文档定义界面如何看起来、如何排版、如何保持一致。

本设计系统抽象自 8 屏原型图：训练首页、训练场景列表、文字角色扮演、语音通话训练、测试首页、测试报告、我的成长、知识库/路径卡。整体方向是“高密度、可信赖、医疗蓝、训练工具感”，不是营销落地页。

设计目标：

- 让药师快速识别训练入口、场景进度、风险提示和下一步动作。
- 在小屏幕里保持高信息密度，但不牺牲可读性和触达面积。
- 用稳定的颜色、圆角、阴影和间距，减少后续 UI 迭代的视觉漂移。
- 医疗风险和合规边界必须同时用颜色、文字和结构表达，不能只靠颜色。

## Colors

主色使用可信赖的医疗蓝。蓝色只用于关键行动、训练重点、激活态、进度、图表强调和导航当前态。

| Token | Value | Usage |
| --- | --- | --- |
| `primary` | `#1769FF` | 主按钮、底部导航激活态、进度、图表线条 |
| `primary-soft` | `#E8F1FF` | 蓝色标签、轻量信息背景、选中态弱背景 |
| `background-page` | `#F4F8FF` | 页面底色 |
| `background-surface` | `#FFFFFF` | 卡片、弹层、输入区 |
| `background-soft-blue` | `#F8FBFF` | 重点卡、路径卡、提示区 |
| `border-default` | `#E1EAF7` | 卡片边框、列表分隔 |
| `text-primary` | `#111827` | 标题、核心数字、重要正文 |
| `text-secondary` | `#64748B` | 次级说明、元信息 |
| `text-muted` | `#8A96A8` | 禁用态、未开始、辅助提示 |
| `success` | `#18BF74` | 已完成、正确、良好表现 |
| `warning` | `#FF9B21` | 部分正确、复查提醒、需关注 |
| `danger` | `#EF4444` | CRS/ICANS、严重风险、错误动作 |
| `purple` | `#7569FF` | 初次建档、患者角色、徽章辅助色 |
| `cyan` | `#22B8CF` | 医保支付、结疗复查等辅助分类 |

Do:

- 保持页面大面积为白色和浅蓝，避免沉重背景。
- 状态色必须配合文字，例如“风险识别”“部分正确”“警惕 CRS/ICANS”。
- Hero 卡片可以使用蓝色渐变，但页面背景和普通卡片不得大面积使用渐变。

Don't:

- 不要把所有卡片都染成蓝色。
- 不要用红色表达普通提醒；红色只用于明确风险或危险动作。
- 不要仅靠颜色区分医学风险或训练结果。

## Typography

字体栈使用微信小程序和 iOS/Android 都稳妥的系统字体：

```css
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
```

类型层级：

| Role | Size | Weight | Usage |
| --- | --- | --- | --- |
| Navigation title | `27rpx` | `800` | 页面顶部标题 |
| Screen title / hero number | `30-58rpx` | `800-900` | 页面主标题、关键分数、完成数量 |
| Section title | `24rpx` | `800` | 训练分类、维度得分、重点回顾 |
| Body | `23rpx` | `500-700` | 聊天气泡、路径说明、列表正文 |
| Label | `20rpx` | `700-800` | 状态胶囊、卡片说明、底部导航 |
| Micro | `18rpx` | `700-800` | 元信息、时间、标签 |

中文界面中不要使用负字距。小卡片内标题必须短、硬朗、可扫描；避免长段落占满卡片。

## Layout

基础画布按 750rpx 小程序设计宽度组织。所有页面应匹配截图里的 iPhone 视觉密度。

Core layout:

- 顶部自定义状态栏 + 导航栏总高：`120rpx`
- 底部导航高度：`100rpx`
- 页面横向 padding：`24rpx`
- 页面顶部 padding：`16rpx`
- 卡片默认间距：`14rpx`
- 紧凑列表间距：`12rpx`
- 常规 row 最小触达高度：`50-56rpx`

页面结构：

- 首页：hero 卡片、训练分类 3x2 宫格、重点卡、正确率卡。
- 场景列表：顶部筛选、分组卡片、紧凑 row、右侧状态胶囊。
- 角色扮演：聊天区、表现提示卡、输入栏、底部导航。
- 语音训练：通话状态、头像/波形、沟通提示卡、通话操作区。
- 测试首页：垂直测试任务列表，单行强入口。
- 测试报告：总分卡、维度得分、重点回顾。
- 我的成长：身份卡、4 个指标、成长曲线、徽章。
- 路径卡：蓝/绿/橙三类医学路径卡。

Do:

- 优先用卡片和 row 承载信息，保持单屏可见内容多。
- 卡片之间保持一致的垂直节奏，不要随页面随意变大。
- 底部固定导航的页面内容必须预留底部 padding。

Don't:

- 不要使用营销页式大 hero、整屏欢迎语或空洞插画。
- 不要把多个卡片嵌套成“卡片套卡片”。
- 不要让固定输入栏、提示卡和底部导航互相遮挡。

## Elevation & Depth

界面使用轻阴影表达层级，不做厚重拟物感。

| Token | Value | Usage |
| --- | --- | --- |
| `card` | `0 10rpx 24rpx rgba(30, 64, 175, 0.05)` | 普通卡片 |
| `card-raised` | `0 12rpx 30rpx rgba(30, 64, 175, 0.06)` | 列表面板、报告卡、身份卡 |
| `hero` | `0 18rpx 38rpx rgba(23, 105, 255, 0.22)` | 首页 hero 主卡 |
| `bottom-nav` | `0 -8rpx 24rpx rgba(30, 64, 175, 0.05)` | 底部导航 |

只有真正浮在内容上的元素才使用 raised shadow，例如聊天页表现提示卡。普通列表 row 不单独加重阴影。

## Shapes

圆角体系要克制，符合工作型训练 App 的紧凑感。

| Token | Value | Usage |
| --- | --- | --- |
| `xs` | `8rpx` | 小图标、编号块 |
| `sm` | `10rpx` | 小状态胶囊 |
| `md` | `12rpx` | 输入框、按钮、提示标签 |
| `card` | `14rpx` | 标准卡片 |
| `card-large` | `16rpx` | 主卡、列表面板、报告卡 |
| `hero` | `16rpx` | 首页主视觉卡 |
| `pill` | `99rpx` | 进度条、圆形/胶囊标签 |

不要把所有卡片都做成 24rpx 以上的大圆角。截图语言是精致、轻量、专业，不是儿童化或社交娱乐化。

## Components

### App Header

顶部包含模拟状态栏、居中标题、左侧返回和右侧动作。标题始终居中，右侧筛选按钮使用浅蓝边框胶囊。

Rules:

- 标题不换行。
- 返回使用简单左箭头，不加文字。
- 右侧只放一个动作：筛选、更多、收藏、通知或分享。

### Bottom Navigation

底部导航包含训练、测试、我的三项。当前态使用 `primary`，非当前态使用 muted gray。

Rules:

- 高度固定为 `100rpx`。
- 图标在上、文字在下。
- 训练页族和路径卡都高亮“训练”；测试报告高亮“测试”；成长页高亮“我的”。

### Hero Card

首页 hero card 展示今日完成进度。它是唯一允许使用主蓝渐变的大卡片。

Rules:

- 高度固定为 `176rpx`。
- 左侧为完成数和进度条，右侧为医生头像。
- 进度条必须有数值文字，不只用视觉条。

### Category Grid

训练分类为 3x2 宫格。

Rules:

- 单卡高度 `100rpx`。
- 图标色与分类语义对应。
- 文案保持 4 字以内，避免换行。

### Scenario Row

场景列表使用分组标题 + 紧凑 row。

Rules:

- row 最小高度 `50rpx`。
- 左侧编号块，中间场景名，右侧状态胶囊。
- 状态包括已完成、进行中、未开始；不要使用长句。

### Chat Bubble

文字角色扮演页用左右对话气泡区分 AI 患者和药师。

Rules:

- AI 患者靠左，浅灰气泡；药师靠右，白色卡片气泡。
- 气泡正文用 `23-25rpx`，行高不低于 `1.5`。
- 底部表现提示卡必须位于输入栏上方，不遮挡输入。

### Voice Training

语音页以患者头像、波形和提示卡建立通话感。

Rules:

- 通话状态显示在右上，使用蓝色弱背景。
- 提示卡为纵向列表，风险项使用 danger。
- 结束通话按钮使用红色圆形，其他操作保持黑/灰。

### Test Row

测试首页是 5 个任务 row。

Rules:

- 单行最小高度 `96rpx`。
- 左侧彩色图标，中间标题和标签，右侧箭头。
- 标签包含题量、限时、模拟真实患者。

### Report Card

测试报告优先展示总分，然后展示维度和重点回顾。

Rules:

- 总分圆环使用 primary。
- “良好”等评级使用 success。
- 部分正确使用 warning；错误或高风险使用 danger。

### Growth Dashboard

我的页面展示身份、关键指标、成长曲线、徽章。

Rules:

- 4 个指标必须保持同一高度。
- 成长曲线只使用 primary，不叠加多色折线。
- 徽章列表保持轻量，不做复杂成就系统。

### Path Cards

DLBCL 路径卡使用 3 张语义卡：1L 蓝色、R/R 绿色、复查橙色。

Rules:

- 每张卡包含图标、标题和要点列表。
- 医学缩写可保留，如 `1L`、`R/R`、`CRS/ICANS`。
- 复查和风险内容必须保留文字说明，不只用图标。

## Do's and Don'ts

Do:

- 先查 `DESIGN.md` tokens，再新增或修改页面样式。
- 保持小程序工作台式的信息密度。
- 保持蓝白医疗训练风格，绿色/橙色/红色只作状态辅助。
- 用卡片、状态胶囊和紧凑列表表达训练任务。
- 医疗风险提示必须清楚、可读、可操作。
- 新增页面时复用现有 header、bottom nav、card、row、pill 语言。

Don't:

- 不要引入大面积紫色、深色、橙色或单一色系主题。
- 不要把首页做成营销落地页。
- 不要使用随机插画、外链图片或不可控生成图作为核心 UI。
- 不要新增超大圆角、厚阴影、玻璃拟态或装饰性背景。
- 不要让文本溢出按钮、标签、卡片或底部导航。
- 不要用颜色替代医学或合规说明。

## Implementation Notes

当前代码中的主要映射：

- 全局背景、字体和页面 padding：`miniprogram/app.scss`
- 顶部状态栏和导航：`miniprogram/components/app-header`
- 底部导航：`miniprogram/components/bottom-nav`
- 8 屏页面：`miniprogram/pages/index`、`scenes`、`chat`、`voice`、`tests`、`report`、`profile`、`path`
- 业务和展示 mock：`miniprogram/utils/mock-data.ts`

后续 UI 迭代流程：

1. 先判断需求属于视觉系统、业务内容还是医学边界。
2. 医学边界查 `agent.md`。
3. 视觉系统查 `DESIGN.md`。
4. 如果需要新增视觉规则，先更新 token 或组件规则，再改页面样式。
5. 改完至少检查 8 屏中相同组件是否仍然一致。
