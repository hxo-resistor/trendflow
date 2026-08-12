import { NextRequest, NextResponse } from "next/server"
import { getDailySummary, getWeeklyTrend, getByPlatform } from "@/lib/data-warehouse"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    // 获取完整数据看板
    if (action === 'dashboard') {
      const dailySummary = getDailySummary()
      const weeklyTrend = getWeeklyTrend(7)
      const byPlatform = getByPlatform()
      
      return NextResponse.json({
        success: true,
        dashboard: {
          contentStats: {
            totalGenerated: dailySummary.totalGenerated || 0,
            todayGenerated: dailySummary.totalGenerated || 0,
            byPlatform: Object.keys(byPlatform).length
          },
          performanceStats: {
            totalViews: dailySummary.totalViews || 0,
            totalClicks: 0,
            totalRevenue: dailySummary.totalRevenue || 0,
            avgCTR: 0,
            avgCVR: 0
          },
          platformBreakdown: Object.entries(byPlatform).map(([platform, data]) => ({
            platform,
            count: data.count,
            views: data.views,
            clicks: data.clicks,
            revenue: data.revenue
          })),
          topProducts: [],
          weeklyTrend
        }
      })
    }
    
    // 仅获取内容统计
    if (action === 'content-stats') {
      const summary = getDailySummary()
      return NextResponse.json({
        success: true,
        data: {
          totalGenerated: summary.totalGenerated || 0,
          byPlatform: Object.keys(summary.byPlatform || {}).length
        }
      })
    }
    
    // 默认返回完整看板
    return NextResponse.json({
      success: true,
      dashboard: {
        contentStats: {
          totalGenerated: 0,
          todayGenerated: 0,
          byPlatform: 0
        },
        performanceStats: {
          totalViews: 0,
          totalClicks: 0,
          totalRevenue: 0,
          avgCTR: 0,
          avgCVR: 0
        },
        platformBreakdown: [],
        topProducts: [],
        weeklyTrend: []
      }
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: "获取看板数据失败" },
      { status: 500 }
    )
  }
}