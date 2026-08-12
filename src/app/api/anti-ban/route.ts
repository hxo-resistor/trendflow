import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    // 获取安全配置
    if (action === 'config') {
      return NextResponse.json({
        success: true,
        config: {
          ipRotation: true,
          randomDelay: { min: 2000, max: 15000 },
          dailyLimits: {
            posts: 10,
            comments: 20,
            likes: 50
          },
          accountAge: 3,
          warmupDays: 3,
          contentRatio: 0.3
        }
      })
    }
    
    // 模拟安全检查
    if (action === 'check') {
      const accountId = searchParams.get('accountId')
      
      // 模拟检查逻辑
      const risks = []
      
      // 检查发帖频率
      const dailyPosts = Math.floor(Math.random() * 15)
      if (dailyPosts > 10) {
        risks.push({ type: 'high_frequency', level: 'medium', message: `今日已发帖${dailyPosts}篇，超过建议上限` })
      }
      
      // 检查互动比例
      const interactionRate = Math.random()
      if (interactionRate < 0.1) {
        risks.push({ type: 'low_interaction', level: 'high', message: '互动率过低，可能触发风控' })
      }
      
      // 检查内容相似度
      const similarityScore = Math.random()
      if (similarityScore > 0.8) {
        risks.push({ type: 'content_similarity', level: 'high', message: '内容相似度较高，建议调整文案' })
      }
      
      return NextResponse.json({
        success: true,
        accountId,
        riskScore: risks.length > 0 ? 'medium' : 'low',
        risks,
        recommendations: generateRecommendations(risks)
      })
    }
    
    return NextResponse.json({
      success: true,
      config: { dailyLimits: { posts: 10, comments: 20, likes: 50 } }
    })
  } catch (error) {
    console.error('Anti-ban error:', error)
    return NextResponse.json(
      { error: "安全检查失败" },
      { status: 500 }
    )
  }
}

function generateRecommendations(risks: any[]) {
  const recommendations = []
  
  if (risks.some(r => r.type === 'high_frequency')) {
    recommendations.push('降低发帖频率，保持每天5-8篇')
  }
  if (risks.some(r => r.type === 'low_interaction')) {
    recommendations.push('增加与他人的互动，点赞回复其他用户')
  }
  if (risks.some(r => r.type === 'content_similarity')) {
    recommendations.push('丰富文案风格，避免模板化表达')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('账号状态良好，继续保持')
  }
  
  return recommendations
}