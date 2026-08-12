import { NextRequest, NextResponse } from "next/server"

/**
 * Feedback Collection API
 * Receives performance data from external platforms for evolution analysis
 */

// In-memory storage for feedback records
const feedbackStore = new Map<string, any[]>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Support both single record and batch
    let feedbacks: any[] = []
    
    if (Array.isArray(body)) {
      feedbacks = body
    } else if (body.keyword || body.platform) {
      feedbacks = [body]
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid feedback format" 
      }, { status: 400 })
    }
    
    const storedRecords = []
    
    for (const item of feedbacks) {
      const record = {
        keyword: item.keyword || 'unknown',
        platform: item.platform || 'unknown',
        views: item.views || 0,
        likes: item.likes || 0,
        comments: item.comments || 0,
        conversions: item.conversions || 0,
        recordedAt: new Date().toISOString()
      }
      
      // Store with composite key for lookup
      const key = `${record.keyword}-${record.platform}`
      const existing = feedbackStore.get(key) || []
      existing.push(record)
      feedbackStore.set(key, existing)
      
      storedRecords.push(record)
    }
    
    return NextResponse.json({
      success: true,
      message: `成功接收 ${storedRecords.length} 条反馈数据`,
      stored: storedRecords.length,
      totalInStorage: Array.from(feedbackStore.values()).flat().length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Feedback store error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "反馈存储失败" 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const allFeedbacks = Array.from(feedbackStore.values()).flat()
    
    // Calculate summary stats
    const summary = {
      totalRecords: allFeedbacks.length,
      totalViews: allFeedbacks.reduce((sum, r) => sum + r.views, 0),
      totalLikes: allFeedbacks.reduce((sum, r) => sum + r.likes, 0),
      totalComments: allFeedbacks.reduce((sum, r) => sum + r.comments, 0),
      totalConversions: allFeedbacks.reduce((sum, r) => sum + r.conversions, 0),
      avgEngagementRate: allFeedbacks.length > 0 
        ? ((allFeedbacks.reduce((sum, r) => sum + r.likes + r.comments, 0) / allFeedbacks.reduce((sum, r) => sum + r.views, 1)) * 100).toFixed(2)
        : '0'
    }
    
    return NextResponse.json({
      success: true,
      summary,
      records: allFeedbacks.slice(-20).reverse(), // Last 20 records
      total: allFeedbacks.length
    })
  } catch (error) {
    console.error("Feedback GET error:", error)
    return NextResponse.json({ error: "获取反馈数据失败" }, { status: 500 })
  }
}
