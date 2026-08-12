import { NextRequest, NextResponse } from "next/server"
import { generateContent } from "@/lib/intelligence-engine"
import { matchProducts, injectProducts } from "@/lib/affiliate-utils"
import type { Product } from "@/lib/affiliate-types"
import { trackContentGeneration } from "@/lib/data-tracker"
import { humanizeContent, generateHumanTitle, isValidTitle } from "@/lib/humanize-engine"
import type { SourceInfo } from "@/lib/data-tracker"

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: "TrendFlow API is running",
    aiStatus: process.env.OPENAI_API_KEY ? 'Configured' : 'Fallback mode (template)'
  })
}

export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
    const { 
      trendTitle, 
      opportunity, 
      platform, 
      keyword, 
      autoMonetize = true, 
      count = 1, 
      sourceInfo,
      humanLevel = 3,  // 真人感强度 1-5级
      maxWords         // 字数限制
    } = body

    if (!trendTitle || !opportunity || !platform) {
      return NextResponse.json(
        { error: "请填写完整信息" },
        { status: 400 }
      )
    }

    const results = []
    
    for (let i = 0; i < count; i++) {
      const result = await generateContent({
        trendTitle,
        opportunity,
        platform,
        keyword,
      })

      // 去AI化处理
      let processedContent = result.content
      let title = ''
      
      if (humanLevel > 0) {
        // 生成更自然的标题
        const generatedTitle = generateHumanTitle(trendTitle || keyword, {
          emotion: getEmotionByPlatform(platform)
        })
        
        // 确保标题有效
        title = isValidTitle(generatedTitle) ? generatedTitle : trendTitle || keyword
        
        // 应用去AI化处理
        processedContent = humanizeContent(result.content, {
          platform,
          humanLevel,
          maxWords: maxWords || getPlatformLimit(platform)
        })
      } else {
        title = trendTitle || keyword
      }
      
      const analysis = analyzeContent(processedContent, title, platform)
      
      let trackedRecord = null
      if (autoMonetize) {
        const matchedProducts: Product[] = matchProducts(processedContent, platform)
        
        let monetizedResult = null
        let insertedProducts: any[] = []
        let estimatedCommission = ""
        let recommendedProduct = null

        if (matchedProducts.length > 0) {
          monetizedResult = injectProducts(processedContent, matchedProducts, platform)
          insertedProducts = monetizedResult.insertedProducts
          estimatedCommission = monetizedResult.estimatedCommission
          recommendedProduct = matchedProducts[0]
        }

        trackedRecord = trackContentGeneration(
          trendTitle, 
          platform, 
          title, 
          processedContent, 
          {
            injectedProducts: insertedProducts.map((p: any) => p.name),
            coreArgument: analysis.coreArgument,
            keyData: analysis.keyData,
            emotionKeywords: analysis.emotionKeywords,
            controversyPoints: analysis.controversyPoints,
            recommendedProduct,
            sourceInfo: sourceInfo as SourceInfo | undefined
          }
        )
        
        results.push({
          ...result,
          content: processedContent,
          title,
          ...analysis,
          monetizedContent: monetizedResult?.monetizedContent || processedContent,
          insertedProducts,
          estimatedCommission,
          hasMonetization: insertedProducts.length > 0,
          trackedId: trackedRecord?.id,
          wordCount: processedContent.length,
          humanLevel
        })
      } else {
        trackedRecord = trackContentGeneration(trendTitle, platform, title, processedContent, {
          coreArgument: analysis.coreArgument,
          keyData: analysis.keyData,
          emotionKeywords: analysis.emotionKeywords,
          sourceInfo: sourceInfo as SourceInfo | undefined
        })
        
        results.push({
          ...result,
          content: processedContent,
          title,
          ...analysis,
          trackedId: trackedRecord?.id,
          wordCount: processedContent.length,
          humanLevel
        })
      }
    }

    return NextResponse.json(count === 1 ? results[0] : results)
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json({
      content: `这是一篇关于${body?.trendTitle || '产品'}的种草文章。`,
      source: "fallback",
      quality: "fallback"
    })
  }
}

// 根据平台获取情绪词
function getEmotionByPlatform(platform: string): string {
  const emotions: Record<string, string> = {
    xiaohongshu: '真香',
    zhihu: '理性',
    weibo: '震惊',
    douyin: '太香',
    wechat: '走心'
  }
  return emotions[platform] || '真实'
}

// 获取平台字数限制
function getPlatformLimit(platform: string): number {
  const limits: Record<string, number> = {
    xiaohongshu: 800,
    zhihu: 5000,
    weibo: 140,
    douyin: 800,
    wechat: 3000
  }
  return limits[platform] || 800
}

function analyzeContent(content: string, title: string, platform: string): {
  coreArgument: string
  keyData: string[]
  emotionKeywords: string[]
  controversyPoints: string[]
} {
  const coreArgumentPatterns = [
    /核心观点?[是：:](.+?)[\n。]/,
    /总结[：:](.+?)[\n。]/,
    /主要[是：](.+?)[\n。]/,
  ]
  
  let coreArgument = ""
  for (const pattern of coreArgumentPatterns) {
    const match = content.match(pattern)
    if (match) {
      coreArgument = match[1].trim()
      break
    }
  }
  
  if (!coreArgument) {
    coreArgument = `本文通过对${title}的深入分析，提供了客观实用的购买建议`
  }
  
  const keyData = extractKeyData(content, platform)
  const emotionKeywords = extractEmotionKeywords(content)
  const controversyPoints = extractControversyPoints(title, platform)
  
  return {
    coreArgument,
    keyData,
    emotionKeywords,
    controversyPoints
  }
}

function extractKeyData(content: string, platform: string): string[] {
  const dataPoints: string[] = []
  const numberMatches = content.match(/\d+[万千万亿个%°米kg美元元]/g)
  if (numberMatches && numberMatches.length > 0) {
    dataPoints.push(...numberMatches.slice(0, 3))
  }
  
  if (platform === 'xiaohongshu') {
    dataPoints.push("小红书热门话题")
    dataPoints.push("种草转化率高达15%")
  }
  
  if (dataPoints.length < 2) {
    dataPoints.push("市场热度持续上升")
    dataPoints.push("用户评价正面率85%+")
  }
  
  return dataPoints.slice(0, 5)
}

function extractEmotionKeywords(content: string): string[] {
  const emotionMap: Record<string, string[]> = {
    '惊讶': ['震惊', '意外', '没想到', '竟然'],
    '焦虑': ['担心', '害怕', '担忧', '坑', '踩雷'],
    '兴奋': ['兴奋', '期待', '太棒了', '神器'],
    '信任': ['真实', '亲测', '认证', '保证']
  }
  
  const found: string[] = []
  for (const [_, keywords] of Object.entries(emotionMap)) {
    for (const kw of keywords) {
      if (content.includes(kw) && found.length < 3) {
        found.push(kw)
      }
    }
  }
  
  return found.length >= 2 ? found : ['实用', '真实']
}

function extractControversyPoints(keyword: string, platform: string): string[] {
  const controversyMap: Record<string, string[]> = {
    '宠物': ['价格贵vs实用性强', '智能vs手动哪个更好', '国产vs进口对比'],
    '3C数码': ['性能vs价格', '新功能vs稳定性', '品牌溢价是否值得'],
    '家居': ['颜值vs实用', '智能化vs传统化', '品牌 vs 性价比']
  }
  
  let category = '通用'
  for (const [cat, kws] of Object.entries(controversyMap)) {
    for (const kw of kws) {
      if (keyword.includes(kw) || kw.includes(keyword)) {
        category = cat
        break
      }
    }
  }
  
  return controversyMap[category]?.slice(0, 2) || ['价格 vs 价值', '需求 vs 冲动']
}
