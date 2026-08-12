import { NextRequest, NextResponse } from "next/server"
import { generateContent } from "@/lib/intelligence-engine"
import { matchProducts, injectProducts } from "@/lib/affiliate-utils"
import type { Product } from "@/lib/affiliate-types"
import type { GeneratedContent, ProduceResult, ContentAngle } from "@/lib/nexus-types"

/**
 * Nexus 生产层 - 内容蜂群API
 * 目标：一个选题，蜂群并行生成多篇文章
 */

// 10个分析角度探针
const ANGLES: ContentAngle[] = [
  { id: "review", name: "深度测评", description: "全面评测产品优缺点", template: "测评" },
  { id: "compare", name: "横向对比", description: "多品牌型号对比", template: "对比" },
  { id: "avoid", name: "避坑指南", description: "指出常见误区", template: "避坑" },
  { id: "guide", name: "选购攻略", description: "系统性选购指南", template: "攻略" },
  { id: "list", name: "盘点汇总", description: "同类产品汇总", template: "盘点" },
  { id: "scene", name: "场景应用", description: "特定场景使用体验", template: "场景" },
  { id: "pain", name: "痛点解决", description: "解决用户核心痛点", template: "痛点" },
  { id: "persona", name: "人群定位", description: "针对不同人群的推荐", template: "人群" },
  { id: "price", name: "价格分析", description: "性价比和价格趋势", template: "价格" },
  { id: "trend", name: "趋势洞察", description: "行业趋势和未来展望", template: "趋势" },
]

// 各平台标题模板
const TITLE_TEMPLATES: Record<string, Array<(keyword: string, angle: string) => string>> = {
  xiaohongshu: [
    (kw, angle) => `被问爆了！${kw}${angle}到底值不值得买？`,
    (kw, angle) => `${kw}${angle}指南｜真实测评来了`,
    (kw, angle) => `后悔没早知道！${kw}的${angle}技巧`,
    (kw, angle) => `${kw}${angle}深度测评｜看完这篇再决定`,
    (kw, angle) => `全网最详细的${kw}${angle}攻略！`,
  ],
  zhihu: [
    (kw, angle) => `如何看待${kw}的${angle}？`,
    (kw, angle) => `${kw}值得买吗？从${angle}维度分析`,
    (kw, angle) => `使用${kw}进行${angle}后的真实感受`,
    (kw, angle) => `${kw}的${angle}：哪个更适合中国家庭？`,
    (kw, angle) => `为什么越来越多人选择${kw}做${angle}？`,
  ],
  weibo: [
    (kw, angle) => `#${kw}#${angle} 你们觉得怎么样？`,
    (kw, angle) => `今天聊聊${kw}的${angle}，你踩过哪些坑？`,
    (kw, angle) => `实测${kw}做${angle}一周，说说优缺点`,
    (kw, angle) => `${kw}的${angle}值不值得入？我来告诉你实话`,
    (kw, angle) => `关于${kw}的${angle}，这篇文章说透了`,
  ],
  douyin: [
    (kw, angle) => `${kw}的${angle}教程：3分钟教会你`,
    (kw, angle) => `千万别买${kw}，除非你看完这个${angle}视频`,
    (kw, angle) => `${kw}${angle}开箱测评｜效果太惊艳了`,
    (kw, angle) => `${kw}十大${angle}技巧，最后一个绝了`,
    (kw, angle) => `挑战全网最便宜的${kw}${angle}方案`,
  ],
  wechat: [
    (kw, angle) => `深度：${kw}的${angle}如何改变我们的生活方式`,
    (kw, angle) => `${kw}${angle}全攻略：从入门到精通`,
    (kw, angle) => `实测一个月，我为什么推荐${kw}做${angle}`,
    (kw, angle) => `${kw}的${angle}真相：你不得不知道的5件事`,
    (kw, angle) => `从${kw}的${angle}看消费趋势`,
  ],
}

// 人设库
const PERSONAS = [
  { id: "mom", name: "宝妈", style: "亲切、接地气、注重性价比" },
  { id: "student", name: "学生党", style: "活泼、爱玩、价格敏感" },
  { id: "pro", name: "专业人士", style: "严谨、有深度、强调专业度" },
  { id: "geek", name: "发烧友", style: "懂行、追求极致、重参数" },
  { id: "normal", name: "普通用户", style: "真实、中立、代表大众视角" },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      keyword, 
      opportunity,
      platforms = ["xiaohongshu", "zhihu", "weibo", "douyin", "wechat"],
      angleCount = 10,
      contentPerAngle = 2,
      autoMonetize = true
    } = body

    if (!keyword || !opportunity) {
      return NextResponse.json(
        { error: "缺少必要参数: keyword, opportunity" },
        { status: 400 }
      )
    }

    const results: GeneratedContent[] = []
    let totalEstimatedRevenue = 0

    // 并行生成内容（蜂群模式）
    const generationTasks = []
    
    for (let angleIdx = 0; angleIdx < Math.min(angleCount, ANGLES.length); angleIdx++) {
      const angle = ANGLES[angleIdx]
      
      for (let platformIdx = 0; platformIdx < platforms.length; platformIdx++) {
        const platform = platforms[platformIdx]
        
        // 为每个平台和角度组合生成内容
        for (let i = 0; i < contentPerAngle; i++) {
          const task = generateContentForAngle({
            keyword,
            opportunity,
            angle,
            platform,
            index: i
          }).then(result => {
            if (result && autoMonetize) {
              const matchedProducts: Product[] = matchProducts(result.content, platform)
              if (matchedProducts.length > 0) {
                const monetizedResult = injectProducts(result.content, matchedProducts, platform)
                result.monetizedContent = monetizedResult.monetizedContent
                result.insertedProducts = monetizedResult.insertedProducts
                result.estimatedCommission = monetizedResult.estimatedCommission
                totalEstimatedRevenue += parseInt(monetizedResult.estimatedCommission) || 10
              }
            }
            return result
          })
          generationTasks.push(task)
        }
      }
    }

    // 并行执行所有生成任务
    const generatedContents = await Promise.all(generationTasks)
    
    // 过滤空结果并排序
    const validContents = generatedContents
      .filter(c => c !== null && c !== undefined)
      .sort((a, b) => {
        // 按平台和角度优先级排序
        const platformOrder: Record<string, number> = { xiaohongshu: 0, zhihu: 1, weibo: 2, douyin: 3, wechat: 4 }
        const angleOrderA = ANGLES.findIndex(ag => ag.id === a.angle)
        const angleOrderB = ANGLES.findIndex(ag => ag.id === b.angle)
        return (platformOrder[a.platform] || 0) - (platformOrder[b.platform] || 0) || angleOrderA - angleOrderB
      })

    const result: ProduceResult = {
      success: true,
      keyword,
      angles: ANGLES.slice(0, angleCount),
      titles: validContents.map(c => c.title),
      contents: validContents,
      totalGenerated: validContents.length,
      estimatedRevenue: `¥${Math.round(totalEstimatedRevenue / Math.max(validContents.length, 1))}-¥${Math.round(totalEstimatedRevenue * 2 / Math.max(validContents.length, 1))}/月`,
      generatedAt: new Date().toISOString()
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Produce API error:", error)
    return NextResponse.json(
      { error: "蜂群生成失败" },
      { status: 500 }
    )
  }
}

// 为单个角度生成内容
async function generateContentForAngle(params: {
  keyword: string
  opportunity: string
  angle: ContentAngle
  platform: string
  index: number
}): Promise<GeneratedContent> {
  const { keyword, opportunity, angle, platform, index } = params
  
  // 生成标题
  const titleTemplates = TITLE_TEMPLATES[platform] || TITLE_TEMPLATES.xiaohongshu
  const titleTemplate = titleTemplates[index % titleTemplates.length]
  const title = titleTemplate(keyword, angle.name)
  
  // 生成内容
  const baseContent = await generateContent({
    trendTitle: `${keyword} ${angle.name}`,
    opportunity,
    platform,
    keyword,
  })
  
  // 分配人设
  const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)]
  
  // 最佳发布时间
  const bestTimes = getBestPublishTime(platform)
  const bestTime = bestTimes[index % bestTimes.length]
  
  return {
    id: `produce-${Date.now()}-${platform}-${angle.id}-${index}`,
    angle: angle.name,
    title,
    content: baseContent.content,
    platform,
    persona: persona.name,
    bestTime,
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Nexus Produce API",
    supportedAngles: ANGLES.length,
    supportedPlatforms: Object.keys(TITLE_TEMPLATES).length,
    endpoints: ["POST /api/nexus/produce"]
  })
}

// 获取平台最佳发布时间
function getBestPublishTime(platform: string): string[] {
  const schedules: Record<string, string[]> = {
    xiaohongshu: ["12:00-13:00", "18:00-20:00", "21:00-22:00"],
    zhihu: ["08:00-09:00", "12:00-13:00", "20:00-22:00"],
    weibo: ["08:00-09:00", "12:00-13:00", "18:00-19:00", "21:00-22:00"],
    douyin: ["12:00-13:00", "18:00-20:00", "21:00-23:00"],
    wechat: ["07:00-08:00", "12:00-13:00", "20:00-21:00"],
  }
  return schedules[platform] || schedules.xiaohongshu
}
