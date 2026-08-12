import { NextRequest, NextResponse } from "next/server"

// Persona configurations for content variation
const PERSONAS = [
  { name: "宝妈", age: 30, style: "亲切温暖", traits: ["关注性价比", "看重安全性", "分享经验"] },
  { name: "学生党", age: 22, style: "活泼直接", traits: ["追求潮流", "预算有限", "喜欢测评"] },
  { name: "专业人士", age: 35, style: "理性专业", traits: ["注重数据", "强调逻辑", "引用来源"] },
  { name: "发烧友", age: 28, style: "狂热深入", traits: ["深挖细节", "对比参数", "技术控"] },
  { name: "路人", age: 25, style: "真实随性", traits: ["偶尔提及", "真实感受", "不夸张"] }
]

// Content angles
const ANGLES = ["deep_review", "warning", "guide", "comparison", "tips"]

// Platform formats
const PLATFORMS = ["xiaohongshu", "zhihu", "weibo", "douyin", "wechat"]

// Mock long-tail keyword generator (in production, would use AI or keyword research tools)
function generateLongTailKeywords(baseKeyword: string): string[] {
  const templates = [
    `${baseKeyword}哪个好`,
    `${baseKeyword}推荐`,
    `${baseKeyword}避坑`,
    `${baseKeyword}测评`,
    `${baseKeyword}选购指南`,
    `${baseKeyword}真实体验`,
    `${baseKeyword}值不值得买`,
    `${baseKeyword}对比`,
    `${baseKeyword}最新款`,
    `${baseKeyword}平价替代`,
  ]
  return templates
}

// Generate content variations based on persona and platform
function generateContentVariation(keyword: string, angle: string, platform: string, persona: any): string {
  const templates: Record<string, Record<string, (kw: string) => string>> = {
    xiaohongshu: {
      deep_review: (kw) => `姐妹们！${kw}的深度测评来了！🔍\n\n作为${persona.name}，我用了两周时间...`,
      warning: (kw) => `⚠️ ${kw}避坑指南！别踩这些雷💣\n\n作为${persona.name}，我真的踩了不少坑...`,
      guide: (kw) => `保姆级${kw}选购攻略📚\n\n${persona.name}手把手教你选...`,
      comparison: (kw) => `${kw}横评：A/B/C三款对比🆚\n\n${persona.name}实测结果...`,
      tips: (kw) => `${kw}隐藏技巧大公开🤫\n\n${persona.name}才知道的5个方法...`,
    },
    zhihu: {
      deep_review: (kw) => `如何评价${kw}？\n\n谢邀。作为一个${persona.name}，我来客观分析一下...`,
      warning: (kw) => `哪些${kw}坑必须避开？\n\n基于${persona.name}的真实经历...`,
      guide: (kw) => `${kw}选购完全指南（${persona.name}版）\n\n从需求分析到最终选择...`,
      comparison: (kw) => `${kw}横向评测报告\n\n${persona.name}的多维度对比分析...`,
      tips: (kw) => `${kw}的高级用法：${persona.name}的独家技巧\n\n99%的人不知道的...`,
    },
    weibo: {
      deep_review: (kw) => `#${kw}# 深度测评来了！作为${persona.name}...`,
      warning: (kw) => `#${kw}# 避坑提醒！${persona.name}的血泪教训...`,
      guide: (kw) => `#${kw}# 选购攻略，${persona.name}亲测有效...`,
      comparison: (kw) => `#${kw}# 三款对比，${persona.name}说...`,
      tips: (kw) => `#${kw}# 这些小技巧，${persona.name}今天告诉你...`,
    },
    douyin: {
      deep_review: (kw) => `[口播脚本]\n${persona.name}来测评${kw}了！...`,
      warning: (kw) => `[口播脚本]\n${kw}千万别乱买！${persona.name}告诉你为什么...`,
      guide: (kw) => `[口播脚本]\n${kw}怎么买？${persona.name}手把手教你...`,
      comparison: (kw) => `[口播脚本]\n${kw}买哪款？${persona.name}实测给你看...`,
      tips: (kw) => `[口播脚本]\n${kw}隐藏功能曝光！${persona.name}独门秘籍...`,
    },
    wechat: {
      deep_review: (kw) => `深度 | ${kw}全面测评：${persona.name}的真实体验\n\n...\n`,
      warning: (kw) => `警惕！${kw}的这些坑，${persona.name}全踩过了\n\n...\n`,
      guide: (kw) => `干货 | ${kw}选购指南，${persona.name}总结了这些经验\n\n...\n`,
      comparison: (kw) => `实测 | ${kw}三款对比，${persona.name}告诉你怎么选\n\n...\n`,
      tips: (kw) => `揭秘 | ${kw}的隐藏技巧，${persona.name}独享的秘籍\n\n...\n`,
    },
  }
  
  const platformTemplates = templates[platform] || templates.xiaohongshu
  const angleTemplate = platformTemplates[angle] || platformTemplates.deep_review
  
  return angleTemplate(keyword)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { competitor, platforms = PLATFORMS, personas = PERSONAS } = body as {
      competitor: string
      platforms?: string[]
      personas?: any[]
    }

    if (!competitor) {
      return NextResponse.json({ error: "请提供竞品名称" }, { status: 400 })
    }

    // Generate long-tail keywords
    const longTails = generateLongTailKeywords(competitor)
    
    // Generate all content matrix
    const allContents = []
    
    for (const keyword of longTails) {
      for (const angle of ANGLES) {
        for (const platform of platforms) {
          for (const persona of personas) {
            const content = generateContentVariation(keyword, angle, platform, persona)
            
            allContents.push({
              id: `${keyword}-${angle}-${platform}-${persona.name}`,
              keyword,
              angle,
              platform,
              persona,
              title: `${competitor} ${angle} - ${persona.name}`,
              body: content,
              format: getFormatType(platform),
            })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      competitor,
      totalGenerated: allContents.length,
      contents: allContents,
      breakdown: {
        keywords: longTails.length,
        angles: ANGLES.length,
        platforms: platforms.length,
        personas: personas.length,
        total: longTails.length * ANGLES.length * platforms.length * personas.length,
      }
    })
  } catch (error) {
    console.error("Surround error:", error)
    return NextResponse.json({ error: "生成失败" }, { status: 500 })
  }
}

function getFormatType(platform: string): string {
  const types: Record<string, string> = {
    xiaohongshu: "图文",
    zhihu: "长文",
    weibo: "短帖",
    douyin: "视频脚本",
    wechat: "公众号文章",
  }
  return types[platform] || "未知"
}
