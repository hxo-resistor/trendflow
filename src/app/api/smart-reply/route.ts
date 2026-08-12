import { NextRequest, NextResponse } from "next/server"
import { matchReplyStrategy, generateBatchReplies } from "@/lib/smart-reply-engine"
import type { SmartReplyResult } from "@/lib/smart-reply-engine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    // 单个评论匹配
    if (action === 'match') {
      const { comment } = data
      
      if (!comment) {
        return NextResponse.json(
          { error: "请提供评论内容" },
          { status: 400 }
        )
      }
      
      const result = matchReplyStrategy(comment)
      
      return NextResponse.json({
        success: true,
        data: result
      })
    }
    
    // 批量匹配
    if (action === 'batch') {
      const { comments } = data
      
      if (!comments || !Array.isArray(comments)) {
        return NextResponse.json(
          { error: "请提供评论数组" },
          { status: 400 }
        )
      }
      
      const results = generateBatchReplies(comments)
      
      return NextResponse.json({
        success: true,
        data: results
      })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Smart reply error:', error)
    return NextResponse.json(
      { error: "处理失败" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: "智能回复API",
      strategies: [
        'ask-brand: 询问品牌类',
        'ask-price: 询问价格类',
        'ask-link: 询问链接类',
        'positive: 正面互动类',
        'doubt: 质疑反驳类',
        'comparison: 比较咨询类'
      ]
    })
  } catch (error) {
    console.error('Smart reply error:', error)
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    )
  }
}
