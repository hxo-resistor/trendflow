import { NextRequest, NextResponse } from "next/server"

/**
 * 截流系统 - 实时监控热点，快速响应生成内容
 */

interface HotspotSignal {
  id: string
  keyword: string
  source: string
  platform: string
  heat: number
  trend: 'rising' | 'stable' | 'falling'
  peakTime: string
  competition: 'low' | 'medium' | 'high'
  opportunity: string
  recommendedPlatforms: string[]
  recommendedAction: string
}

// 热点监控缓存（每5分钟刷新）
let hotspots: HotspotSignal[] = []
let lastRefreshTime = 0

// 模拟热点数据源（生产环境应接入真实API）
const HOTSPOT_SOURCES = [
  { keyword: "智能喂食器", source: "小红书", platform: "xiaohongshu", heat: 95, trend: "rising" as const },
  { keyword: "扫地机器人", source: "知乎", platform: "zhihu", heat: 91, trend: "rising" as const },
  { keyword: "蓝牙耳机", source: "微博", platform: "weibo", heat: 88, trend: "stable" as const },
  { keyword: "猫砂推荐", source: "抖音", platform: "douyin", heat: 92, trend: "rising" as const },
  { keyword: "空气炸锅", source: "淘宝", platform: "taobao", heat: 85, trend: "stable" as const },
  { keyword: "瑜伽垫", source: "小红书", platform: "xiaohongshu", heat: 78, trend: "falling" as const },
  { keyword: "儿童推车", source: "知乎", platform: "zhihu", heat: 82, trend: "rising" as const },
  { keyword: "行车记录仪", source: "B站", platform: "douyin", heat: 75, trend: "stable" as const },
]

export async function GET(request: NextRequest) {
  const now = Date.now()
  
  // 如果缓存过期，刷新数据
  if (!hotspots || (now - lastRefreshTime) > 5 * 60 * 1000) {
    hotspots = generateMockHotspots()
    lastRefreshTime = now
  }

  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter')
  
  let result = hotspots
  
  if (filter === 'rising') {
    result = hotspots.filter(h => h.trend === 'rising')
  } else if (filter === 'low_competition') {
    result = hotspots.filter(h => h.competition === 'low')
  }

  return NextResponse.json({
    success: true,
    hotspots: result,
    total: result.length,
    lastUpdated: new Date(lastRefreshTime).toLocaleString('zh-CN'),
    interceptWindow: "5分钟内响应效果最佳",
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, autoGenerate = true } = body

    // 匹配热点
    const matchedHotspot = hotspots.find(h => 
      h.keyword.includes(keyword) || keyword.includes(h.keyword)
    )

    if (!matchedHotspot) {
      return NextResponse.json(
        { error: "未检测到相关热点，建议先手动搜索" },
        { status: 404 }
      )
    }

    // 生成截流内容
    const interceptContent = generateInterceptContent(matchedHotspot, keyword)

    return NextResponse.json({
      success: true,
      hotspot: matchedHotspot,
      interceptContent,
      action: autoGenerate ? "已生成截流内容" : "建议行动指南",
      urgency: matchedHotspot.trend === 'rising' ? 'HIGH' : 'MEDIUM',
    })
  } catch (error) {
    console.error("Intercept error:", error)
    return NextResponse.json(
      { error: "截流操作失败" },
      { status: 500 }
    )
  }
}

// 生成截流内容模板
function generateInterceptContent(hotspot: HotspotSignal, keyword: string) {
  const templates = {
    xiaohongshu: {
      title: `紧急！${keyword}突然爆火🔥看完这篇再入手`,
      hook: `姐妹们！最近${keyword}在小红书上真的火到不行，我研究了三天三夜，终于把门道摸清楚了！`,
      body: `【为什么突然火了】\n${keyword}之所以能在短时间内成为热搜，背后有几个关键原因...\n\n【怎么买才不踩坑】\n1️⃣ 先看成分/参数\n2️⃣ 查真实测评\n3️⃣ 对比价格\n\n【我的建议】\n如果你正好需要${keyword}，现在正是好时机！但我建议...`,
      cta: `关注我，持续追踪${keyword}最新动向！👉`,
      hashtags: `#${keyword} #避坑指南 #好物分享 #趋势观察`
    },
    zhihu: {
      title: `${keyword}为什么突然火了？深度分析背后的逻辑`,
      hook: `谢邀。作为一个关注${keyword}赛道多年的从业者，谈谈我的看法。`,
      body: `一、现象观察\n${keyword}最近在各大平台迅速升温，这并非偶然...\n\n二、底层逻辑\n这种现象反映了几个深层需求：\n1. 消费升级的必然结果\n2. 信息差的缩小\n3. 情绪价值的凸显\n\n三、如何理性看待\n虽然热度高，但我们也要保持清醒...\n\n四、机会在哪里\n对于普通人来说，${keyword}仍然是一个值得关注的领域...`,
      cta: `如果觉得有启发，点个赞支持一下~`
    },
    weibo: {
      title: `#${keyword}# 突然上热搜了，你怎么看？`,
      hook: `刷到#${keyword}#上了热搜，忍不住来聊聊。`,
      body: `${keyword}这个产品最近风很大啊，身边好几个朋友都在问。说实话我之前也观望过，但看了看评测，觉得...\n\n你们怎么看？觉得值得入手的扣1，觉得是智商税的扣2。`,
      cta: `#种草# #拔草# #数码#`
    },
    douyin: {
      title: `${keyword}突然火了？看完这个视频再决定要不要买！`,
      hook: `[开场冲击] 注意看，这个东西突然在网上爆火，很多博主都在推，但真相是...`,
      body: `[问题引出] ${keyword}为什么突然火了？\n[案例分析] 我研究了10款热门产品...\n[真实测评] 用了一周，说说我的感受...\n[避坑指南] 买之前必看这三点...\n[结论] 你觉得值不值？评论区告诉我`,
      cta: `点赞关注，下期讲${keyword}的隐藏用法！`
    },
    wechat: {
      title: `深度｜${keyword}爆火的背后，藏着什么商机？`,
      hook: `最近，${keyword}这个话题突然火了。作为一名长期关注消费趋势的人，我想和大家聊聊这件事。`,
      body: `一、从现象看本质\n${keyword}的突然走红，其实折射出三个重要趋势...\n\n二、市场机会在哪里\n对于创业者来说，这个机会窗口期还有多久？\n\n三、给普通人的建议\n如果你想抓住这波流量...\n\n四、风险提示\n当然，任何风口都有风险...\n\n---\n*以上为个人观点，不构成投资建议*`,
      cta: `觉得有用，点个「在看」支持~`
    }
  }

  return {
    platforms: Object.fromEntries(
      Object.entries(templates).map(([platform, template]) => [
        platform,
        { ...template, keyword, estimatedTraffic: Math.floor(Math.random() * 5000) + 1000 }
      ])
    ),
    recommendedPlatforms: hotspot.recommendedPlatforms,
    actionPriority: hotspot.trend === 'rising' ? 'IMMEDIATE' : 'SOON',
  }
}

// 生成模拟热点数据
function generateMockHotspots(): HotspotSignal[] {
  return HOTSPOT_SOURCES.map((source, index) => ({
    id: `hs-${index + 1}`,
    keyword: source.keyword,
    source: source.source,
    platform: source.platform,
    heat: source.heat,
    trend: source.trend,
    peakTime: getPeakTime(source.heat),
    competition: getCompetitionLevel(source.heat),
    opportunity: generateOpportunity(source.keyword, source.trend),
    recommendedPlatforms: ['小红书', '知乎', '微博'],
    recommendedAction: source.trend === 'rising' ? '立即响应，抢占先机' : '持续关注，择机而入',
  }))
}

function getPeakTime(heat: number): string {
  if (heat >= 90) return "未来2-4小时"
  if (heat >= 80) return "未来6-12小时"
  return "未来24小时内"
}

function getCompetitionLevel(heat: number): 'low' | 'medium' | 'high' {
  if (heat >= 90) return 'high'
  if (heat >= 80) return 'medium'
  return 'low'
}

function generateOpportunity(keyword: string, trend: string): string {
  const opportunities: Record<string, string> = {
    rising: `【${keyword}】正处于上升期，现在是截流的好时机！建议立即生成${keyword}相关内容，抢占关键词排名。`,
    stable: `【${keyword}】热度稳定，竞争适中。可以生产差异化内容，建立长期流量入口。`,
    falling: `【${keyword}】热度下降，建议转向相关新品类。可关注${keyword}的替代品或升级版本。`,
  }
  return opportunities[trend] || opportunities.stable
}
