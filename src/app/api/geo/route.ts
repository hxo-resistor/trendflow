import { NextRequest, NextResponse } from "next/server"
import { calculateGEOScore, canPublish, getOptimizationSuggestions } from "@/lib/geo-scorer"
import { injectStructure } from "@/lib/geo-structure-engine"
import { embedDataAnchors, calculateDataCoverage } from "@/lib/geo-data-anchors"
import { checkProductConsistency } from "@/lib/geo-consistency"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    // 内容GEO评分
    if (action === 'score') {
      const { content, productId, platform } = data
      
      if (!content) {
        return NextResponse.json(
          { error: "请提供内容" },
          { status: 400 }
        )
      }
      
      const score = calculateGEOScore(content, { productId, platform })
      const verdict = canPublish(score)
      const suggestions = getOptimizationSuggestions(score)
      
      return NextResponse.json({
        success: true,
        score,
        verdict,
        suggestions
      })
    }
    
    // 结构化注入
    if (action === 'structure') {
      const { content, productId, personaId } = data
      
      if (!content) {
        return NextResponse.json(
          { error: "请提供内容" },
          { status: 400 }
        )
      }
      
      const structured = injectStructure(content, productId, personaId)
      const coverage = calculateDataCoverage(structured.structured)
      
      return NextResponse.json({
        success: true,
        original: structured.original,
        structured: structured.structured,
        type: structured.type,
        confidence: structured.confidence,
        dataCoverage: coverage
      })
    }
    
    // 数据锚点嵌入
    if (action === 'embed-anchors') {
      const { content, productId, category } = data
      
      if (!content) {
        return NextResponse.json(
          { error: "请提供内容" },
          { status: 400 }
        )
      }
      
      const { generateDataAnchors } = await import('@/lib/geo-data-anchors')
      const anchors = generateDataAnchors(productId, category)
      const result = embedDataAnchors(content, anchors, productId)
      
      return NextResponse.json({
        success: true,
        original: content,
        withAnchors: result.content,
        anchored: result.anchored,
        anchorCount: anchors.length
      })
    }
    
    // 一致性检查
    if (action === 'consistency') {
      const { productId, platforms, contents } = data
      
      if (!productId || !platforms || !contents) {
        return NextResponse.json(
          { error: "请提供产品ID、平台列表和内容" },
          { status: 400 }
        )
      }
      
      const check = checkProductConsistency(productId, platforms, contents)
      
      return NextResponse.json({
        success: true,
        check
      })
    }
    
    return NextResponse.json(
      { error: "未知操作" },
      { status: 400 }
    )
  } catch (error) {
    console.error('GEO API error:', error)
    return NextResponse.json(
      { error: "处理失败" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  try {
    if (action === 'threshold') {
      return NextResponse.json({
        success: true,
        threshold: {
          publish: 70,
          optimal: 85,
          reject: 50
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: "GEO优化引擎API",
      endpoints: [
        "POST /api/geo/score - 内容评分",
        "POST /api/geo/structure - 结构化注入",
        "POST /api/geo/embed-anchors - 数据锚点嵌入",
        "POST /api/geo/consistency - 一致性检查"
      ]
    })
  } catch (error) {
    console.error('GEO GET error:', error)
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    )
  }
}