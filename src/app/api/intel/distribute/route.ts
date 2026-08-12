import { NextRequest, NextResponse } from "next/server"

interface DistributePlan {
  platform: string
  keyword: string
  priority: number
  reason: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { competitor } = body as { competitor: string }

    if (!competitor) {
      return NextResponse.json({ error: "请提供竞品名称" }, { status: 400 })
    }

    // Generate distribution plan based on platform characteristics
    const plans: DistributePlan[] = [
      {
        platform: "小红书",
        keyword: `${competitor}测评`,
        priority: 1,
        reason: "种草属性强，适合产品测评和体验分享，用户决策参考性高"
      },
      {
        platform: "知乎",
        keyword: `${competitor}怎么样`,
        priority: 2,
        reason: "深度讨论氛围好，适合专业分析和问答引流"
      },
      {
        platform: "公众号",
        keyword: `${competitor}深度分析`,
        priority: 3,
        reason: "适合长文深度内容，建立品牌专业形象"
      },
      {
        platform: "微博",
        keyword: `${competitor}`,
        priority: 4,
        reason: "传播速度快，适合热点追踪和话题引爆"
      }
    ]

    return NextResponse.json({ 
      success: true,
      competitor,
      plan: plans
    })
  } catch (error) {
    console.error("Distribute error:", error)
    return NextResponse.json({ error: "生成失败" }, { status: 500 })
  }
}
