import { NextRequest, NextResponse } from "next/server"
import { generateQuestions, batchGenerateQuestions, exportQuestionsToCSV, getHotQuestionCombination } from "@/lib/question-engine"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const keyword = searchParams.get('keyword')
  
  try {
    // 为单个关键词生成问题
    if (action === 'generate' && keyword) {
      const count = parseInt(searchParams.get('count') || '50')
      const questions = generateQuestions(keyword, count)
      
      return NextResponse.json({
        success: true,
        keyword,
        count: questions.length,
        data: questions
      })
    }
    
    // 批量生成问题（多个关键词）
    if (action === 'batch') {
      const keywordsParam = searchParams.get('keywords')
      if (!keywordsParam) {
        return NextResponse.json(
          { error: "请提供keywords参数" },
          { status: 400 }
        )
      }
      
      const keywords = keywordsParam.split(',').map(k => k.trim())
      const countPerKeyword = parseInt(searchParams.get('count') || '50')
      const questions = batchGenerateQuestions(keywords, countPerKeyword)
      
      return NextResponse.json({
        success: true,
        totalGenerated: questions.length,
        keywords: keywords.length,
        data: questions
      })
    }
    
    // 获取热门问题组合
    if (action === 'hot' && keyword) {
      const result = getHotQuestionCombination(keyword)
      
      return NextResponse.json({
        success: true,
        keyword,
        ...result
      })
    }
    
    // 导出CSV
    if (action === 'export' && keyword) {
      const count = parseInt(searchParams.get('count') || '50')
      const questions = generateQuestions(keyword, count)
      const csv = exportQuestionsToCSV(questions)
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${keyword}-questions.csv"`
        }
      })
    }
    
    // 默认返回示例
    return NextResponse.json({
      success: true,
      message: "问题库引擎API",
      usage: {
        generate: "/api/questions?action=generate&keyword=智能喂食器&count=50",
        batch: "/api/questions?action=batch&keywords=喂食器,猫砂,玩具&count=30",
        hot: "/api/questions?action=hot&keyword=蓝牙耳机",
        export: "/api/questions?action=export&keyword=宠物用品&count=100"
      }
    })
  } catch (error) {
    console.error('Question engine error:', error)
    return NextResponse.json(
      { error: "生成问题失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, count = 50, category } = body
    
    if (!keyword) {
      return NextResponse.json(
        { error: "缺少keyword参数" },
        { status: 400 }
      )
    }
    
    const questions = generateQuestions(keyword, count)
    
    // 如果指定了分类，过滤
    let filtered = questions
    if (category) {
      filtered = questions.filter(q => q.category === category)
    }
    
    return NextResponse.json({
      success: true,
      keyword,
      total: filtered.length,
      data: filtered
    })
  } catch (error) {
    console.error('Question engine error:', error)
    return NextResponse.json(
      { error: "生成问题失败" },
      { status: 500 }
    )
  }
}