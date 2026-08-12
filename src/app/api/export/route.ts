import { NextRequest, NextResponse } from "next/server"

/**
 * Export API - Batch content generation for external tools
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keyword, count = 10, angles = ["review", "warning", "guide", "comparison", "tips"], platforms = ["xiaohongshu", "zhihu", "weibo"] } = body as {
      keyword: string
      count?: number
      angles?: string[]
      platforms?: string[]
    }

    if (!keyword) {
      return NextResponse.json({ error: "请提供关键词" }, { status: 400 })
    }

    // Generate content matrix
    const contents = []
    
    for (let i = 0; i < Math.min(count, 50); i++) {
      const angle = angles[i % angles.length]
      const platform = platforms[i % platforms.length]
      
      contents.push({
        id: `${keyword}-${i}`,
        keyword,
        angle,
        platform,
        title: generateTitle(keyword, angle),
        body: generateBody(keyword, angle, platform),
        format: getFormatType(platform),
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      keyword,
      totalGenerated: contents.length,
      contents,
      metadata: {
        generatedAt: new Date().toISOString(),
        template: "standard",
        version: "1.0"
      }
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "导出失败" }, { status: 500 })
  }
}

function generateTitle(keyword: string, angle: string): string {
  const titles: Record<string, (kw: string) => string> = {
    review: (kw) => `深度测评：${kw}的全面分析`,
    warning: (kw) => `${kw}避坑指南：这些雷千万别踩`,
    guide: (kw) => `${kw}选购攻略：从入门到精通`,
    comparison: (kw) => `${kw}横评：三款热门产品对比`,
    tips: (kw) => `${kw}隐藏技巧：90%的人不知道`,
  }
  return (titles[angle] || titles.review)(keyword)
}

function generateBody(keyword: string, angle: string, platform: string): string {
  const bodies: Record<string, (kw: string, p: string) => string> = {
    review: (kw, p) => `关于${kw}的深度测评来了。我们从多个维度进行了详细分析...`,
    warning: (kw, p) => `${kw}的避坑指南，这些细节需要注意...`,
    guide: (kw, p) => `${kw}选购完全攻略，手把手教你选对产品...`,
    comparison: (kw, p) => `${kw}横向评测，三款产品真实对比...`,
    tips: (kw, p) => `${kw}的隐藏用法，这些技巧让你的使用体验翻倍...`,
  }
  return (bodies[angle] || bodies.review)(keyword, platform)
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
