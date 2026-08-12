import { NextRequest, NextResponse } from "next/server"
import type { SimulateResult, TopSource } from "@/lib/aeo-engine"

/**
 * AEO AI引用模拟器
 * 模拟AI助手回答时的内容引用逻辑
 */

// 模拟的当前网络热门内容源
const MOCK_TOP_SOURCES: Array<{
  keyword: string
  url: string
  title: string
  aeoScore: number
  whyCited: string
  strengths: string[]
  weaknesses: string[]
}> = [
  {
    keyword: "智能宠物喂食器",
    url: "https://www.zhihu.com/question/12345",
    title: "智能宠物喂食器哪个牌子好？2024年深度测评",
    aeoScore: 92,
    whyCited: "高权威度知乎回答，数据详实，引用多家品牌官方数据",
    strengths: ["结构化数据丰富", "有专业评测机构背书", "FAQ完整"],
    weaknesses: ["部分内容过时", "缺少价格对比表格"]
  },
  {
    keyword: "智能宠物喂食器",
    url: "https://www.xiaohongshu.com/explore/67890",
    title: "用了半年智能喂食器，说点大实话...",
    aeoScore: 85,
    whyCited: "真实用户体验分享，情感共鸣强，评论互动率高",
    strengths: ["真实体验感强", "有详细的使用场景描述", "图片和视频丰富"],
    weaknesses: ["主观性强", "缺乏客观数据支撑"]
  },
  {
    keyword: "智能宠物喂食器",
    url: "https://blog.csdn.net/article/abc123",
    title: "智能宠物喂食器技术原理与选购指南",
    aeoScore: 78,
    whyCited: "技术角度分析深入，适合专业人士参考",
    strengths: ["技术参数详细", "对比表格清晰"],
    weaknesses: ["阅读门槛高", "不够通俗"]
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword } = body

    if (!keyword) {
      return NextResponse.json(
        { error: "缺少必要参数: keyword" },
        { status: 400 }
      )
    }

    // 模拟AI引用分析
    const result: SimulateResult = simulateAINavigation(keyword)
    
    return NextResponse.json({
      success: true,
      ...result,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Simulate API error:", error)
    return NextResponse.json(
      { error: "模拟失败" },
      { status: 500 }
    )
  }
}

function simulateAINavigation(keyword: string): SimulateResult {
  // 基于关键词查找匹配的模拟数据
  const matchedSources = MOCK_TOP_SOURCES.filter(s => 
    s.keyword === keyword || keyword.includes(s.keyword) || s.keyword.includes(keyword)
  )
  
  const currentTopSources: TopSource[] = matchedSources.length > 0 
    ? matchedSources.map(s => ({
        url: s.url,
        title: s.title,
        aeoScore: s.aeoScore,
        whyCited: s.whyCited,
        strengths: s.strengths,
        weaknesses: s.weaknesses
      }))
    : MOCK_TOP_SOURCES.slice(0, 3).map(s => ({
        url: s.url,
        title: s.title.replace(/2024/g, keyword),
        aeoScore: s.aeoScore,
        whyCited: s.whyCited,
        strengths: s.strengths,
        weaknesses: s.weaknesses
      }))
  
  // 生成优化计划
  const ourOptimizationPlan = generateOptimizationPlan(currentTopSources, keyword)
  
  // 估算进入前3的时间
  const estimatedTime = calculateTimeToTop3(ourOptimizationPlan.expectedScore)
  
  // 生成分析报告
  const analysisReport = generateAnalysisReport(keyword, currentTopSources, ourOptimizationPlan)
  
  return {
    keyword,
    currentTopSources,
    ourOptimizationPlan,
    estimatedTimeToTop3: estimatedTime,
    analysisReport
  }
}

function generateOptimizationPlan(topSources: TopSource[], keyword: string) {
  const steps: any[] = []
  let expectedScore = 50
  
  // 分析竞品弱点
  const commonWeaknesses = new Set<string>()
  topSources.forEach(source => {
    source.weaknesses.forEach(w => commonWeaknesses.add(w))
  })
  
  // 生成优化步骤
  steps.push({
    step: 1,
    action: `创建${keyword}的深度测评文章`,
    expectedImprovement: 15,
    priority: 1
  })
  expectedScore += 15
  
  if (commonWeaknesses.has("缺少价格对比表格")) {
    steps.push({
      step: 2,
      action: "添加详细的价格对比表格",
      expectedImprovement: 10,
      priority: 2
    })
    expectedScore += 10
  }
  
  steps.push({
    step: 3,
    action: "添加完整的FAQ段落（至少5个问题）",
    expectedImprovement: 12,
    priority: 3
  })
  expectedScore += 12
  
  steps.push({
    step: 4,
    action: "添加Product和Review Schema标记",
    expectedImprovement: 8,
    priority: 4
  })
  expectedScore += 8
  
  steps.push({
    step: 5,
    action: "在文章开头添加数据摘要",
    expectedImprovement: 5,
    priority: 5
  })
  expectedScore += 5
  
  // 确保不超过100分
  expectedScore = Math.min(100, expectedScore)
  
  return {
    steps,
    expectedScore,
    timeline: "预计2-3周内完成所有优化步骤"
  }
}

function calculateTimeToTop3(expectedScore: number): string {
  if (expectedScore >= 90) return "1-2周"
  if (expectedScore >= 80) return "2-4周"
  if (expectedScore >= 70) return "1-2个月"
  return "2-3个月"
}

function generateAnalysisReport(keyword: string, sources: TopSource[], plan: any): string {
  let report = `## ${keyword} AI引用竞争分析报告\n\n`
  report += `### 当前Top 3来源分析\n\n`
  
  sources.forEach((source, index) => {
    report += `**#${index + 1}** ${source.title}\n`
    report += `- AEO权威分: ${source.aeoScore}\n`
    report += `- 引用原因: ${source.whyCited}\n`
    report += `- 优势: ${source.strengths.join('、')}\n`
    report += `- 弱点: ${source.weaknesses.join('、')}\n\n`
  })
  
  report += `### 我们的优化策略\n\n`
  report += `预期可达到的AEO分数: **${plan.expectedScore}**\n\n`
  report += `优化步骤:\n`
  plan.steps.forEach((step: any) => {
    report += `${step.step}. ${step.action} (+${step.expectedImprovement}分)\n`
  })
  
  report += `\n### 预估进入Top 3时间\n`
  report += `根据当前优化计划，预计需要 **${plan.timeline}**。`
  
  return report
}
