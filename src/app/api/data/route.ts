import { NextRequest, NextResponse } from "next/server"
import { getTrackerStats, getContentRecords, getPerformanceRecords } from "@/lib/data-tracker"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const contentId = searchParams.get('contentId')
  
  try {
    if (action === 'stats') {
      const stats = getTrackerStats()
      return NextResponse.json({ success: true, stats })
    }
    
    if (action === 'contents') {
      const filter = {
        keyword: searchParams.get('keyword') || undefined,
        platform: searchParams.get('platform') || undefined,
        limit: parseInt(searchParams.get('limit') || '50')
      }
      const contents = getContentRecords(filter)
      return NextResponse.json({ success: true, contents })
    }
    
    if (action === 'performance') {
      const records = contentId 
        ? getPerformanceRecords(contentId)
        : getPerformanceRecords()
      return NextResponse.json({ success: true, records })
    }
    
    // 默认返回统计摘要
    const stats = getTrackerStats()
    return NextResponse.json({ 
      success: true, 
      summary: {
        totalGenerated: stats.totalGenerated,
        totalPerformance: stats.totalPerformance,
        averageCTR: stats.averageCTR,
        averageCVR: stats.averageCVR,
        byPlatform: stats.byPlatform
      }
    })
  } catch (error) {
    console.error('Data tracker error:', error)
    return NextResponse.json(
      { error: "获取数据失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    if (action === 'track_generation') {
      const { trackContentGeneration } = await import('@/lib/data-tracker')
      const record = trackContentGeneration(
        data.keyword,
        data.platform,
        data.title,
        data.content,
        {
          injectedProducts: data.injectedProducts,
          coreArgument: data.coreArgument,
          keyData: data.keyData,
          emotionKeywords: data.emotionKeywords,
          controversyPoints: data.controversyPoints,
          recommendedProduct: data.recommendedProduct,
          sourceInfo: data.sourceInfo
        }
      )
      return NextResponse.json({ success: true, record })
    }
    
    if (action === 'track_performance') {
      const { trackPerformance } = await import('@/lib/data-tracker')
      const record = trackPerformance(data.contentId, {
        views: data.views,
        clicks: data.clicks,
        conversions: data.conversions,
        revenue: data.revenue,
        platformFlagged: data.platformFlagged
      })
      return NextResponse.json({ success: true, record })
    }
    
    if (action === 'clear') {
      const { clearAllData } = await import('@/lib/data-tracker')
      clearAllData()
      return NextResponse.json({ success: true, message: '数据已清空' })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Data record error:', error)
    return NextResponse.json(
      { error: "记录失败" },
      { status: 500 }
    )
  }
}
