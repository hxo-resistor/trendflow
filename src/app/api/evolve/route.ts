import { NextRequest, NextResponse } from "next/server"

/**
 * Evolution Engine - Self-improving content strategy system
 */

// In-memory storage (would use database in production)
const historyStore = new Map<string, any[]>()
const feedbackStore = new Map<string, any[]>()
const strategyStore: Record<string, any> = {
  activeKeywords: [],
  highPerformingAngles: [],
  lowPerformingAngles: [],
  recommendedPlatforms: [],
  adjustedAt: null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    // Return different data based on type parameter
    if (type === 'decisions') {
      return NextResponse.json(getEvolutionDecisions())
    }
    
    if (type === 'history') {
      return NextResponse.json({
        success: true,
        records: Array.from(historyStore.values()).flat(),
        total: Array.from(historyStore.values()).flat().length
      })
    }
    
    if (type === 'feedback') {
      return NextResponse.json({
        success: true,
        records: Array.from(feedbackStore.values()).flat(),
        total: Array.from(feedbackStore.values()).flat().length
      })
    }
    
    if (type === 'strategy') {
      return NextResponse.json({
        success: true,
        strategy: strategyStore,
        lastUpdated: new Date().toISOString()
      })
    }
    
    // Default: return summary stats
    const allHistory = Array.from(historyStore.values()).flat()
    const allFeedback = Array.from(feedbackStore.values()).flat()
    
    return NextResponse.json({
      success: true,
      stats: {
        totalGenerations: allHistory.length,
        totalFeedbacks: allFeedback.length,
        keywords: calculateKeywordStats(allHistory, allFeedback).slice(0, 10),
        topAngles: calculateAngleStats(allHistory, allFeedback).slice(0, 5),
        topPlatforms: calculatePlatformStats(allHistory, allFeedback).slice(0, 5),
      },
      decisions: getEvolutionDecisions(),
      strategy: strategyStore
    })
  } catch (error) {
    console.error("Evolve GET error:", error)
    return NextResponse.json({ error: "获取进化数据失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Determine operation type
    if (body.action === 'analyze') {
      return analyzeAndEvolve()
    }
    
    if (body.action === 'apply_strategy') {
      return applyEvolutionStrategy(body.strategy)
    }
    
    if (body.action === 'reset') {
      return resetEvolutionState()
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "未知操作类型" 
    }, { status: 400 })
  } catch (error) {
    console.error("Evolve POST error:", error)
    return NextResponse.json({ error: "进化分析失败" }, { status: 500 })
  }
}

// Helper functions
function calculateKeywordStats(history: any[], feedback: any[]) {
  const keywordMap = new Map<string, { views: number; engagements: number; count: number }>()
  
  history.forEach((record: any) => {
    const existing = keywordMap.get(record.keyword) || { views: 0, engagements: 0, count: 0 }
    existing.count++
    keywordMap.set(record.keyword, existing)
  })
  
  feedback.forEach((record: any) => {
    const existing = keywordMap.get(record.keyword) || { views: 0, engagements: 0, count: 0 }
    existing.views += record.views
    existing.engagements += (record.likes + record.comments + record.conversions)
    keywordMap.set(record.keyword, existing)
  })
  
  return Array.from(keywordMap.entries())
    .map(([keyword, data]) => ({
      keyword,
      totalViews: data.views,
      avgEngagement: data.count > 0 ? data.engagements / data.count : 0,
      trend: data.engagements / data.count > 50 ? 'up' as const : data.engagements / data.count < 10 ? 'down' as const : 'stable' as const
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
}

function calculateAngleStats(history: any[], feedback: any[]) {
  const angleMap = new Map<string, { count: number; performance: number }>()
  
  history.forEach((record: any) => {
    const existing = angleMap.get(record.angle) || { count: 0, performance: 0 }
    existing.count++
    angleMap.set(record.angle, existing)
  })
  
  return Array.from(angleMap.entries())
    .map(([angle, data]) => ({
      angle,
      usageCount: data.count,
      effectiveness: data.count * 10 + data.performance
    }))
    .sort((a, b) => b.effectiveness - a.effectiveness)
}

function calculatePlatformStats(history: any[], feedback: any[]) {
  const platformMap = new Map<string, { count: number; engagement: number }>()
  
  history.forEach((record: any) => {
    const existing = platformMap.get(record.platform) || { count: 0, engagement: 0 }
    existing.count++
    platformMap.set(record.platform, existing)
  })
  
  return Array.from(platformMap.entries())
    .map(([platform, data]) => ({
      platform,
      postCount: data.count,
      avgEngagement: data.count > 0 ? data.engagement / data.count : 0
    }))
    .sort((a, b) => b.postCount - a.postCount)
}

function getEvolutionDecisions() {
  const allHistory = Array.from(historyStore.values()).flat()
  const allFeedback = Array.from(feedbackStore.values()).flat()
  
  const increaseFocus: any[] = []
  const decreaseFocus: any[] = []
  const testVariants: any[] = []
  
  // Sample decisions based on available data
  if (allHistory.length > 0) {
    increaseFocus.push({
      action: 'increase',
      reason: `关键词"${allHistory[0]?.keyword}"表现活跃，建议加大生成量`,
      evidence: `已生成${allHistory.filter(r => r.keyword === allHistory[0]?.keyword).length}次`,
      priority: 1
    })
  }
  
  return {
    increaseFocus,
    decreaseFocus,
    testVariants
  }
}

async function analyzeAndEvolve() {
  const allHistory = Array.from(historyStore.values()).flat()
  const allFeedback = Array.from(feedbackStore.values()).flat()
  
  const decisions = getEvolutionDecisions()
  
  strategyStore.highPerformingKeywords = decisions.increaseFocus.map((d: any) => d.reason.match(/关键词"([^"]+)"/)?.[1]).filter(Boolean)
  strategyStore.lowPerformingKeywords = decisions.decreaseFocus.map((d: any) => d.reason.match(/关键词"([^"]+)"/)?.[1]).filter(Boolean)
  strategyStore.adjustedAt = new Date().toISOString()
  strategyStore.lastAnalysis = {
    timestamp: new Date().toISOString(),
    totalRecords: allHistory.length,
    totalFeedbacks: allFeedback.length,
    insightsGenerated: decisions.increaseFocus.length + decisions.decreaseFocus.length
  }
  
  return NextResponse.json({
    success: true,
    message: "进化分析完成",
    decisions,
    strategy: strategyStore,
    timestamp: new Date().toISOString()
  })
}

async function applyEvolutionStrategy(newStrategy: any) {
  Object.keys(newStrategy).forEach(key => {
    strategyStore[key] = newStrategy[key]
  })
  
  return NextResponse.json({
    success: true,
    message: "策略已应用",
    strategy: strategyStore,
    timestamp: new Date().toISOString()
  })
}

function resetEvolutionState() {
  historyStore.clear()
  feedbackStore.clear()
  Object.keys(strategyStore).forEach(key => delete strategyStore[key])
  
  return NextResponse.json({
    success: true,
    message: "进化状态已重置",
    timestamp: new Date().toISOString()
  })
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, platform, angle, persona } = body
    
    if (!keyword || !platform || !angle) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }
    
    const record = {
      keyword,
      platform,
      angle,
      persona: persona || 'default',
      generatedAt: new Date().toISOString()
    }
    
    const key = `${keyword}-${platform}`
    const existing = historyStore.get(key) || []
    existing.push(record)
    historyStore.set(key, existing)
    
    return NextResponse.json({ success: true, record })
  } catch (error) {
    console.error("History store error:", error)
    return NextResponse.json({ error: "存储失败" }, { status: 500 })
  }
}
