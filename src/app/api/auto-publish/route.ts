import { NextRequest, NextResponse } from "next/server"
import { 
  executeAutoPublish, 
  canAutoPublish,
  getSafetyReport 
} from "@/lib/auto-publish-engine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    // 执行自动发布
    if (action === 'publish') {
      const { taskId, platform, content, targetUrl } = data
      
      if (!taskId || !platform || !content) {
        return NextResponse.json(
          { error: "缺少必要参数：taskId, platform, content" },
          { status: 400 }
        )
      }
      
      const result = await executeAutoPublish(taskId, platform, content, targetUrl)
      
      return NextResponse.json({
        success: result.success,
        data: result
      })
    }
    
    // 安全检查
    if (action === 'check') {
      const { platform, content } = data
      
      if (!platform || !content) {
        return NextResponse.json(
          { error: "缺少必要参数：platform, content" },
          { status: 400 }
        )
      }
      
      const check = canAutoPublish('test-account', platform, content)
      
      return NextResponse.json({
        success: true,
        data: check
      })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auto publish error:', error)
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
    // 获取安全报告
    if (action === 'safety-report') {
      const report = getSafetyReport()
      
      return NextResponse.json({
        success: true,
        data: report
      })
    }
    
    return NextResponse.json({
      success: true,
      message: "自动发布API",
      endpoints: [
        "POST /api/auto-publish?action=publish - 执行自动发布",
        "POST /api/auto-publish?action=check - 安全检查",
        "GET /api/auto-publish?action=safety-report - 安全报告"
      ]
    })
  } catch (error) {
    console.error('Auto publish error:', error)
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    )
  }
}
