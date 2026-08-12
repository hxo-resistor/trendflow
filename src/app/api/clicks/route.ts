import { NextRequest, NextResponse } from "next/server"

// 内存存储点击数据
interface ClickRecord {
  id: string
  platform: string
  product: string
  source: string
  contentId: string
  timestamp: string
  ip?: string
  userAgent?: string
}

let clicks: ClickRecord[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, product, source, contentId } = body
    
    if (!platform || !product) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      )
    }
    
    const record: ClickRecord = {
      id: `click-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      platform,
      product,
      source: source || 'direct',
      contentId: contentId || `click-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
      userAgent: request.headers.get('user-agent') || undefined
    }
    
    clicks.push(record)
    
    // 限制内存中的数据量（保留最近1000条）
    if (clicks.length > 1000) {
      clicks = clicks.slice(-1000)
    }
    
    return NextResponse.json({ 
      success: true, 
      clickId: record.id,
      message: "点击已记录"
    })
  } catch (error) {
    console.error('Click recording error:', error)
    return NextResponse.json(
      { error: "记录失败" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const days = parseInt(searchParams.get('days') || '7')
  
  try {
    if (action === 'stats') {
      // 统计过去N天的点击数据
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      
      const recentClicks = clicks.filter(c => 
        new Date(c.timestamp) >= cutoffDate
      )
      
      // 按平台分组统计
      const byPlatform: Record<string, { count: number; products: Set<string> }> = {}
      recentClicks.forEach(click => {
        if (!byPlatform[click.platform]) {
          byPlatform[click.platform] = { count: 0, products: new Set() }
        }
        byPlatform[click.platform].count++
        byPlatform[click.platform].products.add(click.product)
      })
      
      // 按商品分组统计
      const byProduct: Record<string, { count: number; platforms: Set<string> }> = {}
      recentClicks.forEach(click => {
        if (!byProduct[click.product]) {
          byProduct[click.product] = { count: 0, platforms: new Set() }
        }
        byProduct[click.product].count++
        byProduct[click.product].platforms.add(click.platform)
      })
      
      return NextResponse.json({
        success: true,
        stats: {
          totalClicks: recentClicks.length,
          byPlatform,
          byProduct: Object.fromEntries(
            Object.entries(byProduct).map(([k, v]) => [k, { ...v, platforms: Array.from(v.platforms) }])
          ),
          topProducts: Object.entries(byProduct)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 10)
            .map(([product, data]) => ({ product, clicks: data.count }))
        }
      })
    }
    
    if (action === 'recent') {
      const limit = parseInt(searchParams.get('limit') || '50')
      const recent = clicks.slice(-limit).reverse()
      return NextResponse.json({ success: true, data: recent })
    }
    
    // 默认返回总览
    return NextResponse.json({
      success: true,
      total: clicks.length,
      recentCount: clicks.filter(c => {
        const hourAgo = new Date(Date.now() - 3600000)
        return new Date(c.timestamp) >= hourAgo
      }).length
    })
  } catch (error) {
    console.error('Click stats error:', error)
    return NextResponse.json(
      { error: "获取数据失败" },
      { status: 500 }
    )
  }
}