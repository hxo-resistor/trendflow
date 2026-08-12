import { NextRequest, NextResponse } from "next/server"
import { 
  getHotKeywords, 
  searchKeywords, 
  keywordsToTrends,
  CATEGORIES 
} from "@/lib/trending-keywords"

// 缓存（每30分钟刷新一次）
let cachedData: any = null
let lastFetchTime = 0
const CACHE_DURATION = 30 * 60 * 1000 // 30分钟

export async function GET(request: NextRequest) {
  const now = Date.now()
  
  // 如果缓存有效，直接返回
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    return NextResponse.json({
      success: true,
      trends: cachedData,
      count: cachedData.length,
      lastUpdated: new Date(lastFetchTime).toLocaleString('zh-CN'),
      categories: CATEGORIES
    })
  }
  
  // 生成新的热点数据
  const hotKeywords = getHotKeywords(50) // 获取前50个高热关键词
  cachedData = keywordsToTrends(hotKeywords)
  lastFetchTime = now
  
  return NextResponse.json({
    success: true,
    trends: cachedData,
    count: cachedData.length,
    lastUpdated: new Date(lastFetchTime).toLocaleString('zh-CN'),
    categories: CATEGORIES
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, category, platform } = body
    
    let results: any[]
    
    if (keyword) {
      // 根据关键词搜索
      const matchedKeywords = searchKeywords(keyword)
      results = keywordsToTrends(matchedKeywords)
    } else if (category) {
      // 按品类筛选
      const { getKeywordsByCategory } = await import("@/lib/trending-keywords")
      const categoryKeywords = getKeywordsByCategory(category)
      results = keywordsToTrends(categoryKeywords)
    } else {
      // 默认返回高热热点
      const hotKeywords = getHotKeywords(30)
      results = keywordsToTrends(hotKeywords)
    }
    
    // 按平台过滤
    if (platform) {
      results = results.filter((t: any) => t.platforms?.includes(platform))
    }
    
    return NextResponse.json({
      success: true,
      trends: results,
      total: results.length,
      query: { keyword, category, platform },
      lastUpdated: new Date().toLocaleString('zh-CN')
    })
  } catch (error) {
    console.error("Discover API error:", error)
    return NextResponse.json(
      { error: "获取热点失败", trends: [] },
      { status: 500 }
    )
  }
}
