import { NextRequest, NextResponse } from "next/server"
import { 
  recordPerformance, 
  getDailySummary, 
  getWeeklyTrend, 
  getByPlatform,
  exportToCSV,
  clearAllData
} from "@/lib/data-warehouse"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const date = searchParams.get('date')
  
  try {
    if (action === 'daily-summary') {
      const summary = getDailySummary(date || undefined)
      return NextResponse.json({ success: true, data: summary })
    }
    
    if (action === 'weekly-trend') {
      const days = parseInt(searchParams.get('days') || '7')
      const trend = getWeeklyTrend(days)
      return NextResponse.json({ success: true, data: trend })
    }
    
    if (action === 'by-platform') {
      const byPlatform = getByPlatform()
      return NextResponse.json({ success: true, data: byPlatform })
    }
    
    if (action === 'export') {
      const csv = exportToCSV()
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=data-export.csv'
        }
      })
    }
    
    // Default: return current stats
    const summary = getDailySummary()
    const weeklyTrend = getWeeklyTrend(7)
    const byPlatform = getByPlatform()
    
    return NextResponse.json({
      success: true,
      summary,
      weeklyTrend,
      byPlatform,
      totalRecords: 0
    })
  } catch (error) {
    console.error('Data warehouse error:', error)
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
    
    if (action === 'record') {
      const record = recordPerformance(data)
      return NextResponse.json({ success: true, record })
    }
    
    if (action === 'clear') {
      clearAllData()
      return NextResponse.json({ success: true, message: '数据已清空' })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Data warehouse error:', error)
    return NextResponse.json(
      { error: "记录失败" },
      { status: 500 }
    )
  }
}