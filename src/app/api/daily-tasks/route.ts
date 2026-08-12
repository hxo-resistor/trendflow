import { NextRequest, NextResponse } from "next/server"
import { 
  generateDailyTasks, 
  completeTask, 
  startTask,
  getTaskProgress,
  getSmartReply
} from "@/lib/daily-task-engine"
import type { DailyReport, DailyTask } from "@/lib/daily-task-engine"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    // 获取今日任务
    if (action === 'tasks') {
      const date = searchParams.get('date')
      const report = generateDailyTasks(date || undefined)
      
      return NextResponse.json({
        success: true,
        data: report
      })
    }
    
    // 获取任务进度
    if (action === 'progress') {
      const progress = getTaskProgress()
      
      return NextResponse.json({
        success: true,
        data: progress
      })
    }
    
    // 获取智能回复建议
    if (action === 'smart-reply') {
      const text = searchParams.get('text') || ''
      const platform = searchParams.get('platform') || 'weibo'
      
      if (!text) {
        return NextResponse.json(
          { error: "请提供评论内容" },
          { status: 400 }
        )
      }
      
      const reply = getSmartReply(text, platform)
      
      return NextResponse.json({
        success: true,
        data: reply
      })
    }
    
    // 默认返回今日任务
    return NextResponse.json({
      success: true,
      data: generateDailyTasks()
    })
  } catch (error) {
    console.error('Daily tasks error:', error)
    return NextResponse.json(
      { error: "获取任务失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    // 完成任务
    if (action === 'complete') {
      const { taskId } = data
      
      if (!taskId) {
        return NextResponse.json(
          { error: "请提供任务ID" },
          { status: 400 }
        )
      }
      
      const result = completeTask(taskId)
      
      if (!result.success) {
        return NextResponse.json(
          { error: "任务不存在" },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: "任务已完成",
        task: result.task
      })
    }
    
    // 开始任务
    if (action === 'start') {
      const { taskId } = data
      
      if (!taskId) {
        return NextResponse.json(
          { error: "请提供任务ID" },
          { status: 400 }
        )
      }
      
      const result = startTask(taskId)
      
      if (!result.success) {
        return NextResponse.json(
          { error: "任务不存在" },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: "任务已开始",
        task: result.task
      })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Daily tasks error:', error)
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    )
  }
}
