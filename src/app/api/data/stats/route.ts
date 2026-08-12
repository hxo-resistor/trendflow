import { NextResponse } from 'next/server'

/**
 * 数据统计API
 * GET /api/data/stats
 */

interface RecordData {
  source: string
  type: string
  quantity: string
  product: string
  timestamp: string
}

interface Stats {
  totalRecords: number
  byType: Record<string, number>
  bySource: Record<string, number>
  byProduct: Record<string, number>
  todayRecords: number
  last7Days: number
  revenue: number
  clicks: number
  views: number
}

export async function GET(request: Request) {
  try {
    const records: RecordData[] = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('trendflow_records') || '[]')
      : []

    const stats: Stats = {
      totalRecords: records.length,
      byType: {},
      bySource: {},
      byProduct: {},
      todayRecords: 0,
      last7Days: 0,
      revenue: 0,
      clicks: 0,
      views: 0
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    for (const record of records) {
      // 按类型统计
      stats.byType[record.type] = (stats.byType[record.type] || 0) + 1
      
      // 按来源统计
      stats.bySource[record.source] = (stats.bySource[record.source] || 0) + 1
      
      // 按产品统计
      stats.byProduct[record.product] = (stats.byProduct[record.product] || 0) + 1
      
      // 今日统计
      const recordDate = new Date(record.timestamp)
      if (recordDate >= todayStart) {
        stats.todayRecords++
      }
      
      // 近7天统计
      if (recordDate >= sevenDaysAgo) {
        stats.last7Days++
      }

      // 根据类型累加数据
      if (record.type === '收益') {
        stats.revenue += parseInt(record.quantity) || 0
      } else if (record.type === '点击') {
        stats.clicks += parseInt(record.quantity) || 0
      } else if (record.type === '浏览') {
        stats.views += parseInt(record.quantity) || 0
      }
    }

    return NextResponse.json({
      success: true,
      data: stats,
      generatedAt: new Date().toISOString(),
      cached: false
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60' // 1分钟缓存
      }
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '统计失败',
        data: {
          totalRecords: 0,
          byType: {},
          bySource: {},
          byProduct: {},
          todayRecords: 0,
          last7Days: 0,
          revenue: 0,
          clicks: 0,
          views: 0
        }
      },
      { status: 500 }
    )
  }
}
