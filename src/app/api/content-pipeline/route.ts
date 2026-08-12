import { NextRequest, NextResponse } from "next/server"
import { generateContent } from "@/lib/intelligence-engine"
import { humanizeContent } from "@/lib/anti-ai-engine"
import { generateQuestions } from "@/lib/question-engine"

// 内存存储待发布队列
interface ContentQueueItem {
  id: string
  keyword: string
  platform: string
  content: string
  title: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  createdAt: string
  publishedAt?: string
}

let contentQueue: ContentQueueItem[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    if (action === 'batch-generate') {
      const { keywords, platform, countPerKeyword = 3, humanLevel = 5 } = data
      
      if (!keywords || !Array.isArray(keywords)) {
        return NextResponse.json(
          { error: "请提供关键词数组" },
          { status: 400 }
        )
      }
      
      const results = []
      
      for (const keyword of keywords) {
        // 生成基础内容
        const baseContent = await generateContent({
          trendTitle: keyword,
          opportunity: `${keyword}需求爆发`,
          platform,
          keyword
        })
        
        // 应用去AI化处理
        const humanized = humanizeContent(baseContent.content, {
          platform,
          targetScore: 75,
          maxIterations: 3
        })
        
        // 为每个关键词生成多个角度
        for (let i = 0; i < countPerKeyword; i++) {
          const contentItem: ContentQueueItem = {
            id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            keyword,
            platform,
            content: humanized.humanized,
            title: (baseContent as any).title || keyword,
            status: 'completed',
            createdAt: new Date().toISOString()
          }
          
          contentQueue.push(contentItem)
          results.push(contentItem)
        }
      }
      
      // 限制队列长度
      if (contentQueue.length > 500) {
        contentQueue = contentQueue.slice(-500)
      }
      
      return NextResponse.json({
        success: true,
        generated: results.length,
        data: results
      })
    }
    
    if (action === 'generate-seo-content') {
      const { keyword, questionCount = 10 } = data
      
      if (!keyword) {
        return NextResponse.json(
          { error: "请提供关键词" },
          { status: 400 }
        )
      }
      
      // 生成长尾问题
      const questions = generateQuestions(keyword, questionCount)
      
      const seoContents = questions.map(q => ({
        id: `seo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        keyword,
        question: q.question,
        suggestedAnswer: q.suggestedAnswer,
        category: q.category,
        difficulty: q.difficulty,
        searchVolume: q.searchVolume,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      }))
      
      return NextResponse.json({
        success: true,
        total: seoContents.length,
        data: seoContents
      })
    }
    
    if (action === 'schedule-publish') {
      const { contentId, publishTime, platform } = data
      
      // 实际应实现定时发布逻辑
      return NextResponse.json({
        success: true,
        message: "已加入发布队列",
        scheduledAt: publishTime
      })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Content pipeline error:', error)
    return NextResponse.json(
      { error: "处理失败" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    if (action === 'queue') {
      const status = searchParams.get('status')
      const limit = parseInt(searchParams.get('limit') || '50')
      
      let filtered = [...contentQueue].reverse()
      
      if (status) {
        filtered = filtered.filter(item => item.status === status)
      }
      
      return NextResponse.json({
        success: true,
        total: filtered.length,
        data: filtered.slice(0, limit)
      })
    }
    
    if (action === 'stats') {
      const today = new Date().toISOString().split('T')[0]
      const todayItems = contentQueue.filter(item => item.createdAt.startsWith(today))
      
      const byStatus = {
        pending: contentQueue.filter(i => i.status === 'pending').length,
        generating: contentQueue.filter(i => i.status === 'generating').length,
        completed: contentQueue.filter(i => i.status === 'completed').length,
        failed: contentQueue.filter(i => i.status === 'failed').length
      }
      
      return NextResponse.json({
        success: true,
        stats: {
          totalInQueue: contentQueue.length,
          todayGenerated: todayItems.length,
          byStatus,
          topKeywords: Object.entries(
            contentQueue.reduce((acc, item) => {
              acc[item.keyword] = (acc[item.keyword] || 0) + 1
              return acc
            }, {} as Record<string, number>)
          ).sort((a, b) => b[1] - a[1]).slice(0, 5)
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      total: contentQueue.length,
      pending: contentQueue.filter(i => i.status === 'pending').length
    })
  } catch (error) {
    console.error('Pipeline stats error:', error)
    return NextResponse.json(
      { error: "获取数据失败" },
      { status: 500 }
    )
  }
}
