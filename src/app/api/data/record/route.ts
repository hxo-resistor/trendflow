import { NextResponse } from 'next/server'

/**
 * 快速数据录入API
 * POST /api/data/record
 */

interface RecordData {
  source: string
  type: string
  quantity: string
  product: string
  timestamp?: string
}

export async function POST(request: Request) {
  try {
    const body: RecordData = await request.json()
    
    // 验证必填字段
    if (!body.source || !body.type || !body.quantity || !body.product) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      )
    }

    // 记录到localStorage（生产环境应使用数据库）
    const record = {
      id: `rec-${Date.now()}`,
      ...body,
      timestamp: body.timestamp || new Date().toISOString()
    }

    // 获取现有记录
    const existing = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('trendflow_records') || '[]')
      : []
    
    // 追加新记录
    const updated = [...existing, record]
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('trendflow_records', JSON.stringify(updated))
    }

    return NextResponse.json({
      success: true,
      record,
      total: updated.length,
      message: '记录成功'
    })
  } catch (error) {
    console.error('Record error:', error)
    return NextResponse.json(
      { error: '记录失败' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const records = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('trendflow_records') || '[]')
      : []

    return NextResponse.json({
      success: true,
      records,
      count: records.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: '获取失败' },
      { status: 500 }
    )
  }
}
