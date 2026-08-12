import { NextRequest, NextResponse } from "next/server"

// 内存存储评论数据
interface CommentRecord {
  id: string
  platform: string
  postId: string
  commentContent: string
  accountId: string
  postedAt: string
  status: 'pending' | 'tracked' | 'analyzed'
  metrics?: {
    likes: number
    replies: number
    profileViews: number
    linkClicks: number
  }
  analyzedAt?: string
}

let comments: CommentRecord[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    if (action === 'track-comment') {
      const { platform, postId, commentContent, accountId } = data
      
      const record: CommentRecord = {
        id: `comment-${Date.now()}-${Math.random()}`,
        platform,
        postId,
        commentContent,
        accountId,
        postedAt: new Date().toISOString(),
        status: 'pending'
      }
      
      comments.push(record)
      
      // 限制内存中的数据量
      if (comments.length > 500) {
        comments = comments.slice(-500)
      }
      
      return NextResponse.json({
        success: true,
        record,
        message: "评论已加入追踪队列"
      })
    }
    
    if (action === 'simulate-metrics') {
      const { commentId } = data
      
      const comment = comments.find(c => c.id === commentId)
      if (!comment) {
        return NextResponse.json(
          { error: "评论不存在" },
          { status: 404 }
        )
      }
      
      // 模拟数据（实际应调用各平台API）
      const simulatedMetrics = {
        likes: Math.floor(Math.random() * 50),
        replies: Math.floor(Math.random() * 10),
        profileViews: Math.floor(Math.random() * 100),
        linkClicks: Math.floor(Math.random() * 5)
      }
      
      comment.metrics = simulatedMetrics
      comment.status = 'tracked'
      comment.analyzedAt = new Date().toISOString()
      
      return NextResponse.json({
        success: true,
        comment,
        simulated: true,
        note: "模拟数据（生产环境需对接真实API）"
      })
    }
    
    if (action === 'batch-simulate') {
      const pendingComments = comments.filter(c => c.status === 'pending')
      
      pendingComments.forEach(comment => {
        comment.metrics = {
          likes: Math.floor(Math.random() * 50),
          replies: Math.floor(Math.random() * 10),
          profileViews: Math.floor(Math.random() * 100),
          linkClicks: Math.floor(Math.random() * 5)
        }
        comment.status = 'tracked'
        comment.analyzedAt = new Date().toISOString()
      })
      
      return NextResponse.json({
        success: true,
        simulated: pendingComments.length,
        message: `已模拟${pendingComments.length}条评论的数据`
      })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Comment tracker error:', error)
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    if (action === 'list') {
      const limit = parseInt(searchParams.get('limit') || '50')
      const platform = searchParams.get('platform')
      
      let filtered = [...comments].reverse()
      
      if (platform) {
        filtered = filtered.filter(c => c.platform === platform)
      }
      
      return NextResponse.json({
        success: true,
        data: filtered.slice(0, limit),
        total: filtered.length
      })
    }
    
    if (action === 'stats') {
      const today = new Date().toISOString().split('T')[0]
      const todayComments = comments.filter(c => c.postedAt.startsWith(today))
      
      const byPlatform: Record<string, { count: number; totalLikes: number; totalReplies: number }> = {}
      todayComments.forEach(c => {
        if (!byPlatform[c.platform]) {
          byPlatform[c.platform] = { count: 0, totalLikes: 0, totalReplies: 0 }
        }
        byPlatform[c.platform].count++
        byPlatform[c.platform].totalLikes += c.metrics?.likes || 0
        byPlatform[c.platform].totalReplies += c.metrics?.replies || 0
      })
      
      // 找出最佳表现
      const topComments = [...comments]
        .filter(c => c.metrics)
        .sort((a, b) => (b.metrics?.likes || 0) - (a.metrics?.likes || 0))
        .slice(0, 5)
      
      return NextResponse.json({
        success: true,
        stats: {
          totalTracked: comments.length,
          todayPosted: todayComments.length,
          todayAnalyzed: todayComments.filter(c => c.status === 'tracked').length,
          byPlatform,
          topPerformers: topComments.map(c => ({
            id: c.id,
            platform: c.platform,
            likes: c.metrics?.likes || 0,
            content: c.commentContent.substring(0, 30) + '...'
          }))
        }
      })
    }
    
    if (action === 'analysis') {
      // 分析哪种话术效果最好
      const analyzedComments = comments.filter(c => c.status === 'tracked' && c.metrics)
      
      // 按评论类型分组统计
      const typeStats: Record<string, { count: number; avgLikes: number; avgReplies: number }> = {}
      
      analyzedComments.forEach(c => {
        // 简单分类：问句式、分享式、推荐式
        let type = 'other'
        if (c.commentContent.includes('？') || c.commentContent.includes('?')) {
          type = 'question'
        } else if (c.commentContent.includes('我')) {
          type = 'personal'
        } else if (c.commentContent.includes('推荐') || c.commentContent.includes('好用')) {
          type = 'recommendation'
        }
        
        if (!typeStats[type]) {
          typeStats[type] = { count: 0, avgLikes: 0, avgReplies: 0 }
        }
        typeStats[type].count++
        typeStats[type].avgLikes += c.metrics?.likes || 0
        typeStats[type].avgReplies += c.metrics?.replies || 0
      })
      
      // 计算平均值
      Object.keys(typeStats).forEach(type => {
        if (typeStats[type].count > 0) {
          typeStats[type].avgLikes /= typeStats[type].count
          typeStats[type].avgReplies /= typeStats[type].count
        }
      })
      
      // 找出最佳时间段
      const hourStats: Record<string, { count: number; avgEngagement: number }> = {}
      analyzedComments.forEach(c => {
        const hour = new Date(c.postedAt).getHours()
        const hourKey = `${hour}:00`
        if (!hourStats[hourKey]) {
          hourStats[hourKey] = { count: 0, avgEngagement: 0 }
        }
        hourStats[hourKey].count++
        hourStats[hourKey].avgEngagement += (c.metrics?.likes || 0) + (c.metrics?.replies || 0)
      })
      
      Object.keys(hourStats).forEach(hour => {
        if (hourStats[hour].count > 0) {
          hourStats[hour].avgEngagement /= hourStats[hour].count
        }
      })
      
      return NextResponse.json({
        success: true,
        analysis: {
          byType: typeStats,
          byHour: hourStats,
          recommendations: generateRecommendations(typeStats, hourStats)
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      total: comments.length
    })
  } catch (error) {
    console.error('Comment tracker error:', error)
    return NextResponse.json(
      { error: "获取数据失败" },
      { status: 500 }
    )
  }
}

// 生成优化建议
function generateRecommendations(typeStats: any, hourStats: any) {
  const recommendations = []
  
  // 最佳话术类型
  let bestType = ''
  let bestAvgLikes = 0
  Object.entries(typeStats).forEach(([type, stats]: [string, any]) => {
    if (stats.avgLikes > bestAvgLikes && stats.count >= 3) {
      bestAvgLikes = stats.avgLikes
      bestType = type
    }
  })
  
  if (bestType) {
    const typeNames: Record<string, string> = { question: '提问式', personal: '个人分享式', recommendation: '推荐式', other: '其他' }
    recommendations.push(`最佳话术类型：${typeNames[bestType] || bestType}（平均点赞${bestAvgLikes.toFixed(1)}）`)
  }
  
  // 最佳发布时间
  let bestHour = ''
  let bestEngagement = 0
  Object.entries(hourStats).forEach(([hour, stats]: [string, any]) => {
    if (stats.avgEngagement > bestEngagement && stats.count >= 2) {
      bestEngagement = stats.avgEngagement
      bestHour = hour
    }
  })
  
  if (bestHour) {
    recommendations.push(`最佳发布时间：${bestHour}（平均互动${bestEngagement.toFixed(1)}）`)
  }
  
  if (recommendations.length === 0) {
    recommendations.push('数据不足，建议积累更多评论后再分析')
  }
  
  return recommendations
}
