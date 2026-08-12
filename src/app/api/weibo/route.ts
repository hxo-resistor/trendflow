import { NextRequest, NextResponse } from "next/server"

const RATE_LIMITS = {
  search: { maxRequests: 10, windowMs: 60000 },
  comment: { maxRequests: 5, windowMs: 300000 },
  message: { maxRequests: 3, windowMs: 600000 }
}

const requestCounts = new Map<string, number[]>()

function checkRateLimit(endpoint: string): boolean {
  const config = RATE_LIMITS[endpoint as keyof typeof RATE_LIMITS]
  if (!config) return true
  
  const now = Date.now()
  const timestamps = requestCounts.get(endpoint) || []
  const validTimestamps = timestamps.filter((t: number) => now - t < config.windowMs)
  
  if (validTimestamps.length >= config.maxRequests) {
    return false
  }
  
  validTimestamps.push(now)
  requestCounts.set(endpoint, validTimestamps)
  return true
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    if (action === 'search') {
      const keyword = searchParams.get('keyword')
      
      if (!keyword) {
        return NextResponse.json({ error: '请输入搜索关键词' }, { status: 400 })
      }

      if (!checkRateLimit('search')) {
        return NextResponse.json({ error: '搜索频率过高', retryAfter: 60 }, { status: 429 })
      }

      const posts = [
        {
          id: `wb-${Date.now()}-1`,
          text: `关于${keyword}的讨论，大家怎么看？`,
          author: '用户示例',
          created_at: new Date().toISOString(),
          stats: { reposts: 10, comments: 5, likes: 20 }
        }
      ]

      return NextResponse.json({
        success: true,
        data: { posts, total: posts.length }
      })
    }

    if (action === 'rate-status') {
      return NextResponse.json({ success: true, limits: RATE_LIMITS })
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    if (action === 'comment') {
      const body = await request.json()
      const { postId, content } = body

      if (!postId || !content) {
        return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
      }

      if (!checkRateLimit('comment')) {
        return NextResponse.json({ error: '评论频率过高', retryAfter: 300 }, { status: 429 })
      }

      return NextResponse.json({
        success: true,
        data: { commentId: `comment-${Date.now()}`, postId }
      })
    }

    if (action === 'message') {
      const body = await request.json()
      const { userId, content } = body

      if (!userId || !content) {
        return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
      }

      if (!checkRateLimit('message')) {
        return NextResponse.json({ error: '私信频率过高', retryAfter: 600 }, { status: 429 })
      }

      return NextResponse.json({
        success: true,
        data: { messageId: `msg-${Date.now()}`, userId }
      })
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
