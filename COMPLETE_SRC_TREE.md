# ECHO-2027 完整源码目录树

> 生成时间：2026-08-11  
> 总计：58个TypeScript/TSX文件

---

```
trendflow/src/
│
├── app/                              # Next.js App Router页面与API
│   ├── page.tsx                      # 首页
│   ├── layout.tsx                    # 根布局
│   ├── globals.css                   # 全局样式
│   │
│   ├── accounts/                     # 账号矩阵管理
│   │   └── page.tsx
│   │
│   ├── aeo/                          # ⭐ AEO优化引擎（新增）
│   │   ├── page.tsx                  # AEO工作台
│   │   ├── authority/
│   │   │   └── page.tsx              # 权威来源分析
│   │   ├── discover/
│   │   │   └── page.tsx              # AI可发现性检测
│   │   └── sites/
│   │       └── page.tsx              # 权威站点矩阵
│   │
│   ├── affiliate/                    # 商品库管理
│   │   └── page.tsx
│   │
│   ├── command/                      # 指挥中心
│   │   └── page.tsx
│   │
│   ├── dashboard/                    # 收益仪表盘
│   │   └── page.tsx
│   │
│   ├── discover/                     # 热点发现
│   │   └── page.tsx
│   │
│   ├── evolve/                       # 自我进化
│   │   └── page.tsx
│   │
│   ├── generate/                     # 内容生成
│   │   └── page.tsx
│   │
│   ├── intel/                        # 竞争情报
│   │   └── page.tsx
│   │
│   ├── nexus/                        # Nexus神经中枢
│   │   └── page.tsx
│   │
│   ├── publish/                      # 发布管理
│   │   └── page.tsx
│   │
│   ├── scheduler/                    # 定时任务
│   │   └── page.tsx
│   │
│   ├── templates/                    # 模板库
│   │   └── page.tsx
│   │
│   └── api/                          # API路由层（24个接口）
│       ├── accounts/route.ts         # 账号管理
│       ├── aeo/
│       │   ├── simulate/route.ts     # AI引用模拟 ⭐
│       │   └── track/route.ts        # 效果追踪 ⭐
│       ├── affiliate/
│       │   ├── inject/route.ts       # 变现注入
│       │   └── products/route.ts     # 商品列表
│       ├── authority/route.ts        # 权威分析 ⭐
│       ├── command/generate/route.ts
│       ├── cron/trends/route.ts
│       ├── dashboard/stats/route.ts
│       ├── discover/route.ts
│       ├── evolve/route.ts
│       ├── export/route.ts
│       ├── factory/generate/route.ts # 工厂批量生成
│       ├── generate/route.ts
│       ├── intel/
│       │   ├── analyze/route.ts
│       │   ├── distribute/route.ts
│       │   └── surround/route.ts
│       ├── intercept/hotspot/route.ts
│       ├── nexus/
│       │   ├── distribute/route.ts
│       │   ├── produce/route.ts
│       │   └── sense/route.ts
│       ├── publish/route.ts
│       ├── test/route.ts
│       ├── tracker/route.ts          # 数据埋点 ⭐
│       ├── trends/china/route.ts
│       └── webhook/
│           ├── feedback/route.ts
│           ├── generate/route.ts
│           ├── monetize/route.ts
│           └── variate/route.ts
│
├── components/                       # UI组件层
│   ├── Sidebar.tsx                   # 侧边栏导航
│   ├── ComplianceBanner.tsx          # 合规声明
│   └── ui/
│       ├── index.ts
│       ├── button.tsx
│       ├── card.tsx
│       ├── select.tsx
│       └── textarea.tsx
│
└── lib/                              # 核心业务逻辑层 ⭐重点
    ├── aeo-engine.ts                 # ⭐ AEO核心引擎 (565行)
    ├── battle-content-generator.ts   # ⭐ 实战内容生成 (263行)
    ├── nexus-data-flow.ts            # ⭐ 数据流管理 (141行)
    ├── data-tracker.ts               # ⭐ 数据埋点 (260行)
    ├── authority-content-generator.ts
    ├── intelligence-engine.ts
    ├── nexus-keywords.ts             # 500+关键词库
    ├── nexus-types.ts
    ├── trending-keywords.ts
    ├── affiliate-types.ts
    ├── affiliate-utils.ts
    └── utils.ts
```

---

## 📊 统计信息

### 文件数量
| 类别 | 数量 |
|-----|------|
| 页面组件 | 14个 |
| API路由 | 24个 |
| UI组件 | 8个 |
| 核心库 | 12个 |
| **总计** | **58个** |

### 代码行数（核心文件）
| 文件 | 行数 | 功能 |
|-----|------|------|
| aeo-engine.ts | 565 | AEO评分算法+Schema生成 |
| battle-content-generator.ts | 263 | 30篇内容批量生成 |
| data-tracker.ts | 260 | 全链路埋点追踪 |
| nexus-data-flow.ts | 141 | 数据聚合分析 |
| **小计** | **1,229** | **ECHO-2027核心** |

### ECHO-2027新增标记 ⭐
```
✅ 新增页面：4个 (aeo/*, dashboard新版)
✅ 新增API：6个 (aeo/simulate, aeo/track, authority, tracker, factory)
✅ 新增核心库：4个 (共1,229行)
```

---

## 🎯 架构层次

```
┌─────────────────────────────────────────────────────┐
│  Presentation Layer (表现层)                         │
│  src/app/**/*.tsx - 14个页面组件                      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Interface Layer (接口层)                            │
│  src/app/api/**/*.ts - 24个API端点                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Core Layer (核心层) ⭐                              │
│  src/lib/*.ts - 12个核心库，包含AEO引擎、生成器等      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  Component Layer (组件层)                            │
│  src/components/* - 8个UI基础组件                    │
└─────────────────────────────────────────────────────┘
```

---

*目录树生成完成*
