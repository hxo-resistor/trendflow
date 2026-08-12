import { NextRequest, NextResponse } from "next/server"

let isRunning = false
let taskQueue: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    if (action === 'status') {
      return NextResponse.json({
        success: true,
        data: {
          isRunning,
          queueLength: taskQueue.length,
          pending: taskQueue.filter(t => t.status === 'pending').length,
          running: taskQueue.filter(t => t.status === 'running').length,
          completed: taskQueue.filter(t => t.status === 'completed').length,
          failed: taskQueue.filter(t => t.status === 'failed').length
        }
      })
    }

    if (action === 'task') {
      const taskId = searchParams.get('taskId')
      const task = taskQueue.find(t => t.id === taskId)
      
      if (!task) {
        return NextResponse.json({ error: '任务不存在' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true, data: task })
    }

    if (action === 'config') {
      return NextResponse.json({
        success: true,
        data: {
          maxSearchPerHour: 30,
          maxCommentPerHour: 10,
          workingHours: { start: '08:00', end: '23:00' }
        }
      })
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
    if (action === 'add') {
      const body = await request.json()
      const { type, target, priority = 5 } = body

      if (!type || !target) {
        return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
      }

      const task = {
        id: `task-${Date.now()}`,
        type,
        target,
        status: 'pending',
        priority,
        scheduledAt: new Date().toISOString(),
        retries: 0
      }

      taskQueue.push(task)
      
      return NextResponse.json({
        success: true,
        data: { taskId: task.id, queuePosition: taskQueue.length }
      })
    }

    if (action === 'config') {
      const body = await request.json()
      return NextResponse.json({ success: true, config: body.config })
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
