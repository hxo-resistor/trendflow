import { NextRequest, NextResponse } from "next/server"

// 信任分计算系统
interface TrustScore {
  userId: string
  email?: string
  wechat?: string
  totalContentGenerated: number
  totalInteractions: number
  totalClicks: number
  privateDomainUsers: number
  score: number  // 0-100
  lastUpdated: string
}

let trustScores: TrustScore[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    if (action === 'calculate') {
      const { userId, contentGenerated = 0, interactions = 0, clicks = 0, privateUsers = 0 } = data
      
      // 信任分计算公式
      const contentScore = Math.min(contentGenerated * 2, 30)  // 最多30分
      const interactionScore = Math.min(interactions * 0.5, 25)  // 最多25分
      const clickScore = Math.min(clicks * 2, 25)  // 最多25分
      const privateScore = Math.min(privateUsers * 5, 20)  // 最多20分
      
      const totalScore = Math.min(Math.round(contentScore + interactionScore + clickScore + privateScore), 100)
      
      const trustScore: TrustScore = {
        userId,
        totalContentGenerated: contentGenerated,
        totalInteractions: interactions,
        totalClicks: clicks,
        privateDomainUsers: privateUsers,
        score: totalScore,
        lastUpdated: new Date().toISOString()
      }
      
      // 更新或新增
      const existingIndex = trustScores.findIndex(t => t.userId === userId)
      if (existingIndex >= 0) {
        trustScores[existingIndex] = trustScore
      } else {
        trustScores.push(trustScore)
      }
      
      return NextResponse.json({
        success: true,
        trustScore: totalScore,
        breakdown: {
          content: contentScore,
          interaction: interactionScore,
          clicks: clickScore,
          private: privateScore
        }
      })
    }
    
    if (action === 'hxoratio') {
      // 根据信任分计算HXO品牌内容比例
      const avgScore = trustScores.length > 0 
        ? trustScores.reduce((sum, t) => sum + t.score, 0) / trustScores.length 
        : 0
      
      // 信任分越高，HXO品牌内容比例越高
      const hxoRatio = Math.min(Math.round(avgScore / 10), 50)  // 0-50%
      
      return NextResponse.json({
        success: true,
        avgTrustScore: Math.round(avgScore),
        hxoContentRatio: hxoRatio,
        recommendation: hxoRatio > 30 ? '增加HXO品牌内容曝光' : '继续积累信任分'
      })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Trust transfer error:', error)
    return NextResponse.json(
      { error: "计算失败" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    if (action === 'list') {
      return NextResponse.json({
        success: true,
        data: trustScores.slice(-20).reverse(),
        total: trustScores.length
      })
    }
    
    if (action === 'stats') {
      const avgScore = trustScores.length > 0
        ? trustScores.reduce((sum, t) => sum + t.score, 0) / trustScores.length
        : 0
      
      return NextResponse.json({
        success: true,
        stats: {
          totalUsers: trustScores.length,
          avgTrustScore: Math.round(avgScore),
          highTrustUsers: trustScores.filter(t => t.score >= 70).length,
          mediumTrustUsers: trustScores.filter(t => t.score >= 40 && t.score < 70).length,
          lowTrustUsers: trustScores.filter(t => t.score < 40).length
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      total: trustScores.length
    })
  } catch (error) {
    console.error('Trust scores error:', error)
    return NextResponse.json(
      { error: "获取数据失败" },
      { status: 500 }
    )
  }
}