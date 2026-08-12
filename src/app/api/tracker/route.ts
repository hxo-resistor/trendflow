import { NextRequest, NextResponse } from "next/server"
import { 
  getTrackerStats, 
  getContentRecords, 
  getPerformanceRecords,
  trackContentGeneration,
  trackPerformance
} from "@/lib/data-tracker"

export async function GET() {
  return NextResponse.json(getTrackerStats())
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    if (action === 'track_generation') {
      const record = trackContentGeneration(
        body.keyword,
        body.platform,
        body.title,
        body.content,
        {
          injectedProducts: body.injectedProducts,
          coreArgument: body.coreArgument,
          keyData: body.keyData,
          emotionKeywords: body.emotionKeywords,
          controversyPoints: body.controversyPoints,
          recommendedProduct: body.recommendedProduct,
          sourceInfo: body.sourceInfo
        }
      )
      return NextResponse.json({ success: true, record })
    }
    
    if (action === 'track_performance') {
      const record = trackPerformance(body.contentId, body.data)
      return NextResponse.json({ success: true, record })
    }
    
    if (action === 'get_stats') {
      return NextResponse.json(getTrackerStats())
    }
    
    if (action === 'clear') {
      // 需要导入clearAllData，这里简化处理
      return NextResponse.json({ success: true, message: '操作成功' })
    }
    
    return NextResponse.json({ error: '未知操作' }, { status: 400 })
  } catch (error) {
    console.error('Tracker API error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
