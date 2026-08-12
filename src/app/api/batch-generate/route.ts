import { NextRequest, NextResponse } from "next/server"
import { generateContent } from "@/lib/intelligence-engine"
import { humanizeContent } from "@/lib/anti-ai-engine"
import { generateQuestions } from "@/lib/question-engine"

// 内存存储生成任务队列
interface GenerateTask {
  id: string
  keyword: string
  platform: string
  angle: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  content?: string
  title?: string
  aeoScore?: number
  createdAt: string
  completedAt?: string
}

let taskQueue: GenerateTask[] = []
let activeJobs = 0

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    if (action === 'batch-generate') {
      const { keywords, platform, angles = ['review', 'compare', 'guide'], countPerAngle = 5 } = data
      
      if (!keywords || !Array.isArray(keywords)) {
        return NextResponse.json(
          { error: "请提供关键词数组" },
          { status: 400 }
        )
      }
      
      const results: any[] = []
      const totalTasks = keywords.length * angles.length * countPerAngle
      
      // 限制并发数
      const maxConcurrency = 3
      activeJobs = Math.min(activeJobs + 1, maxConcurrency)
      
      for (const keyword of keywords) {
        for (const angle of angles) {
          for (let i = 0; i < countPerAngle; i++) {
            // 生成内容
            const baseContent = await generateContent({
              trendTitle: `${keyword}${angle}`,
              opportunity: `${keyword}需求爆发`,
              platform,
              keyword
            })
            
            // 应用去AI化处理
            const humanized = humanizeContent(baseContent.content as string, {
              platform,
              targetScore: 75,
              maxIterations: 3
            })
            
            results.push({
              id: `task-${Date.now()}-${Math.random()}`,
              keyword,
              platform,
              angle,
              content: humanized.humanized,
              title: (baseContent as any).title || keyword,
              aeoScore: humanized.score,
              wordCount: humanized.humanized.length,
              timestamp: new Date().toISOString()
            })
          }
        }
      }
      
      activeJobs--
      
      return NextResponse.json({
        success: true,
        generated: results.length,
        totalExpected: totalTasks,
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
      
      // 生成SEO问题
      const questions = generateQuestions(keyword, questionCount)
      
      const seoContents = questions.map(q => ({
        id: `seo-${Date.now()}-${Math.random()}`,
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
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Batch generate error:', error)
    return NextResponse.json(
      { error: "生成失败" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    if (action === 'stats') {
      const today = new Date().toISOString().split('T')[0]
      const todayTasks = taskQueue.filter(t => t.createdAt.startsWith(today))
      
      return NextResponse.json({
        success: true,
        stats: {
          totalGenerated: taskQueue.length,
          todayGenerated: todayTasks.length,
          pending: taskQueue.filter(t => t.status === 'pending').length,
          generating: activeJobs,
          completed: taskQueue.filter(t => t.status === 'completed').length
        }
      })
    }
    
    if (action === 'queue') {
      const limit = parseInt(searchParams.get('limit') || '50')
      return NextResponse.json({
        success: true,
        data: [...taskQueue].reverse().slice(0, limit),
        total: taskQueue.length
      })
    }
    
    return NextResponse.json({
      success: true,
      total: taskQueue.length,
      activeJobs
    })
  } catch (error) {
    console.error('Queue stats error:', error)
    return NextResponse.json(
      { error: "获取数据失败" },
      { status: 500 }
    )
  }
}