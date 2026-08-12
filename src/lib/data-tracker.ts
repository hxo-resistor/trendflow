/**
 * ECHO-2027 数据采集追踪器
 * 追踪联盟点击、平台曝光、转化数据
 */

export interface ContentRecord {
  id: string
  keyword: string
  platform: string
  title: string
  generatedAt: string
  contentLength: number
  injectedProducts: string[]
  coreArgument?: string
  keyData?: string[]
  emotionKeywords?: string[]
  controversyPoints?: string[]
  recommendedProduct?: any
  sourceInfo?: SourceInfo
}

export interface PerformanceRecord {
  contentId: string
  views: number
  clicks: number
  conversions: number
  revenue: number
  platformFlagged: boolean
  recordedAt: string
}

export interface SourceInfo {
  originalUrl?: string
  originalPublishedAt?: string
  rewriteLevel: 'direct' | 'adapted' | 'original'
}

export interface TrackerStats {
  totalGenerated: number
  totalPerformance: number
  byPlatform: Record<string, { count: number; totalViews: number; totalRevenue: number }>
  byKeyword: Record<string, number>
  recentRecords: ContentRecord[]
  averageCTR: number
  averageCVR: number
}

// 内存存储
let contentRecords: ContentRecord[] = []
let performanceRecords: PerformanceRecord[] = []

/**
 * 记录内容生成
 */
export function trackContentGeneration(
  keyword: string,
  platform: string,
  title: string,
  content: string,
  options: {
    injectedProducts?: string[]
    coreArgument?: string
    keyData?: string[]
    emotionKeywords?: string[]
    controversyPoints?: string[]
    recommendedProduct?: any
    sourceInfo?: SourceInfo
  } = {}
): ContentRecord {
  const record: ContentRecord = {
    id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    keyword,
    platform,
    title,
    generatedAt: new Date().toISOString(),
    contentLength: content.length,
    injectedProducts: options.injectedProducts || [],
    coreArgument: options.coreArgument,
    keyData: options.keyData,
    emotionKeywords: options.emotionKeywords,
    controversyPoints: options.controversyPoints,
    recommendedProduct: options.recommendedProduct,
    sourceInfo: options.sourceInfo
  }
  
  contentRecords.push(record)
  return record
}

/**
 * 记录内容表现数据
 */
export function trackPerformance(
  contentId: string,
  data: {
    views: number
    clicks: number
    conversions: number
    revenue: number
    platformFlagged?: boolean
  }
): PerformanceRecord {
  const record: PerformanceRecord = {
    contentId,
    views: data.views,
    clicks: data.clicks,
    conversions: data.conversions,
    revenue: data.revenue,
    platformFlagged: data.platformFlagged || false,
    recordedAt: new Date().toISOString()
  }
  
  performanceRecords.push(record)
  return record
}

/**
 * 获取统计数据
 */
export function getTrackerStats(): TrackerStats {
  const byPlatform: TrackerStats['byPlatform'] = {}
  const byKeyword: TrackerStats['byKeyword'] = {}
  
  contentRecords.forEach(record => {
    if (!byPlatform[record.platform]) {
      byPlatform[record.platform] = { count: 0, totalViews: 0, totalRevenue: 0 }
    }
    byPlatform[record.platform].count++
    byKeyword[record.keyword] = (byKeyword[record.keyword] || 0) + 1
  })
  
  let totalViews = 0
  let totalClicks = 0
  let totalConversions = 0
  
  performanceRecords.forEach(record => {
    totalViews += record.views
    totalClicks += record.clicks
    totalConversions += record.conversions
    
    const contentRecord = contentRecords.find(r => r.id === record.contentId)
    if (contentRecord && byPlatform[contentRecord.platform]) {
      byPlatform[contentRecord.platform].totalRevenue += record.revenue
      byPlatform[contentRecord.platform].totalViews += record.views
    }
  })
  
  const averageCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0
  const averageCVR = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
  
  return {
    totalGenerated: contentRecords.length,
    totalPerformance: performanceRecords.length,
    byPlatform,
    byKeyword,
    recentRecords: contentRecords.slice(-20).reverse(),
    averageCTR,
    averageCVR
  }
}

/**
 * 获取内容记录
 */
export function getContentRecords(filter?: {
  keyword?: string
  platform?: string
  limit?: number
}): ContentRecord[] {
  let records = [...contentRecords]
  
  if (filter?.keyword) {
    records = records.filter(r => r.keyword.includes(filter.keyword!))
  }
  
  if (filter?.platform) {
    records = records.filter(r => r.platform === filter.platform)
  }
  
  const limit = filter?.limit || 50
  return records.slice(-limit).reverse()
}

/**
 * 获取表现记录
 */
export function getPerformanceRecords(contentId?: string): PerformanceRecord[] {
  if (contentId) {
    return performanceRecords.filter(r => r.contentId === contentId)
  }
  return [...performanceRecords].reverse()
}

/**
 * 清空所有数据（测试用）
 */
export function clearAllData() {
  contentRecords = []
  performanceRecords = []
}
