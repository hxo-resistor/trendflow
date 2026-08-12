import { NextResponse } from "next/server"

// 内存存储（生产环境应使用数据库）
let publishQueue: any[] = []
let stats = {
  totalGenerated: 0,
  totalPublished: 0,
  todayGenerated: 0,
  todayPublished: 0,
  totalScheduled: 0
}

export async function GET() {
  return NextResponse.json({
    success: true,
    queue: publishQueue.slice(-20), // 最近20条
    stats,
    total: publishQueue.length
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, content } = body

    if (action === 'add') {
      const newItem = {
        id: Date.now().toString(),
        keyword: content.keyword || '未分类',
        platform: content.platform || 'unknown',
        title: content.title || '无标题',
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        content: content.monetizedContent || content.content || ''
      }
      publishQueue.push(newItem)
      stats.totalGenerated++
      stats.todayGenerated++
      
      return NextResponse.json({ success: true, item: newItem })
    }

    if (action === 'publish') {
      const index = publishQueue.findIndex(i => i.id === content.id)
      if (index !== -1) {
        publishQueue[index].status = 'published'
        publishQueue[index].publishedAt = new Date().toISOString()
        stats.totalPublished++
        stats.todayPublished++
        
        return NextResponse.json({ success: true, item: publishQueue[index] })
      }
    }

    if (action === 'schedule') {
      const index = publishQueue.findIndex(i => i.id === content.id)
      if (index !== -1) {
        publishQueue[index].status = 'scheduled'
        publishQueue[index].scheduledDate = content.date
        stats.totalScheduled++
        
        return NextResponse.json({ success: true, item: publishQueue[index] })
      }
    }

    if (action === 'reset') {
      publishQueue = []
      stats = { totalGenerated: 0, totalPublished: 0, todayGenerated: 0, todayPublished: 0, totalScheduled: 0 }
      return NextResponse.json({ success: true, message: '队列已清空' })
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    console.error("Publish API error:", error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
