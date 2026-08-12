/**
 * Data Warehouse Module
 * Unified data tracking and analysis
 */

export interface UnifiedRecord {
  id: string
  keyword: string
  platform: string
  contentId: string
  createdAt: string
  
  // Exposure metrics
  views?: number
  likes?: number
  comments?: number
  shares?: number
  
  // Conversion metrics
  clicks?: number
  orders?: number
  revenue?: number
  
  // Calculated metrics
  ctr?: number
  cvr?: number
  roi?: number
  
  // Quality indicators
  isHot?: boolean
  needsOptimization?: boolean
}

// In-memory storage
let contentRecords: UnifiedRecord[] = []
let performanceRecords: Array<{
  contentId: string
  views: number
  clicks: number
  conversions: number
  revenue: number
  recordedAt: string
}> = []

/**
 * Record new content performance
 */
export function recordPerformance(data: Omit<UnifiedRecord, 'id' | 'createdAt'>): UnifiedRecord {
  const record: UnifiedRecord = {
    ...data,
    id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }
  contentRecords.push(record)
  return record
}

/**
 * Get daily summary
 */
export function getDailySummary(date: string = new Date().toISOString().split('T')[0]): {
  totalGenerated: number
  totalViews: number
  totalClicks: number
  totalRevenue: number
  avgCTR: number
  avgCVR: number
  topPerformers: UnifiedRecord[]
  byPlatform: Record<string, { count: number; views: number; clicks: number; revenue: number }>
} {
  const dayRecords = contentRecords.filter(r => r.createdAt.startsWith(date))
  
  const totalViews = dayRecords.reduce((sum, r) => sum + (r.views || 0), 0)
  const totalClicks = dayRecords.reduce((sum, r) => sum + (r.clicks || 0), 0)
  const totalRevenue = dayRecords.reduce((sum, r) => sum + (r.revenue || 0), 0)
  
  const avgCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0
  const avgCVR = totalClicks > 0 ? (performanceRecords.filter(p => p.contentId).length / totalClicks) * 100 : 0
  
  // Sort by revenue
  const topPerformers = [...dayRecords]
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5)
  
  // By platform
  const byPlatform: Record<string, any> = {}
  dayRecords.forEach(record => {
    if (!byPlatform[record.platform]) {
      byPlatform[record.platform] = { count: 0, views: 0, clicks: 0, revenue: 0 }
    }
    byPlatform[record.platform].count++
    byPlatform[record.platform].views += record.views || 0
    byPlatform[record.platform].clicks += record.clicks || 0
    byPlatform[record.platform].revenue += record.revenue || 0
  })
  
  return {
    totalGenerated: dayRecords.length,
    totalViews,
    totalClicks,
    totalRevenue,
    avgCTR,
    avgCVR,
    topPerformers,
    byPlatform
  }
}

/**
 * Get weekly trend
 */
export function getWeeklyTrend(days: number = 7): Array<{
  date: string
  views: number
  clicks: number
  revenue: number
}> {
  const trend: Array<{ date: string; views: number; clicks: number; revenue: number }> = []
  const now = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayRecords = contentRecords.filter(r => r.createdAt.startsWith(dateStr))
    
    trend.push({
      date: dateStr,
      views: dayRecords.reduce((sum, r) => sum + (r.views || 0), 0),
      clicks: dayRecords.reduce((sum, r) => sum + (r.clicks || 0), 0),
      revenue: dayRecords.reduce((sum, r) => sum + (r.revenue || 0), 0)
    })
  }
  
  return trend.reverse()
}

/**
 * Get by platform stats
 */
export function getByPlatform(): Record<string, {
  count: number
  views: number
  clicks: number
  revenue: number
}> {
  const result: Record<string, any> = {}
  
  contentRecords.forEach(record => {
    const platform = record.platform
    if (!result[platform]) {
      result[platform] = { count: 0, views: 0, clicks: 0, revenue: 0 }
    }
    result[platform].count++
    result[platform].views += record.views || 0
    result[platform].clicks += record.clicks || 0
    result[platform].revenue += record.revenue || 0
  })
  
  return result
}

/**
 * Export data to CSV
 */
export function exportToCSV(): string {
  const headers = ['ID', 'Keyword', 'Platform', 'Date', 'Views', 'Clicks', 'Orders', 'Revenue', 'CTR', 'CVR']
  const rows = contentRecords.map(r => [
    r.id,
    r.keyword,
    r.platform,
    r.createdAt.split('T')[0],
    r.views || 0,
    r.clicks || 0,
    0,
    r.revenue || 0,
    (r.ctr || 0).toFixed(2) + '%',
    '0%'
  ])
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

/**
 * Clear all data (for testing)
 */
export function clearAllData() {
  contentRecords = []
  performanceRecords = []
}