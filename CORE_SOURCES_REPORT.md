# ECHO-2027 核心源代码清单

> 生成时间：2026-08-11 02:35 GMT+8  
> 总计：6个核心文件，约1,650行代码

---

## 📁 文件概览

| # | 文件路径 | 行数 | 大小 | 功能 |
|---|---------|------|------|------|
| 1 | `src/lib/aeo-engine.ts` | 565行 | 15.6KB | AEO核心引擎 |
| 2 | `src/lib/battle-content-generator.ts` | 263行 | 7.3KB | 实战内容生成器 |
| 3 | `src/lib/nexus-data-flow.ts` | 141行 | 4.4KB | 数据流管理 |
| 4 | `src/lib/data-tracker.ts` | 260行 | 6.3KB | 数据埋点追踪 |
| 5 | `src/app/aeo/page.tsx` | 297行 | 15.2KB | AEO优化工作台 |
| 6 | `src/app/dashboard/page.tsx` | 317行 | 12.1KB | 收益仪表盘 |

**总计：约1,843行核心代码**

---

## 1️⃣ src/lib/aeo-engine.ts (565行)

### 功能概述
AEO（AI Engine Optimization）核心引擎，负责：
- 内容权威度评分（0-100分）
- Schema结构化数据生成
- 内容优化建议
- AI引用预测

### 核心接口

```typescript
// AEO分析结果
interface AEOAnalysis {
  content: string              // 原文内容
  keyword: string             // 目标关键词
  aeoScore: number            // 综合得分 0-100
  authorityScore: number      // 权威度得分
  structureScore: number      // 结构得分
  dataDensityScore: number    // 数据密度得分
  freshnessScore: number      // 新鲜度得分
  optimizationSuggestions: OptimizationSuggestion[]
  schemaMarkup: AEOSchema[]   // Schema标记数组
  optimizedContent: string    // 优化后内容
}

// Schema标记类型
interface AEOSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  // ... 其他Schema.org字段
}
```

### 核心函数

```typescript
// 主分析函数
analyzeContentForAEO(content: string, keyword: string): AEOAnalysis

// 子分析函数
analyzeTitleStructure(content, keyword)     // 标题分析
analyzeDataDensity(content)                  // 数据密度
analyzeCitations(content)                    // 引用来源
analyzeContentStructure(content)            // 内容结构
analyzeFreshness(content)                   // 新鲜度评估

// Schema生成
generateSchemaMarkup(content, keyword, analysis): AEOSchema[]

// 内容优化
optimizeContentForAEO(content, keyword, analysis): string
```

### 评分算法

```
AEO分数 = 
  authorityScore × 0.35 +    // 权威度（标题+引用）
  dataDensityScore × 0.25 +  // 数据密度
  structureScore × 0.20 +    // 内容结构
  freshnessScore × 0.20      // 时效性
```

---

## 2️⃣ src/lib/battle-content-generator.ts (263行)

### 功能概述
批量生成实战内容，采用矩阵式生成策略：
- 5个核心产品 × 6个角度 = 30篇内容
- 每篇自动注入AEO优化
- 自动记录生成埋点

### 核心数据结构

```typescript
interface GeneratedContent {
  id: string
  product: string        // 产品名称
  angle: string         // 内容角度
  platform: string      // 目标平台
  title: string         // 优化后标题
  content: string       // 完整内容
  aeoScore: number      // AEO评分
  schemaMarkup: any[]   // Schema标记
  trackedId?: string    // 埋点ID
}
```

### 产品矩阵

```typescript
const PRODUCTS = [
  { name: "小佩智能喂食器PRO", price: "¥899", rating: 4.8 },
  { name: "pidan自动猫砂盆", price: "¥2999", rating: 4.6 },
  { name: "伯纳天纯狗粮", price: "¥299", rating: 4.7 },
  { name: "Kong宠物玩具", price: "¥158", rating: 4.8 },
  { name: "小佩饮水机", price: "¥399", rating: 4.7 }
]

const ANGLES = [
  { id: "review", name: "深度测评" },
  { id: "compare", name: "横向对比" },
  { id: "avoid", name: "避坑指南" },
  { id: "guide", name: "选购攻略" },
  { id: "list", name: "盘点汇总" },
  { id: "qa", name: "问答解析" }
]
```

### 生成流程

```typescript
export function generateBattleContent() {
  // 1. 遍历所有产品
  PRODUCTS.forEach(product => {
    // 2. 遍历所有内容角度
    ANGLES.forEach(angle => {
      // 3. 生成内容模板
      const content = generateContent(product, angle)
      
      // 4. AEO优化分析
      const analysis = analyzeContentForAEO(content, product.name)
      
      // 5. 记录生成埋点
      const trackedRecord = trackContentGeneration(...)
      
      // 6. 组装结果
      contents.push({
        id: `battle-${product.category}-${angle.id}`,
        product: product.name,
        angle: angle.name,
        aeoScore: analysis.aeoScore,
        schemaMarkup: analysis.schemaMarkup,
        // ...
      })
    })
  })
  
  return {
    contents,
    byProduct,    // 按产品统计
    byAngle,      // 按角度统计
    averageAeoScore  // 平均AEO分
  }
}
```

---

## 3️⃣ src/lib/nexus-data-flow.ts (141行)

### 功能概述
统一数据流管理，连接所有内容、变现、追踪模块。

### 核心数据模型

```typescript
interface SystemDataFlow {
  generatedContents: ContentRecord[]        // 内容生成记录
  aeoAnalyses: AEOAnalysis[]               // AEO分析结果
  affiliateRecords: AffiliateRecord[]       // 变现记录
  publishRecords: PublishRecord[]           // 发布记录
  performanceRecords: PerformanceRecord[]   // 性能数据
}
```

### 核心函数

```typescript
// 数据分析聚合
function analyzeSystemPerformance(data: SystemDataFlow): Stats

// 导出发布清单
function exportPublishList(records: PublishRecord[]): string

// 生成数据报表
function generateDataReport(data: SystemDataFlow): string
```

### 输出指标

```typescript
interface Stats {
  totalGenerated: number        // 总生成数
  averageAeoScore: number       // 平均AEO分
  totalAffiliate: number        // 总变现金额
  totalPublished: number        // 已发布数
  totalViews: number            // 总浏览量
  totalClicks: number           // 总点击量
  totalConversions: number      // 总转化数
  totalRevenue: number          // 总收益
  ctr: number                   // 点击率
  cvr: number                   // 转化率
  revenuePerView: number        // 每浏览收益
}
```

---

## 4️⃣ src/lib/data-tracker.ts (260行)

### 功能概述
全链路数据埋点，追踪内容从生成到变现的全过程。

### 核心数据结构

```typescript
interface ContentRecord {
  id: string                  // 唯一标识
  keyword: string             // 关键词
  platform: string           // 平台
  title: string              // 标题
  generatedAt: string        // 生成时间
  contentLength: number      // 内容长度
  injectedProducts: string[] // 注入商品
  coreArgument?: string      // 核心论点
  keyData?: string[]         // 关键数据
  emotionKeywords?: string[] // 情绪关键词
  sourceInfo?: SourceInfo    // 来源信息
}

interface PerformanceRecord {
  contentId: string          // 关联内容ID
  views: number              // 浏览量
  clicks: number             // 点击量
  conversions: number        // 转化数
  revenue: number            // 收益
  platformFlagged: boolean   // 是否被限流
}
```

### 核心函数

```typescript
// 记录内容生成
function trackContentGeneration(keyword, platform, title, content, options): ContentRecord

// 记录表现数据
function trackPerformance(contentId, data): PerformanceRecord

// 获取统计数据
function getTrackerStats(): TrackerStats

// 清空数据（测试用）
function clearAllData(): void
```

### API端点

```
GET /api/tracker
  - 返回：stats, recentContents, recentPerformances

POST /api/tracker
  - action: 'track_generation' | 'track_performance' | 'get_stats' | 'clear'
```

---

## 5️⃣ src/app/aeo/page.tsx (297行)

### 功能概述
AEO优化工作台前端页面，提供：
- 内容输入与分析
- 权威度评分展示
- 优化建议清单
- Schema标记预览
- 优化后内容对比

### 核心组件

```tsx
export default function AEOPage() {
  const [inputContent, setInputContent] = useState("")
  const [keyword, setKeyword] = useState("")
  const [analysis, setAnalysis] = useState<AEOAnalysis | null>(null)
  const [viewMode, setViewMode] = useState<'full' | 'fragment'>('full')
  
  // 处理分析请求
  const handleAnalyze = async () => {
    const result = analyzeContentForAEO(inputContent, keyword)
    setAnalysis(result)
  }
  
  return (
    <div>
      {/* 输入区域 */}
      <InputSection />
      
      {/* 评分卡片 */}
      <ScoreCards analysis={analysis} />
      
      {/* 标签页切换 */}
      <Tabs>
        <Tab name="analysis">优化建议</Tab>
        <Tab name="schema">Schema标记</Tab>
        <Tab name="optimized">优化内容</Tab>
      </Tabs>
      
      {/* 建议列表 */}
      <OptimizationSuggestions suggestions={analysis.optimizationSuggestions} />
    </div>
  )
}
```

### 功能特性
- ✅ 实时AEO评分计算
- ✅ 多维度评分展示
- ✅ 可视化优化建议
- ✅ Schema一键复制
- ✅ 优化前后对比

---

## 6️⃣ src/app/dashboard/page.tsx (317行)

### 功能概述
收益仪表盘前端页面，提供：
- 实时数据统计
- Recharts可视化图表
- 内容产出趋势
- 收益分布分析
- 最近活动流

### 核心组件

```tsx
export default function DashboardPage() {
  const [data, setData] = useState<SystemDataFlow>(initialData)
  const [stats, setStats] = useState<any>(null)
  
  useEffect(() => {
    loadData()
    // 模拟实时更新
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div>
      {/* 核心指标卡片 */}
      <MetricCards stats={stats} />
      
      {/* 趋势图表 */}
      <LineChart data={timeSeriesData} />
      
      {/* 收益分布 */}
      <BarChart data={revenueByPlatform} />
      
      {/* 详细指标 */}
      <DetailedStats stats={stats} />
      
      {/* 活动流 */}
      <ActivityFeed records={recentActivities} />
    </div>
  )
}
```

### 图表配置

```typescript
// 内容产出趋势（折线图）
LineChart {
  data: [{name: 'Day 1', generated: 10, published: 8}, ...]
  lines: ['生成数', '发布数']
}

// 收益分布（柱状图）
BarChart {
  data: [
    {name: '小红书', revenue: 450},
    {name: '知乎', revenue: 320},
    {name: '微博', revenue: 180},
    ...
  ]
}
```

---

## 🔗 依赖关系图

```
aeo-engine.ts
    ↓ 调用
battle-content-generator.ts
    ↓ 调用
data-tracker.ts
    
nexus-data-flow.ts
    ↑ 使用
    ├── data-tracker.ts
    ├── aeo-engine.ts
    └── battle-content-generator.ts

aeo/page.tsx
    ↑ 导入
    ├── aeo-engine.ts
    └── data-tracker.ts

dashboard/page.tsx
    ↑ 导入
    ├── nexus-data-flow.ts
    └── data-tracker.ts
```

---

## 💡 关键设计亮点

### 1. AEO评分算法
- **多维度加权**：标题(35%) + 数据(25%) + 结构(20%) + 新鲜度(20%)
- **智能优化建议**：基于评分自动给出改进方案
- **Schema自动生成**：符合Google规范的结构化数据

### 2. 矩阵式内容生成
- **5产品 × 6角度 = 30篇**
- **自动适配各平台格式**
- **AEO优化内置**：生成即优化

### 3. 全链路数据追踪
- **生成埋点**：记录每篇内容的元数据
- **表现追踪**：记录浏览/点击/转化数据
- **变现归因**：关联内容与收益

### 4. 实时数据可视化
- **Recharts图表库**：专业级数据可视化
- **实时更新**：5秒刷新一次
- **多维度分析**：按平台/时间/品类切片

---

## 🚀 使用示例

### 生成30篇实战内容
```typescript
import { generateBattleContent } from "@/lib/battle-content-generator"

const result = generateBattleContent()
console.log(`生成${result.contents.length}篇内容`)
console.log(`平均AEO分数：${result.averageAeoScore}`)
```

### 分析单篇内容
```typescript
import { analyzeContentForAEO } from "@/lib/aeo-engine"

const analysis = analyzeContentForAEO(content, "智能喂食器")
console.log(`AEO分数：${analysis.aeoScore}`)
console.log(`优化建议：${analysis.optimizationSuggestions.length}条`)
```

### 追踪数据
```typescript
import { trackContentGeneration, trackPerformance } from "@/lib/data-tracker"

// 记录生成
const record = trackContentGeneration("智能喂食器", "xiaohongshu", "标题", "内容")

// 记录表现
trackPerformance(record.id, { views: 1000, clicks: 50, revenue: 50 })
```

---

*核心源代码清单生成完成*  
*总计：6个文件，约1,843行代码*
