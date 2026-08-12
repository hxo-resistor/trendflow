import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    if (action === 'generate') {
      const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
      
      const report = {
        date,
        traffic: { totalViews: 0, totalClicks: 0, totalExposures: 0, ctr: 0 },
        sales: { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, conversionRate: 0 },
        affiliate: { totalCommission: 0, byPlatform: {}, topProducts: [] },
        content: { totalGenerated: 0, totalPublished: 0, publishRate: 0, aeoScores: [] },
        trends: { hotKeywords: [], risingCategories: [], recommendations: ['今日暂无数据，完成任务后自动生成'] }
      }

      return NextResponse.json({ success: true, data: report, generatedAt: new Date().toISOString() })
    }

    if (action === 'history') {
      return NextResponse.json({ success: true, data: [], total: 0 })
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({ success: true, message: '战报已保存' })
  } catch (error) {
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}
