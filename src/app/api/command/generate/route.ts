import { NextRequest, NextResponse } from "next/server"
import { generateContent } from "@/lib/intelligence-engine"
import { matchProducts, injectProducts } from "@/lib/affiliate-utils"
import type { Product } from "@/lib/affiliate-types"

/**
 * 内容军工厂 - 批量生成多平台内容矩阵
 */

interface FactoryRequest {
  keyword: string
  platforms: string[]
  countPerPlatform: number
  opportunity?: string
}

interface ContentItem {
  id: string
  platform: string
  angle: string
  title: string
  content: string
  monetizedContent: string | null
  insertedProducts: any[]
  estimatedCommission: string
  persona: string
  bestTime: string
}

// 各平台的爆款标题模板
const TITLE_TEMPLATES: Record<string, Array<(keyword: string) => string>> = {
  xiaohongshu: [
    (kw) => `被问爆了！${kw}到底值不值得买？真实测评来了`,
    (kw) => `${kw}避坑指南｜5年资深玩家血泪总结`,
    (kw) => `后悔没早知道！${kw}的这些隐藏功能90%的人不知道`,
    (kw) => `${kw}深度测评｜看完这篇再决定要不要买`,
    (kw) => `全网最详细的${kw}选购攻略！小白必看`,
  ],
  zhihu: [
    (kw) => `如何看待${kw}在国内的流行趋势？`,
    (kw) => `${kw}值得买吗？从这三个维度分析告诉你真相`,
    (kw) => `使用${kw}三个月后，来说说我的真实感受`,
    (kw) => `${kw}和传统方案的对比：哪个更适合中国家庭？`,
    (kw) => `为什么越来越多人选择${kw}？背后的逻辑是什么`,
  ],
  weibo: [
    (kw) => `#${kw}# 你们觉得这个趋势怎么样？聊聊`,
    (kw) => `今天聊点${kw}，你踩过哪些坑？`,
    (kw) => `实测${kw}一周，说说优缺点#种草# #拔草#`,
    (kw) => `{kw}值不值得入？我来告诉你实话`,
    (kw) => `关于${kw}，这篇文章说透了`,
  ],
  douyin: [
    (kw) => `${kw}使用教程：3分钟教会你所有功能`,
    (kw) => `千万别买${kw}，除非你看完这个视频`,
    (kw) => `${kw}开箱测评｜效果太惊艳了`,
    (kw) => `${kw}十大使用技巧，最后一个绝了`,
    (kw) => `挑战全网最便宜的${kw}，你能接受吗`,
  ],
  wechat: [
    (kw) => `深度：${kw}如何改变我们的生活方式`,
    (kw) => `${kw}选购全攻略：从入门到精通`,
    (kw) => `实测一个月，我为什么推荐${kw}`,
    (kw) => `${kw}的真相：你不得不知道的5件事`,
    (kw) => `从${kw}看消费升级的趋势`,
  ],
}

// 各平台的差异化内容策略
const CONTENT_STRATEGIES: Record<string, Array<{ angle: string; description: string }>> = {
  xiaohongshu: [
    { angle: "种草", description: "以亲身体验分享为主，强调使用场景和情感共鸣" },
    { angle: "测评", description: "客观评测优缺点，建立信任感" },
    { angle: "避坑", description: "指出常见误区，提供实用建议" },
    { angle: "对比", description: "横向对比不同产品，帮助决策" },
    { angle: "攻略", description: "系统性介绍，成为权威指南" },
  ],
  zhihu: [
    { angle: "深度分析", description: "从专业角度拆解问题本质" },
    { angle: "经验分享", description: "以过来人身份分享实战经验" },
    { angle: "争议讨论", description: "引发思考，促进互动" },
    { angle: "数据论证", description: "用数据说话，增强说服力" },
    { angle: "趋势解读", description: "洞察行业趋势，展示前瞻性" },
  ],
  weibo: [
    { angle: "热点蹭流", description: "借势热门话题扩大曝光" },
    { angle: "互动提问", description: "引导用户评论参与" },
    { angle: "观点输出", description: "鲜明立场引发讨论" },
    { angle: "实用技巧", description: "简短干货，便于传播" },
    { angle: "情绪共鸣", description: "触动情感，激发转发" },
  ],
  douyin: [
    { angle: "口播讲解", description: "真人出镜，增强信任" },
    { angle: "剧情植入", description: "场景化展示使用效果" },
    { angle: "干货教学", description: "解决问题导向" },
    { angle: "开箱测评", description: "第一视角体验" },
    { angle: "挑战赛", description: "参与热门挑战获取流量" },
  ],
  wechat: [
    { angle: "深度故事", description: "通过故事传递价值" },
    { angle: "清单汇总", description: "系统性整理，便于收藏" },
    { angle: "案例解析", description: "真实案例证明效果" },
    { angle: "趋势报告", description: "行业洞察，建立专业形象" },
    { angle: "实用手册", description: "操作步骤清晰可执行" },
  ],
}

// 账号人设库
const PERSONAS = [
  { id: "mom", name: "宝妈", style: "亲切、接地气、注重性价比" },
  { id: "student", name: "学生党", style: "活泼、爱玩、价格敏感" },
  { id: "pro", name: "专业人士", style: "严谨、有深度、强调专业度" },
  { id: "geek", name: "发烧友", style: "懂行、追求极致、重参数" },
  { id: "normal", name: "普通用户", style: "真实、中立、代表大众视角" },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as FactoryRequest
    const { 
      keyword, 
      platforms = ["xiaohongshu", "zhihu", "weibo"],
      countPerPlatform = 5,
      opportunity 
    } = body

    if (!keyword || !opportunity) {
      return NextResponse.json(
        { error: "缺少必要参数: keyword, opportunity" },
        { status: 400 }
      )
    }

    const results: ContentItem[] = []
    let totalEstimatedRevenue = 0

    // 遍历每个平台生成内容
    for (const platform of platforms) {
      // 获取该平台的内容策略角度
      const angles = CONTENT_STRATEGIES[platform] || CONTENT_STRATEGIES.xiaohongshu
      const titleTemplates = TITLE_TEMPLATES[platform] || TITLE_TEMPLATES.xiaohongshu
      
      // 为每个角度生成一篇内容
      for (let i = 0; i < Math.min(countPerPlatform, angles.length); i++) {
        const angle = angles[i]
        
        // 生成基础内容
        const baseContent = await generateContent({
          trendTitle: `${keyword} ${angle.angle}`,
          opportunity,
          platform,
          keyword,
        })

        // 匹配商品并注入推广
        const matchedProducts: Product[] = matchProducts(baseContent.content, platform)
        let monetizedResult = null
        let insertedProducts: any[] = []
        let estimatedCommission = ""

        if (matchedProducts.length > 0) {
          monetizedResult = injectProducts(baseContent.content, matchedProducts, platform)
          insertedProducts = monetizedResult.insertedProducts
          estimatedCommission = monetizedResult.estimatedCommission
          totalEstimatedRevenue += parseInt(estimatedCommission) || 10
        }

        // 确定最佳发布时间
        const bestTimes = getBestPublishTime(platform)
        
        // 分配人设
        const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)]

        results.push({
          id: `factory-${Date.now()}-${platform}-${i}`,
          platform,
          angle: angle.angle,
          title: titleTemplates[i % titleTemplates.length]?.(keyword) || `${keyword} ${angle.angle}`,
          content: baseContent.content,
          monetizedContent: monetizedResult?.monetizedContent || null,
          insertedProducts,
          estimatedCommission,
          persona: persona.name,
          bestTime: bestTimes[i % bestTimes.length],
        })
      }
    }

    return NextResponse.json({
      success: true,
      keyword,
      totalContents: results.length,
      contents: results,
      summary: {
        byPlatform: results.reduce((acc, item) => {
          acc[item.platform] = (acc[item.platform] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        totalEstimateRevenue: `¥${Math.round(totalEstimatedRevenue / results.length)}-¥${Math.round(totalEstimatedRevenue * 2 / results.length)}/月`,
        generatedAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error("Factory generation error:", error)
    return NextResponse.json(
      { error: "工厂生成失败" },
      { status: 500 }
    )
  }
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
