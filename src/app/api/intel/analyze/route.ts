import { NextRequest, NextResponse } from "next/server"

// 内存存储竞品分析历史（应用重启后清空）
const analysisCache = new Map<string, any>()

// 竞品数据模板库
const COMPETITOR_TEMPLATES: Record<string, {
  themes: string[]
  keywords: string[]
  strategy: string
  weaknesses: string[]
}> = {
  default: {
    themes: ["产品功能评测", "使用体验分享", "行业趋势分析", "解决方案对比"],
    keywords: ["评测", "测评", "对比", "怎么选", "避坑", "推荐", "真实体验", "值得买吗"],
    strategy: "内容营销为主，通过测评和对比建立专业形象，利用用户UGC内容进行口碑传播",
    weaknesses: [
      "内容深度不足，缺少系统性教程",
      "缺乏真实用户案例和数据支撑",
      "互动性较弱，未形成社区氛围",
      "SEO布局不完善，长尾词覆盖少"
    ]
  },
  pet: {
    themes: ["宠物用品测评", "养宠经验分享", "宠物健康科普", "智能宠物设备"],
    keywords: ["宠物智能喂食器", "自动猫砂盆", "宠物饮水机", "猫粮推荐", "狗粮测评"],
    strategy: "围绕宠物智能化产品做深度内容，结合养宠痛点场景化营销",
    weaknesses: [
      "内容更新频率不稳定",
      "缺少短视频内容形式",
      "未建立用户社群运营",
      "跨界合作较少"
    ]
  },
  tech: {
    themes: ["科技产品评测", "AI工具教程", "效率提升方法", "技术趋势解读"],
    keywords: ["AI工具", "效率工具", " productivity", "自动化", "SaaS", "智能写作"],
    strategy: "以技术深度内容建立专业权威，通过免费工具+付费服务的双轮驱动模式",
    weaknesses: [
      "新手入门门槛较高",
      "中文内容偏少",
      "缺少实战案例展示",
      "客户成功故事不足"
    ]
  },
  fashion: {
    themes: ["穿搭技巧分享", "单品推荐", "品牌故事", "购物攻略"],
    keywords: ["穿搭", "OOTD", "平价好物", "避雷", "测评", "种草"],
    strategy: "视觉导向的内容策略，结合KOL/KOC进行矩阵式传播",
    weaknesses: [
      "内容同质化严重",
      "缺乏原创设计理念传达",
      "价格优势不明显",
      "售后服务口碑待提升"
    ]
  },
  health: {
    themes: ["健康知识科普", "产品成分解析", "使用前后对比", "专家观点"],
    keywords: ["保健品", "美白", "减肥", "护肤", "健康食品", "天然成分"],
    strategy: "权威背书+效果见证的内容策略，强调科学依据和用户真实反馈",
    weaknesses: [
      "专业资质展示不足",
      "缺少临床数据支持",
      "内容合规风险较高",
      "信任状构建不够系统"
    ]
  }
}

function getCompetitorTemplate(competitor: string) {
  const lower = competitor.toLowerCase()
  
  if (lower.includes("pet") || lower.includes("宠物") || lower.includes("猫") || lower.includes("狗")) {
    return COMPETITOR_TEMPLATES.pet
  }
  if (lower.includes("tech") || lower.includes("ai") || lower.includes("软件") || lower.includes("saas")) {
    return COMPETITOR_TEMPLATES.tech
  }
  if (lower.includes("fashion") || lower.includes("时尚") || lower.includes("穿搭") || lower.includes("衣服")) {
    return COMPETITOR_TEMPLATES.fashion
  }
  if (lower.includes("health") || lower.includes("健康") || lower.includes("保健") || lower.includes("护肤")) {
    return COMPETITOR_TEMPLATES.health
  }
  
  return COMPETITOR_TEMPLATES.default
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { competitor } = body as { competitor: string }

    if (!competitor) {
      return NextResponse.json({ error: "请提供竞品名称" }, { status: 400 })
    }

    // Check cache first
    if (analysisCache.has(competitor)) {
      return NextResponse.json({ 
        success: true,
        competitor,
        ...analysisCache.get(competitor),
        cached: true
      })
    }

    // Generate analysis using template
    const template = getCompetitorTemplate(competitor)
    
    const analysis = {
      competitor,
      contentThemes: template.themes,
      highFrequencyKeywords: template.keywords,
      estimatedStrategy: template.strategy,
      weaknesses: template.weaknesses
    }

    // Cache the result
    analysisCache.set(competitor, analysis)

    return NextResponse.json({ 
      success: true,
      ...analysis,
      cached: false
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "分析失败" }, { status: 500 })
  }
}

export async function GET() {
  const cacheKeys = Array.from(analysisCache.keys())
  return NextResponse.json({ 
    success: true,
    cachedAnalyses: cacheKeys.length,
    keys: cacheKeys
  })
}
