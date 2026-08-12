import { NextRequest, NextResponse } from "next/server"
import { 
  getAllKeywords, 
  getSeasonalKeywords, 
  generateTrendPredictions,
  toHotspotSignal
} from "@/lib/nexus-keywords"
import { KEYWORD_DATABASE } from "@/lib/nexus-keywords"

/**
 * Nexus 感知层 - 情报网API
 * 目标：不等热点，预判热点
 */

// 缓存（每15分钟刷新）
let cachedData: any = null
let lastFetchTime = 0
const CACHE_DURATION = 15 * 60 * 1000

export async function GET(request: NextRequest) {
  const now = Date.now()
  
  // 如果缓存有效，直接返回
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    return NextResponse.json(cachedData)
  }
  
  // 生成新的数据
  const currentMonth = new Date().getMonth() + 1
  const seasonalKeywords = getSeasonalKeywords(currentMonth)
  const allKeywords = getAllKeywords(100)
  const predictions = generateTrendPredictions()
  
  const hotspots = allKeywords
    .filter(k => k.trend === 'rising' || k.heat >= 85)
    .slice(0, 20)
    .map(toHotspotSignal)
  
  const data = {
    success: true,
    timestamp: new Date().toISOString(),
    stats: {
      totalKeywords: KEYWORD_DATABASE.length,
      risingCount: KEYWORD_DATABASE.filter(k => k.trend === 'rising').length,
      highHeatCount: KEYWORD_DATABASE.filter(k => k.heat >= 90).length,
      monetizableCount: KEYWORD_DATABASE.filter(k => k.monetizable).length,
      seasonalKeywords: seasonalKeywords.length
    },
    hotspots: hotspots,
    predictions: predictions,
    seasonalKeywords: seasonalKeywords,
    categories: Array.from(new Set(KEYWORD_DATABASE.map(k => k.category))),
    metadata: {
      refreshInterval: "15分钟",
      dataSources: ["本地知识库", "趋势预测引擎", "季节性分析"],
      lastUpdated: new Date(lastFetchTime).toLocaleString('zh-CN')
    }
  }
  
  cachedData = data
  lastFetchTime = now
  
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, category, action } = body
    
    // 特殊操作：强制刷新
    if (action === 'refresh') {
      cachedData = null
      lastFetchTime = 0
      return NextResponse.json({ success: true, message: "已强制刷新数据" })
    }
    
    // 搜索关键词
    if (keyword) {
      const { searchKeywords } = await import("@/lib/nexus-keywords")
      const results = searchKeywords(keyword).map(toHotspotSignal)
      
      return NextResponse.json({
        success: true,
        keyword,
        count: results.length,
        results
      })
    }
    
    // 按品类筛选
    if (category) {
      const { getKeywordsByCategory } = await import("@/lib/nexus-keywords")
      const results = getKeywordsByCategory(category).map(toHotspotSignal)
      
      return NextResponse.json({
        success: true,
        category,
        count: results.length,
        results
      })
    }
    
    return NextResponse.json({ error: "未知操作" }, { status: 400 })
  } catch (error) {
    console.error("Sense API error:", error)
    return NextResponse.json(
      { error: "情报获取失败" },
      { status: 500 }
    )
  }
}


