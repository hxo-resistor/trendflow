import { NextRequest, NextResponse } from "next/server"

/**
 * Monetization Strategy API
 * Suggests monetization methods based on keyword analysis
 */

interface MonetizationStrategy {
  name: string
  description: string
  estimatedCpm: string
  difficulty: '低' | '中' | '高'
  timeline: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, competitors = [] } = body as {
      keyword: string
      competitors?: string[]
    }

    if (!keyword) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required parameter: keyword" 
      }, { status: 400 })
    }

    // Generate monetization strategy
    const strategies = generateMonetizationStrategy(keyword, competitors)
    
    return NextResponse.json({
      success: true,
      keyword,
      strategies,
      estimatedRevenue: calculateEstimatedRevenue(strategies),
      metadata: {
        generatedAt: new Date().toISOString(),
        source: "trendflow-monetize"
      }
    })
  } catch (error) {
    console.error("Monetize error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "变现策略生成失败" 
    }, { status: 500 })
  }
}

function generateMonetizationStrategy(keyword: string, competitors: string[]): MonetizationStrategy[] {
  const strategies: MonetizationStrategy[] = [
    {
      name: "Affiliate 带货",
      description: `通过${keyword}相关内容进行 affiliate 推广`,
      estimatedCpm: "¥5-15",
      difficulty: "低",
      timeline: "1-2周见效"
    },
    {
      name: "知识付费课程",
      description: `制作${keyword}相关的系统教程`,
      estimatedCpm: "¥99-299/人",
      difficulty: "中",
      timeline: "1个月制作周期"
    },
    {
      name: "社群会员订阅",
      description: `建立${keyword}垂直领域付费社群`,
      estimatedCpm: "¥99-299/月",
      difficulty: "中",
      timeline: "持续收益"
    },
    {
      name: "企业咨询服务",
      description: `为${keyword}相关企业提供咨询`,
      estimatedCpm: "¥5000-20000/项目",
      difficulty: "高",
      timeline: "需要专业背书"
    },
    {
      name: "数字产品销售",
      description: `开发${keyword}相关的数字化工具/模板`,
      estimatedCpm: "¥49-199/份",
      difficulty: "中",
      timeline: "一次制作持续销售"
    }
  ]
  
  // Sort by difficulty (easier first)
  return strategies.sort((a, b) => {
    const difficultyOrder: Record<string, number> = { "低": 0, "中": 1, "高": 2 }
    return (difficultyOrder[a.difficulty] || 1) - (difficultyOrder[b.difficulty] || 1)
  })
}

function calculateEstimatedRevenue(strategies: MonetizationStrategy[]) {
  const monthlyRevenue = strategies.reduce((sum, s) => {
    const match = s.estimatedCpm.match(/¥(\d+)-(\d+)/)
    if (match) {
      const low = parseInt(match[1])
      const high = parseInt(match[2])
      return sum + (low + high) / 2
    }
    return sum
  }, 0)
  
  return {
    conservative: Math.round(monthlyRevenue * 0.3),
    realistic: Math.round(monthlyRevenue * 0.6),
    optimistic: Math.round(monthlyRevenue * 1.0),
    unit: "元/月"
  }
}
