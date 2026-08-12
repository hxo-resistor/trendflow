import { NextRequest, NextResponse } from "next/server"

/**
 * Webhook Content Factory API
 * External automation trigger for n8n/Make/Zapier
 */

interface WebhookContent {
  platform: string
  title: string
  body: string
  persona: string
  angle: string
  format: string
}

const ANGLES = ["review", "warning", "guide", "comparison", "tips"]
const PLATFORMS = ["xiaohongshu", "zhihu", "weibo", "douyin", "wechat"]
const PERSONAS = ["宝妈", "学生党", "专业人士", "发烧友", "路人"]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, count = 10, platforms = ["xiaohongshu"], angles = ANGLES } = body as {
      keyword: string
      count?: number
      platforms?: string[]
      angles?: string[]
    }

    if (!keyword) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required parameter: keyword" 
      }, { status: 400 })
    }

    // Check for large batch requests
    if (count > 20) {
      return NextResponse.json({
        success: true,
        message: "请求量过大，建议分批生成",
        suggestedBatches: Math.ceil(count / 20),
        maxRecommended: 20
      })
    }

    const contents: WebhookContent[] = []
    
    for (let i = 0; i < count; i++) {
      const platform = platforms[i % platforms.length]
      const angle = angles[i % angles.length]
      const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)]
      
      const content = generateContent(keyword, platform, angle, persona)
      contents.push({
        ...content,
        format: getFormatType(platform)
      })
    }

    return NextResponse.json({
      success: true,
      generated: contents.length,
      keyword,
      contents,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: "trendflow-webhook",
        version: "2.0"
      }
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Webhook processing failed",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "TrendFlow Webhook Content Factory API",
    endpoint: "/api/webhook/generate",
    methods: ["GET", "POST"],
    postParameters: {
      keyword: { type: "string", required: true, description: "主题关键词" },
      count: { type: "number", required: false, default: 10, max: 20, description: "生成数量" },
      platforms: { type: "array", required: false, default: ["xiaohongshu"], options: PLATFORMS, description: "目标平台" },
      angles: { type: "array", required: false, default: ANGLES, options: ANGLES, description: "内容角度" }
    },
    example: {
      keyword: "智能宠物喂食器",
      count: 5,
      platforms: ["xiaohongshu", "weibo"],
      response: "5篇不同平台的内容"
    }
  })
}

function generateContent(keyword: string, platform: string, angle: string, persona: string): WebhookContent {
  const templates: Record<string, Record<string, (kw: string, p: string) => WebhookContent>> = {
    xiaohongshu: {
      review: (kw, p) => ({
        platform,
        title: `${kw}深度测评｜${p}的真实体验`,
        body: `姐妹们！${kw}深度测评来了！🔥\n\n作为${p}，我用了两周时间...\n\n#好物推荐 #${kw}`,
        persona: p,
        angle,
        format: "图文"
      }),
      warning: (kw, p) => ({
        platform,
        title: `${kw}避坑指南｜${p}的血泪教训`,
        body: `⚠️ ${kw}避坑指南！${p}的血泪教训💣\n\n千万别踩这些雷...\n\n#避坑指南`,
        persona: p,
        angle,
        format: "图文"
      }),
      guide: (kw, p) => ({
        platform,
        title: `${kw}选购攻略｜${p}手把手教你`,
        body: `${kw}选购攻略📚\n\n${p}手把手教你选...\n\n#选购指南`,
        persona: p,
        angle,
        format: "图文"
      }),
      comparison: (kw, p) => ({
        platform,
        title: `${kw}横评｜${p}实测三款对比`,
        body: `${kw}横评：三款热门产品对比🆚\n\n${p}实测结果...\n\n#产品对比`,
        persona: p,
        angle,
        format: "图文"
      }),
      tips: (kw, p) => ({
        platform,
        title: `${kw}隐藏技巧｜${p}独享秘籍`,
        body: `${kw}隐藏技巧大公开🤫\n\n${p}才知道的5个方法...\n\n#实用技巧`,
        persona: p,
        angle,
        format: "图文"
      })
    },
    zhihu: {
      review: (kw, p) => ({
        platform,
        title: `如何评价${kw}？| ${p}视角`,
        body: `如何评价${kw}？\n\n谢邀。作为一个${p}，我来客观分析一下...\n\n## 分析\n从多个维度来看...`,
        persona: p,
        angle,
        format: "长文"
      }),
      warning: (kw, p) => ({
        platform,
        title: `${kw}有哪些坑？| ${p}经验分享`,
        body: `${kw}有哪些坑需要避免？\n\n基于${p}的真实经历...\n\n## 建议\n以下几点需要注意...`,
        persona: p,
        angle,
        format: "长文"
      }),
      guide: (kw, p) => ({
        platform,
        title: `${kw}选购完全指南 | ${p}版`,
        body: `${kw}选购完全指南\n\n${p}的经验总结...\n\n## 步骤\n第一步...第二步...`,
        persona: p,
        angle,
        format: "长文"
      }),
      comparison: (kw, p) => ({
        platform,
        title: `${kw}横向评测报告 | ${p}实测`,
        body: `${kw}横向评测报告\n\n${p}的多维度对比分析...\n\n## 结论\n综合来看...`,
        persona: p,
        angle,
        format: "长文"
      }),
      tips: (kw, p) => ({
        platform,
        title: `${kw}的高级用法 | ${p}独家技巧`,
        body: `${kw}的高级用法\n\n${p}的独家技巧分享...\n\n## 技巧\n1. ...\n2. ...`,
        persona: p,
        angle,
        format: "长文"
      })
    },
    weibo: {
      review: (kw, p) => ({
        platform,
        title: `#${kw}# 深度测评`,
        body: `#${kw}# 深度测评来了！作为${p}...\n\n#测评#${kw}`,
        persona: p,
        angle,
        format: "短帖"
      }),
      warning: (kw, p) => ({
        platform,
        title: `#${kw}# 避坑提醒`,
        body: `#${kw}# 避坑提醒！${p}的血泪教训...\n\n#避坑#${kw}`,
        persona: p,
        angle,
        format: "短帖"
      }),
      guide: (kw, p) => ({
        platform,
        title: `#${kw}# 选购攻略`,
        body: `#${kw}# 选购攻略，${p}亲测有效...\n\n#攻略#${kw}`,
        persona: p,
        angle,
        format: "短帖"
      }),
      comparison: (kw, p) => ({
        platform,
        title: `#${kw}# 三款对比`,
        body: `#${kw}# 三款对比，${p}说...\n\n#对比#${kw}`,
        persona: p,
        angle,
        format: "短帖"
      }),
      tips: (kw, p) => ({
        platform,
        title: `#${kw}# 隐藏技巧`,
        body: `#${kw}# 这些小技巧，${p}今天告诉你...\n\n#技巧#${kw}`,
        persona: p,
        angle,
        format: "短帖"
      })
    },
    douyin: {
      review: (kw, p) => ({
        platform,
        title: `[口播脚本] ${kw}测评`,
        body: `[口播脚本]\n${p}来测评${kw}了！\n...\n#测评#${kw}`,
        persona: p,
        angle,
        format: "视频脚本"
      }),
      warning: (kw, p) => ({
        platform,
        title: `[口播脚本] ${kw}避坑`,
        body: `[口播脚本]\n${kw}千万别乱买！${p}告诉你为什么...\n...\n#避坑#${kw}`,
        persona: p,
        angle,
        format: "视频脚本"
      }),
      guide: (kw, p) => ({
        platform,
        title: `[口播脚本] ${kw}攻略`,
        body: `[口播脚本]\n${kw}怎么买？${p}手把手教你...\n...\n#攻略#${kw}`,
        persona: p,
        angle,
        format: "视频脚本"
      }),
      comparison: (kw, p) => ({
        platform,
        title: `[口播脚本] ${kw}对比`,
        body: `[口播脚本]\n${kw}买哪款？${p}实测给你看...\n...\n#对比#${kw}`,
        persona: p,
        angle,
        format: "视频脚本"
      }),
      tips: (kw, p) => ({
        platform,
        title: `[口播脚本] ${kw}技巧`,
        body: `[口播脚本]\n${kw}隐藏功能曝光！${p}独门秘籍...\n...\n#技巧#${kw}`,
        persona: p,
        angle,
        format: "视频脚本"
      })
    },
    wechat: {
      review: (kw, p) => ({
        platform,
        title: `深度 | ${kw}全面测评：${p}真实体验`,
        body: `${kw}深度测评：${p}的真实体验\n\n...\n\n我是${p}，来说说我的感受...\n\n#深度测评`,
        persona: p,
        angle,
        format: "公众号文章"
      }),
      warning: (kw, p) => ({
        platform,
        title: `警惕！${kw}的这些坑，${p}全踩过了`,
        body: `警惕！${kw}的这些坑，${p}全踩过了\n\n...\n\n#避坑指南`,
        persona: p,
        angle,
        format: "公众号文章"
      }),
      guide: (kw, p) => ({
        platform,
        title: `干货 | ${kw}选购指南，${p}经验总结`,
        body: `干货 | ${kw}选购指南，${p}总结了这些经验\n\n...\n\n#选购攻略`,
        persona: p,
        angle,
        format: "公众号文章"
      }),
      comparison: (kw, p) => ({
        platform,
        title: `实测 | ${kw}三款对比，${p}告诉你怎么选`,
        body: `实测 | ${kw}三款对比，${p}告诉你怎么选\n\n...\n\n#产品对比`,
        persona: p,
        angle,
        format: "公众号文章"
      }),
      tips: (kw, p) => ({
        platform,
        title: `揭秘 | ${kw}隐藏技巧，${p}独享秘籍`,
        body: `揭秘 | ${kw}的隐藏技巧，${p}独享的秘籍\n\n...\n\n#实用技巧`,
        persona: p,
        angle,
        format: "公众号文章"
      })
    }
  }

  const platformTemplates = templates[platform] || templates.xiaohongshu
  const angleTemplate = platformTemplates[angle] || platformTemplates.review
  
  return angleTemplate(keyword, persona)
}

function getFormatType(platform: string): string {
  const types: Record<string, string> = {
    xiaohongshu: "图文",
    zhihu: "长文",
    weibo: "短帖",
    douyin: "视频脚本",
    wechat: "公众号文章"
  }
  return types[platform] || "未知"
}
