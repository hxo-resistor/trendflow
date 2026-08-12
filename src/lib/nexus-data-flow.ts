/**
 * Nexus 系统入口 - 统一数据流管理
 * 连接所有内容生成、变现、追踪流程
 */

import type { ContentRecord } from "./data-tracker"
import type { AuthorityContent } from "./authority-content-generator"
import type { AEOAnalysis } from "./aeo-engine"

// 统一数据模型
export interface SystemDataFlow {
  // 内容生成数据
  generatedContents: ContentRecord[]
  
  // AEO优化数据
  aeoAnalyses: AEOAnalysis[]
  
  // 变现数据
  affiliateRecords: AffiliateRecord[]
  
  // 发布数据
  publishRecords: PublishRecord[]
  
  // 性能数据
  performanceRecords: PerformanceRecord[]
}

export interface AffiliateRecord {
  contentId: string
  productIds: string[]
  estimatedCommission: number
  actualRevenue?: number
  clickCount?: number
  conversionCount?: number
}

export interface PublishRecord {
  contentId: string
  platform: string
  scheduledTime: string
  publishedAt?: string
  status: 'pending' | 'scheduled' | 'published' | 'failed'
  views?: number
  clicks?: number
  conversions?: number
  revenue?: number
}

export interface PerformanceRecord {
  contentId: string
  platform: string
  views: number
  clicks: number
  conversions: number
  revenue: number
  timestamp: string
}

// 数据聚合分析
export function analyzeSystemPerformance(data: SystemDataFlow) {
  const totalGenerated = data.generatedContents.length
  const totalAffiliate = data.affiliateRecords.reduce((sum, r) => sum + r.estimatedCommission, 0)
  const totalPublished = data.publishRecords.filter(r => r.status === 'published').length
  const totalViews = data.performanceRecords.reduce((sum, r) => sum + (r.views || 0), 0)
  const totalClicks = data.performanceRecords.reduce((sum, r) => sum + (r.clicks || 0), 0)
  const totalConversions = data.performanceRecords.reduce((sum, r) => sum + (r.conversions || 0), 0)
  const totalRevenue = data.performanceRecords.reduce((sum, r) => sum + (r.revenue || 0), 0)
  
  return {
    // 生成指标
    totalGenerated,
    averageAeoScore: data.aeoAnalyses.length > 0 
      ? Math.round(data.aeoAnalyses.reduce((sum, a) => sum + a.aeoScore, 0) / data.aeoAnalyses.length)
      : 0,
    
    // 变现指标
    totalAffiliate,
    affiliateConversionRate: totalGenerated > 0 ? (totalConversions / totalGenerated) * 100 : 0,
    averageCommissionPerContent: totalGenerated > 0 ? totalAffiliate / totalGenerated : 0,
    
    // 发布指标
    totalPublished,
    publishRate: totalGenerated > 0 ? (totalPublished / totalGenerated) * 100 : 0,
    
    // 流量指标
    totalViews,
    totalClicks: totalClicks,
    totalConversions: totalConversions,
    ctr: totalViews > 0 ? (totalClicks / totalViews) * 100 : 0,
    cvr: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    
    // 收益指标
    totalRevenue,
    revenuePerView: totalViews > 0 ? totalRevenue / totalViews : 0,
    revenuePerClick: totalClicks > 0 ? totalRevenue / totalClicks : 0,
    
    // 效率指标
    contentVelocity: totalGenerated,
    monetizationEfficiency: totalViews > 0 ? totalRevenue / totalViews : 0
  }
}

// 导出为CSV格式
export function exportPublishList(records: PublishRecord[]): string {
  const headers = ['内容ID', '平台', '发布时间', '状态', '预估收益']
  const rows = records.map(r => [
    r.contentId,
    r.platform,
    r.scheduledTime,
    r.status,
    `¥${(r.revenue || 0).toFixed(2)}`
  ])
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

// 生成数据报表
export function generateDataReport(data: SystemDataFlow): string {
  const stats = analyzeSystemPerformance(data)
  
  return `
# ECHO-2027 系统数据报表
生成时间：${new Date().toISOString()}

## 核心指标
- 总生成内容：${stats.totalGenerated} 篇
- 平均AEO分数：${stats.averageAeoScore} 分
- 总变现金额：¥${stats.totalAffiliate.toFixed(2)}
- 已发布内容：${stats.totalPublished} 篇

## 流量表现
- 总浏览量：${stats.totalViews.toLocaleString()}
- 总点击量：${stats.totalClicks.toLocaleString()}
- 总转化数：${stats.totalConversions.toLocaleString()}
- 总收益：¥${stats.totalRevenue.toFixed(2)}

## 效率指标
- 发布率：${stats.publishRate.toFixed(1)}%
- CTR：${stats.ctr.toFixed(2)}%
- CVR：${stats.cvr.toFixed(2)}%
- 每浏览收益：¥${stats.revenuePerView.toFixed(4)}
`
}
