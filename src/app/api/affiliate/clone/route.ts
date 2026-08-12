import { NextRequest, NextResponse } from "next/server"
import { cloneProduct, generatePlatformContents, replaceAffiliatePID } from "@/lib/product-clone"
import type { ProductInfo, PlatformContent } from "@/lib/product-clone"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productUrl, pid, platforms = ['xiaohongshu', 'zhihu', 'weibo'] } = body

    if (!productUrl) {
      return NextResponse.json(
        { error: "请提供商品链接" },
        { status: 400 }
      )
    }

    // 1. 抓取商品信息
    const product: ProductInfo = await cloneProduct(productUrl)

    // 2. 生成各平台内容
    const allContents = generatePlatformContents(product, productUrl, pid || '')

    // 3. 过滤指定平台
    const filteredContents: PlatformContent[] = []
    for (const platform of platforms) {
      if (allContents[platform]) {
        filteredContents.push(allContents[platform])
      }
    }

    // 4. 替换推广链接PID
    const pidToUse = pid || process.env.JD_UNION_ID || 'default_pid'
    filteredContents.forEach(content => {
      content.affiliateLink = replaceAffiliatePID(content.affiliateLink, pidToUse)
    })

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        link: productUrl,
        pid: pidToUse
      },
      contents: filteredContents,
      stats: {
        totalPlatforms: filteredContents.length,
        avgWordCount: Math.round(filteredContents.reduce((a, b) => a + b.wordCount, 0) / filteredContents.length),
        images: product.images.length
      }
    })
  } catch (error) {
    console.error("Clone error:", error)
    return NextResponse.json(
      { error: "生成失败，请检查商品链接是否正确" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "联盟商品搬运器 API",
    supportedPlatforms: ["xiaohongshu", "zhihu", "weibo", "douyin", "wechat"],
    supportedStores: ["jd.com", "taobao.com", "tmall.com", "pinduoduo.com", "amazon.com"],
    features: [
      "自动抓取商品信息",
      "多平台文案适配",
      "推广链接自动替换PID",
      "图片资源保留"
    ]
  })
}
