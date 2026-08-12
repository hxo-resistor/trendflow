import { NextRequest, NextResponse } from "next/server"

/**
 * AEO 效果追踪API
 * 记录AI引用模拟结果，追踪权威度变化
 */

interface TrackingRecord {
  id: string
  keyword: string
  simulationResult: any
  aeoScoreBefore: number
  aeoScoreAfter: number
  discoverabilityScore: number
  timestamp: string
}

// 内存存储（生产环境应使用数据库）
let trackingRecords: TrackingRecord[] = []

export async function GET() {
  return NextResponse.json({
    success: true,
    records: trackingRecords.slice(-50).reverse(),
    stats: {
      totalSimulations: trackingRecords.length,
      averageDiscoverability: trackingRecords.length > 0
        ? Math.round(trackingRecords.reduce((sum, r) => sum + r.discoverabilityScore, 0) / trackingRecords.length)
        : 0,
      lastUpdated: trackingRecords.length > 0 
        ? trackingRecords[trackingRecords.length - 1].timestamp 
        : null
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, simulationResult, aeoScoreBefore, aeoScoreAfter, discoverabilityScore } = body
    
    if (!keyword || !simulationResult) {
      return NextResponse.json(
        { error: "缺少必要参数: keyword, simulationResult" },
        { status: 400 }
      )
    }
    
    const record: TrackingRecord = {
      id: `track-${Date.now()}`,
      keyword,
      simulationResult,
      aeoScoreBefore: aeoScoreBefore || 0,
      aeoScoreAfter: aeoScoreAfter || simulationResult.ourOptimizationPlan?.expectedScore || 0,
      discoverabilityScore: discoverabilityScore || 50,
      timestamp: new Date().toISOString()
    }
    
    trackingRecords.push(record)
    
    return NextResponse.json({
      success: true,
      record,
      message: "追踪记录已保存"
    })
  } catch (error) {
    console.error("Tracking API error:", error)
    return NextResponse.json(
      { error: "追踪失败" },
      { status: 500 }
    )
  }
}
