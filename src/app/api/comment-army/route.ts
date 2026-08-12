import { NextRequest, NextResponse } from "next/server"
import { COMMENT_ARMY_SCRIPTS, COMMENT_ARMY } from "@/lib/matrix-engine"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    // 获取评论海话术库
    if (action === 'scripts') {
      return NextResponse.json({
        success: true,
        data: COMMENT_ARMY_SCRIPTS,
        roles: Object.keys(COMMENT_ARMY)
      })
    }
    
    // 生成评论海任务
    if (action === 'generate-tasks') {
      const postUrl = searchParams.get('postUrl') || ''
      const persona = searchParams.get('persona') || 'all'
      
      const tasks: Array<{ id: string; role: string; script: string; delay: number; targetUrl: string }> = []
      
      // 按角色生成任务
      Object.entries(COMMENT_ARMY).forEach(([role, count]) => {
        const scripts = COMMENT_ARMY_SCRIPTS[role as keyof typeof COMMENT_ARMY_SCRIPTS] || []
        for (let i = 0; i < count; i++) {
          tasks.push({
            id: `comment-${Date.now()}-${role}-${i}`,
            role,
            script: scripts[i % scripts.length] || '...',
            delay: Math.floor(Math.random() * 60000) + (i * 1200), // 在2小时内均匀分布
            targetUrl: postUrl
          })
        }
      })
      
      // 按延迟排序
      tasks.sort((a, b) => a.delay - b.delay)
      
      return NextResponse.json({
        success: true,
        totalTasks: tasks.length,
        tasks
      })
    }
    
    // 默认返回配置
    return NextResponse.json({
      success: true,
      config: COMMENT_ARMY,
      scripts: COMMENT_ARMY_SCRIPTS
    })
  } catch (error) {
    console.error('Comment army error:', error)
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    )
  }
}
