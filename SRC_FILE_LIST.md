# 完整源码文件列表

## src/app/ 页面与API (56个文件)

### 页面组件 (14个)
```
src/app/page.tsx
src/app/layout.tsx
src/app/globals.css
src/app/accounts/page.tsx
src/app/aeo/page.tsx
src/app/aeo/authority/page.tsx
src/app/aeo/discover/page.tsx
src/app/aeo/sites/page.tsx
src/app/affiliate/page.tsx
src/app/command/page.tsx
src/app/dashboard/page.tsx
src/app/discover/page.tsx
src/app/evolve/page.tsx
src/app/generate/page.tsx
src/app/intel/page.tsx
src/app/nexus/page.tsx
src/app/publish/page.tsx
src/app/scheduler/page.tsx
src/app/templates/page.tsx
```

### API路由 (24个)
```
src/app/api/accounts/route.ts
src/app/api/aeo/simulate/route.ts
src/app/api/aeo/track/route.ts
src/app/api/affiliate/inject/route.ts
src/app/api/affiliate/products/route.ts
src/app/api/authority/route.ts
src/app/api/command/generate/route.ts
src/app/api/cron/trends/route.ts
src/app/api/dashboard/stats/route.ts
src/app/api/discover/route.ts
src/app/api/evolve/route.ts
src/app/api/export/route.ts
src/app/api/factory/generate/route.ts
src/app/api/generate/route.ts
src/app/api/intel/analyze/route.ts
src/app/api/intel/distribute/route.ts
src/app/api/intel/surround/route.ts
src/app/api/intercept/hotspot/route.ts
src/app/api/nexus/distribute/route.ts
src/app/api/nexus/produce/route.ts
src/app/api/nexus/sense/route.ts
src/app/api/publish/route.ts
src/app/api/test/route.ts
src/app/api/tracker/route.ts
src/app/api/trends/china/route.ts
src/app/api/webhook/feedback/route.ts
src/app/api/webhook/generate/route.ts
src/app/api/webhook/monetize/route.ts
src/app/api/webhook/variate/route.ts
```

---

## src/components/ UI组件 (8个)
```
src/components/Sidebar.tsx
src/components/ComplianceBanner.tsx
src/components/ui/index.ts
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/select.tsx
src/components/ui/textarea.tsx
```

---

## src/lib/ 核心库 (12个) ⭐重点
```
src/lib/aeo-engine.ts                    ← 565行 AEO核心引擎
src/lib/battle-content-generator.ts      ← 263行 实战内容生成器
src/lib/nexus-data-flow.ts               ← 141行 数据流管理
src/lib/data-tracker.ts                  ← 260行 数据埋点追踪
src/lib/authority-content-generator.ts
src/lib/intelligence-engine.ts
src/lib/nexus-keywords.ts                ← 500+关键词库
src/lib/nexus-types.ts
src/lib/trending-keywords.ts
src/lib/affiliate-types.ts
src/lib/affiliate-utils.ts
src/lib/utils.ts
```

---

## ECHO-2027 新增模块标记 ⭐

### 新增页面 (4个)
- [x] `src/app/aeo/page.tsx` - AEO优化工作台
- [x] `src/app/aeo/sites/page.tsx` - 权威站点矩阵
- [x] `src/app/aeo/authority/page.tsx` - 权威来源分析
- [x] `src/app/aeo/discover/page.tsx` - AI可发现性检测
- [x] `src/app/dashboard/page.tsx` - 收益仪表盘（新版）

### 新增API (6个)
- [x] `src/app/api/aeo/simulate/route.ts`
- [x] `src/app/api/aeo/track/route.ts`
- [x] `src/app/api/authority/route.ts`
- [x] `src/app/api/tracker/route.ts`
- [x] `src/app/api/factory/generate/route.ts`
- [x] `src/app/api/nexus/*` (3个)

### 新增核心库 (4个) ⭐⭐⭐
- [x] `src/lib/aeo-engine.ts` (565行)
- [x] `src/lib/battle-content-generator.ts` (263行)
- [x] `src/lib/nexus-data-flow.ts` (141行)
- [x] `src/lib/data-tracker.ts` (260行)

---

## 统计汇总

| 类别 | 数量 |
|-----|------|
| 页面组件 | 14个 |
| API路由 | 24个 |
| UI组件 | 8个 |
| 核心库 | 12个 |
| **总计** | **58个** |

**ECHO-2027新增：**
- 页面：4个
- API：6个
- 核心库：4个（共1,229行）
