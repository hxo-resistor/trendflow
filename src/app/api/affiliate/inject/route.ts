import { NextRequest, NextResponse } from "next/server"
import { matchProducts, injectProducts } from "@/lib/affiliate-utils"
import { matchPDDProducts, injectPDDLinks } from "@/lib/pdd-affiliate"

/**
 * Affiliate Injection API - 支持京东+拼多多双平台
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, platform, keyword, enablePDD = true } = body as {
      content: string
      platform: string
      keyword?: string
      enablePDD?: boolean
    }

    if (!content || !platform) {
      return NextResponse.json(
        { error: "缺少必要参数: content, platform" },
        { status: 400 }
      )
    }

    // 1. 注入京东/淘宝链接（原有逻辑）
    const jdProducts = matchProducts(content, platform)
    const jdResult = injectProducts(content, jdProducts, platform)
    
    let finalContent = jdResult.monetizedContent
    const allInsertedProducts = [...jdResult.insertedProducts]
    
    // 2. 注入拼多多链接（新增）
    let pddProductCount = 0
    if (enablePDD) {
      const pddMatched = matchPDDProducts(finalContent)
      if (pddMatched.length > 0) {
        const pddTemplate = pddMatched[0]
        
        // 根据平台选择话术
        const platformTemplates: Record<string, string> = {
          xiaohongshu: `\n\n💰 **拼多多超值推荐：** ${pddTemplate.name}，百亿补贴超便宜！`,
          zhihu: `\n\n关于${keyword || '这款产品'}，拼多多上价格更优，建议对比后再入手。`,
          wechat: `\n\n📌 **拼多多同款：** ${pddTemplate.name}，搜索即可找到`,
          weibo: `\n\n#${keyword || pddTemplate.name}# 拼多多价格更香！`,
          douyin: `\n\n🎬 同款在这里：${pddTemplate.link}`
        }
        
        finalContent += platformTemplates[platform] || platformTemplates.xiaohongshu
        allInsertedProducts.push({
          name: pddTemplate.name,
          link: pddTemplate.link,
          position: 'outro' as const,
          insertionType: '拼多多推荐'
        })
        pddProductCount = 1
      }
    }

    return NextResponse.json({
      success: true,
      monetizedContent: finalContent,
      insertedProducts: allInsertedProducts,
      estimatedCommission: jdResult.estimatedCommission,
      pddEnabled: enablePDD,
      metadata: {
        jdProductCount: jdProducts.length,
        pddProductCount,
        generatedAt: new Date().toISOString(),
        source: "trendflow-affiliate-v2"
      }
    })
  } catch (error) {
    console.error("Affiliate injection error:", error)
    return NextResponse.json(
      { error: "变现注入失败" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "TrendFlow Affiliate Injection API v2",
    endpoint: "/api/affiliate/inject",
    features: [
      "京东/淘宝联盟支持",
      "拼多多多多进宝支持 ⭐",
      "多平台话术适配",
      "智能商品匹配"
    ],
    platforms: ["xiaohongshu", "zhihu", "wechat", "weibo", "douyin", "pinduoduo"],
    productCount: 24,  // 19个京东 + 5个拼多多
    pddProductCount: 5
  })
}
