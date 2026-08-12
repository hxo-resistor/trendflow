# ECHO-2027 完整源码目录树

> 生成时间：2026-08-11 02:40 GMT+8  
> 总计：约130个文件

---

## 📁 src/app/ (页面与API)

### 页面组件 (14个)
```
src/app/
├── page.tsx                     # 首页
├── layout.tsx                   # 根布局
├── globals.css                  # 全局样式
│
├── accounts/
│   └── page.tsx                 # 账号矩阵管理
│
├── aeo/                         # AEO优化引擎（新增）
│   ├── page.tsx                 # AEO工作台
│   ├── authority/
│   │   └── page.tsx             # 权威来源分析
│   ├── discover/
│   │   └── page.tsx             # AI可发现性检测
│   └── sites/
│       └── page.tsx             # 权威站点矩阵
│
├── affiliate/
│   └── page.tsx                 # 商品库管理
│
├── api/                         # API路由（24个）
│   ├── accounts/
│   │   └── route.ts             # 账号管理API
│   ├── aeo/
│   │   ├── simulate/
│   │   │   └── route.ts         # AI引用模拟
│   │   └── track/
│   │       └── route.ts         # 效果追踪
│   ├── affiliate/
│   │   ├── inject/
│   │   │   └── route.ts         # 变现注入
│   │   └── products/
│   │       └── route.ts         # 商品列表
│   ├── authority/
│   │   └── route.ts             # 权威分析
│   ├── command/
│   │   └── generate/
│   │       └── route.ts         # 指挥中心生成
│   ├── cron/
│   │   └── trends/
│   │       └── route.ts         # 定时趋势刷新
│   ├── dashboard/
│   │   └── stats/
│   │       └── route.ts         # 仪表盘统计
│   ├── discover/
│   │   └── route.ts             # 热点发现
│   ├── evolve/
│   │   └── route.ts             # 自我进化
│   ├── export/
│   │   └── route.ts             # 导出功能
│   ├── factory/
│   │   └── generate/
│   │       └── route.ts         # 工厂批量生成
│   ├── generate/
│   │   └── route.ts             # 内容生成
│   ├── intel/
│   │   ├── analyze/
│   │   │   └── route.ts         # 竞争分析
│   │   ├── distribute/
│   │   │   └── route.ts         # 分发策略
│   │   └── surround/
│   │       └── route.ts         # 内容包围
│   ├── intercept/
│   │   └── hotspot/
│   │       └── route.ts         # 热点截流
│   ├── nexus/
│   │   ├── distribute/
│   │   │   └── route.ts         # 矩阵分发
│   │   ├── produce/
│   │   │   └── route.ts         # 蜂群生产
│   │   └── sense/
│   │       └── route.ts         # 情报感知
│   ├── publish/
│   │   └── route.ts             # 发布管理
│   ├── test/
│   │   └── route.ts             # 测试接口
│   ├── tracker/
│   │   └── route.ts             # 数据埋点
│   ├── trends/
│   │   └── china/
│   │       └── route.ts         # 中国趋势
│   └── webhook/
│       ├── feedback/
│       │   └── route.ts         # 反馈接收
│       ├── generate/
│       │   └── route.ts         # 外部生成
│       ├── monetize/
│       │   └── route.ts         # 变现通知
│       └── variate/
│           └── route.ts         # 内容变异
│
├── command/
│   └── page.tsx                 # 指挥中心
│
├── dashboard/
│   └── page.tsx                 # 收益仪表盘（新版）
│
├── discover/
│   └── page.tsx                 # 热点发现
│
├── evolve/
│   └── page.tsx                 # 自我进化
│
├── generate/
│   └── page.tsx                 # 内容生成
│
├── intel/
│   └── page.tsx                 # 竞争情报
│
├── nexus/
│   └── page.tsx                 # Nexus神经中枢
│
├── publish/
│   └── page.tsx                 # 发布管理
│
├── scheduler/
│   └── page.tsx                 # 定时任务
│
└── templates/
    └── page.tsx                 # 模板库
```

---

## 📁 src/components/ (UI组件)

```
src/components/
├── Sidebar.tsx                  # 侧边栏导航
├── ComplianceBanner.tsx         # 合规声明横幅
└── ui/
    ├── index.ts                 # UI组件索引
    ├── button.tsx               # Button组件
    ├── card.tsx                 # Card组件
    ├── select.tsx               # Select组件
    └── textarea.tsx             # Textarea组件
```

---

## 📁 src/lib/ (核心库)

```
src/lib/
├── aeo-engine.ts                # AEO核心引擎 ⭐(565行)
├── battle-content-generator.ts  # 实战内容生成器 ⭐(263行)
├── nexus-data-flow.ts           # 数据流管理 ⭐(141行)
├── data-tracker.ts              # 数据埋点 ⭐(260行)
├── authority-content-generator.ts # 权威内容生成
├── intelligence-engine.ts       # 智能内容引擎
├── nexus-keywords.ts            # 关键词库(500+)
├── nexus-types.ts               # 类型定义
├── trending-keywords.ts         # 趋势关键词
├── affiliate-types.ts           # Affiliate类型
├── affiliate-utils.ts           # Affiliate工具函数
└── utils.ts                     # 通用工具函数
```

---

## 📊 文件统计

### 按类型统计
| 类型 | 数量 | 说明 |
|-----|------|------|
| **页面组件** | 14个 | .tsx页面文件 |
| **API路由** | 24个 | route.ts接口 |
| **UI组件** | 6个 | 基础组件库 |
| **核心库** | 12个 | 业务逻辑层 |
| **总计** | **56个** | TypeScript/TSX文件 |

### 按模块统计
```
src/app/
├── 页面: 14个
├── API:  24个
└── 其他: 2个

src/components/
├── 页面: 2个
└── UI:   6个

src/lib/
├── 核心: 12个
└── 总计: 34个
```

---

## 🔑 ECHO-2027 新增模块（深蓝色标记）

### 新增页面
- [ ] `/aeo` - AEO优化工作台
- [ ] `/aeo/sites` - 权威站点矩阵
- [ ] `/aeo/authority` - 权威来源分析
- [ ] `/aeo/discover` - AI可发现性检测

### 新增API
- [ ] `/api/aeo/simulate` - AI引用模拟
- [ ] `/api/aeo/track` - 效果追踪
- [ ] `/api/authority` - 权威分析
- [ ] `/api/tracker` - 数据埋点

### 新增核心库
- [ ] `aeo-engine.ts` - AEO核心引擎 (565行)
- [ ] `battle-content-generator.ts` - 实战内容生成 (263行)
- [ ] `nexus-data-flow.ts` - 数据流管理 (141行)
- [ ] `data-tracker.ts` - 数据埋点 (260行)

---

## 📈 代码规模对比

| 阶段 | 页面数 | API数 | 核心库 | 总代码行 |
|-----|-------|-------|-------|---------|
| **TrendFlow v1.0** | 8个 | 12个 | 4个 | ~2,000行 |
| **Nexus v3.0** | 12个 | 18个 | 8个 | ~3,500行 |
| **ECHO-2027 v3.4** | 14个 | 24个 | 12个 | ~5,000+行 |

**增长幅度：**
- 页面数：+75%
- API数：+100%
- 核心库：+200%
- 代码量：+150%

---

## 🎯 架构分层

```
┌─────────────────────────────────────────────────────┐
│                    表现层 (Presentation)             │
│  src/app/*/page.tsx (14个页面组件)                   │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                    接口层 (Interface)                │
│  src/app/api/*/route.ts (24个API路由)               │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                    核心层 (Core)                     │
│  src/lib/* (12个核心库)                             │
│  ├── aeo-engine.ts      - AEO评分与优化             │
│  ├── battle-content-generator.ts - 批量生成          │
│  ├── nexus-data-flow.ts - 数据流管理                │
│  └── data-tracker.ts    - 全链路埋点                │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                    组件层 (Components)               │
│  src/components/* (8个UI组件)                       │
└─────────────────────────────────────────────────────┘
```

---

*目录树生成完成*  
*总计：56个TypeScript/TSX文件*
