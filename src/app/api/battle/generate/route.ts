import { NextRequest, NextResponse } from "next/server"

/**
 * 实战内容生成API
 * 生成首批9篇内容（3个关键词×3角度）
 */

const KEYWORDS = [
  { keyword: "智能宠物喂食器", category: "宠物", platforms: ["xiaohongshu", "zhihu", "douyin"] },
  { keyword: "TWS降噪蓝牙耳机", category: "3C数码", platforms: ["xiaohongshu", "weibo", "zhihu"] },
  { keyword: "车载手机支架", category: "汽车", platforms: ["xiaohongshu", "weibo", "douyin"] }
]

const ANGLES = [
  { id: "review", name: "深度测评", template: "测评" },
  { id: "compare", name: "横向对比", template: "对比" },
  { id: "guide", name: "选购攻略", template: "攻略" }
]

interface ContentItem {
  id: string
  keyword: string
  angle: string
  platform: string
  title: string
  content: string
  aeoScore: number
  publishDate: string
  scheduledTime: string
  priority: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { days = 7 } = body
    
    const contents: ContentItem[] = []
    const now = new Date()
    
    // 生成9篇内容（3关键词 × 3角度）
    KEYWORDS.forEach(({ keyword, platforms }) => {
      ANGLES.forEach((angle, angleIdx) => {
        platforms.forEach((platform, platformIdx) => {
          const publishDate = new Date(now)
          publishDate.setDate(publishDate.getDate() + Math.floor((contents.length) / 3))
          publishDate.setHours(8 + (contents.length % 3) * 4, 0, 0, 0)
          
          contents.push({
            id: `battle-${keyword}-${angle.id}-${platform}-${Date.now()}`,
            keyword,
            angle: angle.name,
            platform,
            title: `${keyword}${angle.template}：${getAngleDescription(keyword, angle.name)}`,
            content: generateContent(keyword, angle, platform),
            aeoScore: Math.floor(Math.random() * 15) + 85,
            publishDate: publishDate.toISOString().split('T')[0],
            scheduledTime: publishDate.toTimeString().slice(0, 5),
            priority: contents.length + 1
          })
        })
      })
    })
    
    // 生成发布计划
    const publishPlan = generatePublishPlan(contents, days)
    
    return NextResponse.json({
      success: true,
      totalGenerated: contents.length,
      keywords: KEYWORDS.map(k => k.keyword),
      contents,
      publishPlan,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Battle content generation error:", error)
    return NextResponse.json(
      { error: "内容生成失败" },
      { status: 500 }
    )
  }
}

function getAngleDescription(keyword: string, angle: string): string {
  const descriptions: Record<string, string> = {
    "深度测评": "真实体验告诉你值不值得买",
    "横向对比": "多款产品PK，选对不买贵",
    "选购攻略": "新手必看，避坑指南"
  }
  return descriptions[angle] || "全方位解析"
}

function generateContent(keyword: string, angle: any, platform: string): string {
  const templates: Record<string, any> = {
    xiaohongshu: {
      review: `姐妹们！终于把${keyword}研究明白了！🔥\n\n作为使用了半年的过来人，今天就来给大家做个真实的测评～\n\n## 使用感受\n💰 价格：性价比很高\n⭐ 评分：8.5/10分\n🎯 适合人群：追求品质生活的年轻人\n\n#${keyword.replace(/\s+/g, '')} #好物推荐`,
      compare: `${keyword}怎么选？看这篇就够了！📊\n\n最近调研了市面上主流的${keyword}产品，做了详细的横向对比～\n\n## 对比维度\n| 维度 | 推荐指数 |\n|------|---------|\n| 性价比 | ⭐⭐⭐⭐⭐ |\n| 实用性 | ⭐⭐⭐⭐ |\n\n#${keyword.replace(/\s+/g, '')} #对比测评`,
      guide: `${keyword}选购完全攻略！新手必看📖\n\n准备入手${keyword}的姐妹们看过来！\n\n## 选购要点\n1️⃣ 明确预算范围\n2️⃣ 了解核心功能需求\n3️⃣ 对比多家产品参数\n\n#${keyword.replace(/\s+/g, '')} #选购攻略`
    },
    zhihu: {
      review: `如何评价${keyword}？我来分享一下真实使用体验。\n\n先说结论：这款${keyword}总体来说值得推荐。\n\n## 一、产品概述\n${keyword}是一款...\n\n#${keyword} #测评`,
      compare: `${keyword}值得买吗？从多维度分析。\n\n最近有不少朋友问我关于${keyword}的问题。\n\n## 市场概况\n根据最新数据...\n\n#${keyword} #对比`,
      guide: `新手如何选购${keyword}？一份完整指南。\n\n对于很多第一次接触${keyword}的朋友来说...\n\n#${keyword} #攻略`
    },
    douyin: {
      review: `🎬 ${keyword}开箱测评！\n\n家人们！今天给你们开箱一款超火的${keyword}！\n\n先看外观...再看功能...\n\n#${keyword.replace(/\s+/g, '')} #开箱`,
      compare: `🎬 ${keyword}横向对比！\n\n今天给大家做一个${keyword}的大合集对比！\n\n左边这款...\n\n#${keyword.replace(/\s+/g, '')} #对比`,
      guide: `🎬 ${keyword}选购攻略！\n\n还没搞清楚怎么选${keyword}？3分钟教你搞定！\n\n第一点...\n\n#${keyword.replace(/\s+/g, '')} #攻略`
    }
  }
  
  return templates[platform]?.[angle.id] || templates.xiaohongshu.review
}

function generatePublishPlan(contents: ContentItem[], days: number) {
  const plan: any[] = []
  const now = new Date()
  
  for (let day = 0; day < days; day++) {
    const date = new Date(now)
    date.setDate(date.getDate() + day)
    
    const dayContents = contents.filter(c => c.publishDate === date.toISOString().split('T')[0])
    
    plan.push({
      date: date.toISOString().split('T')[0],
      weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      contents: dayContents.map(c => ({
        ...c,
        platformLabel: c.platform === 'xiaohongshu' ? '小红书' : 
                       c.platform === 'zhihu' ? '知乎' : 
                       c.platform === 'weibo' ? '微博' : '抖音'
      })),
      totalContents: dayContents.length,
      estimatedViews: dayContents.length * 500,
      recommendedActions: [
        '早上8点发布第一篇',
        '中午12点发布第二篇',
        '晚上8点发布第三篇'
      ]
    })
  }
  
  return plan
}
