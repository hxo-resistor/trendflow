import { NextRequest, NextResponse } from "next/server"

/**
 * Chinese Trends API - Aggregates public trending topics from multiple sources
 */
interface TrendItem {
  id: string
  title: string
  source: string
  url: string
  score: number
  category: string
  description?: string
}

export async function GET() {
  try {
    // Mock data simulating Chinese platform hot trends
    const mockTrends: TrendItem[] = [
      // Weibo Hot Search
      { id: "wb-1", title: "微博热搜话题 1", source: "微博", url: "https://weibo.com", score: 95, category: "social", description: "社交媒体热议话题" },
      { id: "wb-2", title: "微博热搜话题 2", source: "微博", url: "https://weibo.com", score: 90, category: "social", description: "热点讨论" },
      { id: "wb-3", title: "微博热搜话题 3", source: "微博", url: "https://weibo.com", score: 88, category: "social" },
      { id: "wb-4", title: "微博热搜话题 4", source: "微博", url: "https://weibo.com", score: 85, category: "social" },
      
      // Zhihu Hot List
      { id: "zh-1", title: "知乎热榜问题 1", source: "知乎", url: "https://zhihu.com", score: 90, category: "knowledge", description: "知识社区热门讨论" },
      { id: "zh-2", title: "知乎热榜问题 2", source: "知乎", url: "https://zhihu.com", score: 85, category: "knowledge" },
      { id: "zh-3", title: "知乎热榜问题 3", source: "知乎", url: "https://zhihu.com", score: 82, category: "knowledge" },
      
      // Baidu Hot Search
      { id: "bd-1", title: "百度热搜关键词 1", source: "百度", url: "https://top.baidu.com", score: 85, category: "search", description: "搜索引擎热榜" },
      { id: "bd-2", title: "百度热搜关键词 2", source: "百度", url: "https://top.baidu.com", score: 80, category: "search" },
      { id: "bd-3", title: "百度热搜关键词 3", source: "百度", url: "https://top.baidu.com", score: 78, category: "search" },
      
      // Douyin Hot Topics
      { id: "dy-1", title: "抖音热点挑战 1", source: "抖音", url: "https://douyin.com", score: 80, category: "video", description: "短视频热门内容" },
      { id: "dy-2", title: "抖音热点挑战 2", source: "抖音", url: "https://douyin.com", score: 75, category: "video" },
      { id: "dy-3", title: "抖音热点挑战 3", source: "抖音", url: "https://douyin.com", score: 72, category: "video" },
    ]

    return NextResponse.json({ 
      success: true, 
      trends: mockTrends,
      count: mockTrends.length,
      lastUpdated: new Date().toISOString(),
      note: "当前为演示模式，实际部署时接入真实数据源"
    })
  } catch (error) {
    console.error("China trends error:", error)
    return NextResponse.json({ error: "获取热点失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, keyword } = body as { platform?: string; keyword?: string }
    
    // Base mock trends
    let trends: TrendItem[] = [
      { id: "wb-1", title: "微博热搜话题 1", source: "微博", url: "https://weibo.com", score: 95, category: "social", description: "社交媒体热议话题" },
      { id: "wb-2", title: "微博热搜话题 2", source: "微博", url: "https://weibo.com", score: 90, category: "social", description: "热点讨论" },
      { id: "zh-1", title: "知乎热榜问题 1", source: "知乎", url: "https://zhihu.com", score: 90, category: "knowledge", description: "知识社区热门讨论" },
      { id: "zh-2", title: "知乎热榜问题 2", source: "知乎", url: "https://zhihu.com", score: 85, category: "knowledge" },
      { id: "bd-1", title: "百度热搜关键词 1", source: "百度", url: "https://top.baidu.com", score: 85, category: "search", description: "搜索引擎热榜" },
      { id: "bd-2", title: "百度热搜关键词 2", source: "百度", url: "https://top.baidu.com", score: 80, category: "search" },
      { id: "dy-1", title: "抖音热点挑战 1", source: "抖音", url: "https://douyin.com", score: 80, category: "video", description: "短视频热门内容" },
      { id: "dy-2", title: "抖音热点挑战 2", source: "抖音", url: "https://douyin.com", score: 75, category: "video" },
    ]
    
    // Filter by platform if specified
    if (platform) {
      trends = trends.filter(t => t.source === platform)
    }
    
    // Filter by keyword if specified
    if (keyword) {
      const keywordLower = keyword.toLowerCase()
      trends = trends.filter(t => 
        t.title.toLowerCase().includes(keywordLower) ||
        (t.description && t.description.toLowerCase().includes(keywordLower))
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      trends, 
      total: trends.length,
      filteredBy: { platform, keyword }
    })
  } catch (error) {
    return NextResponse.json({ error: "筛选失败" }, { status: 500 })
  }
}
