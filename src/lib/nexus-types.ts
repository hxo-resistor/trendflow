/**
 * Nexus 类型定义
 */

export interface Keyword {
  id: string
  keyword: string
  category: string
  season: string[]
  platform: string[]
  heat: number
  trend: 'rising' | 'stable' | 'falling' | 'seasonal'
  predictedPeak?: string
  opportunity: string
  monetizable: boolean
  relatedProducts?: string[]
}

export interface HotspotSignal {
  id: string
  title: string
  source: string
  url: string
  score: number
  opportunity: string
  trend: 'rising' | 'stable' | 'falling'
  competition: 'low' | 'medium' | 'high'
  peakTime: string
  recommendedAction: string
  platforms: string[]
  monetizable: boolean
  relatedProducts: string[]
}

export interface ContentAngle {
  id: string
  name: string
  description: string
  template: string
}

export interface GeneratedContent {
  id: string
  angle: string
  title: string
  content: string
  platform: string
  persona: string
  bestTime: string
  monetizedContent?: string
  insertedProducts?: any[]
  estimatedCommission?: string
}

export interface Account {
  id: string
  name: string
  persona: string
  focus: string
  platforms: string[]
  activeTime: string
  style: string
  status: 'active' | 'inactive' | 'warning'
  behaviorPattern: {
    postInterval: number
    interactProbability: number
    onlineDuration: number
    randomize: boolean
  }
  contentCount: number
  publishedCount: number
}

export interface DistributionPlan {
  id: string
  contentId: string
  accountId: string
  scheduledTime: string
  publishedAt?: string
  status: 'pending' | 'scheduled' | 'published' | 'failed'
  priority: number
}

export interface ProduceResult {
  success: boolean
  keyword: string
  angles: ContentAngle[]
  titles: string[]
  contents: GeneratedContent[]
  totalGenerated: number
  estimatedRevenue: string
  generatedAt: string
}

export interface SenseResult {
  success: boolean
  timestamp: string
  stats: {
    totalKeywords: number
    risingCount: number
    highHeatCount: number
    monetizableCount: number
  }
  hotspots: HotspotSignal[]
  predictions: Array<{
    keyword: string
    prediction: string
    confidence: number
    action: string
  }>
}
