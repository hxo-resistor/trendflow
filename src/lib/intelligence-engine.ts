/**
 * TrendFlow Intelligence Engine
 * Multi-source AI content generation with fallback chain
 */

export interface GenerateOptions {
  trendTitle: string
  opportunity: string
  platform: string
  keyword?: string
}

export interface GenerateResult {
  content: string
  source: 'openai' | 'local'
  quality: 'high' | 'template'
  latency?: number  // 生成耗时（毫秒）
}

type PlatformKey = 'xiaohongshu' | 'zhihu' | 'wechat' | 'weibo'

// 可用的代理地址列表（按优先级排序）
const PROXY_CHAIN = [
  'https://openai.api2d.net/v1',          // ✅ TESTED WORKING
  'https://api.openai-proxy.com/v1',
  'https://api.v5.lc/openai/v1',
  'https://api.chatanywhere.tech/v1',
]

// Content template library
const CONTENT_TEMPLATES: Record<PlatformKey, ((title: string, opp: string) => string)[]> = {
  xiaohongshu: [
    (title: string, opp: string) => `姐妹们！终于发现了一个超宝藏的海外趋势！🔥

最近刷到一个超火的${title}，在TikTok和Instagram上已经爆火很久了！

🤔为什么这么火？
${opp}

💡我对比了国内外几个品牌，发现这个趋势其实特别适合咱们国内市场：
1️⃣ 中国人越来越注重品质生活
2️⃣ 年轻消费者愿意为创新买单
3️⃣ 国内供应链完全能跟上

📌选购建议：
不要盲目跟风！先明确自己的需求，多做功课再看评价。我建议大家：
• 先看真实用户测评
• 注意对比参数细节
• 关注售后服务质量

总之，选对适合自己的才是最重要的！你们觉得呢？评论区聊聊～

#${title.replace(/\s+/g, '')} #海外潮流 #趋势发现 #消费指南`,

    (title: string, opp: string) => `被问爆了！终于把${title}搞明白了 😭

说实话，之前对这个完全不感兴趣，直到看到它在国外火了...

📊 数据说话：
${opp}

✨ 我的使用感受：
确实有一些很打动人的地方，但也有需要避坑的点。今天就来客观分享一下～

✅ 值得入手的地方：
• 设计新颖，解决了传统产品的痛点
• 性价比不错，比同类产品便宜
• 容易上手，学习成本低

⚠️ 需要注意的地方：
• 售后服务参差不齐
• 部分功能可能需要额外付费
• 建议选择官方渠道购买

🎯 总结：适合追求新鲜感、有一定预算的用户。如果你是重度使用者，建议再等等看国内有没有更好的替代品。

你们用过类似的产品吗？感觉如何？

#${title.replace(/\s+/g, '')} #消费心得 #真实测评`,
  ],

  zhihu: [
    (title: string, opp: string) => `如何评价${title}在中国的可行性？

谢邀。

先从数据来源说起。最近在研究海外市场时注意到${title}在欧美的兴起，背后反映的是一些有趣的市场规律。

## 一、现象观察

${opp}

这个趋势有几个关键特征值得注意：
1. **需求前置**：不是创造了需求，而是放大了已有需求
2. **场景细分**：针对不同人群有差异化的解决方案
3. **复购率高**：一旦形成使用习惯，用户粘性很强

## 二、市场机会分析

从国内来看，有几个有利条件：

**优势：**
- 供应链成熟，成本可控
- 消费市场庞大，容错空间大
- 数字基础设施完善

**挑战：**
- 用户教育需要时间
- 竞品涌入速度快
- 合规风险需要警惕

## 三、建议与展望

以上是我的个人观点，欢迎交流讨论。`,
  ],

  wechat: [
    (title: string, opp: string) => `${title}——一个让我重新思考消费的文章

文/趋势洞察

最近，${title}这个话题在我的朋友圈里悄悄火起来了。

一开始我也没在意，觉得不就是个普通的趋势吗？但当我深入了解后，发现这件事远比想象中更有意思。

---

## 背后的逻辑

${opp}

这让我想起一句话："最好的商业模式，是解决一个真实存在的问题。"

---

## 给我们的启示

看完这篇文章，我想分享三个思考：

**第一，趋势不等于风口。**
很多所谓的"风口"只是营销话术，真正有价值的趋势是那些能解决实际问题的创新。

**第二，本土化是关键。**
国外成功的经验可以借鉴，但不能照搬。每个市场都有自己独特的用户习惯和文化背景。

**第三，选择比努力更重要。**
在面对众多机会时，选择一个真正有价值的赛道，比盲目追逐热门更重要。

---

*本文仅代表个人观点，不构成投资建议。*

---
喜欢这篇文章吗？欢迎点赞、在看、转发~`,
  ],

  weibo: [
    (title: string, opp: string) => `#${title.replace(/\s+/g, '')}# 最近刷到这个趋势，有点意思 🤔

${opp}

关键是：中国市场的供应链完全跟得上，差距正在缩小。

你怎么看？支持还是反对？评论区聊聊 👇

#${title.replace(/\s+/g, '')} #趋势观察`,
  ],
}

/**
 * Try OpenAI via proxy chain with automatic fallback
 * @returns GenerateResult if successful, null if all proxies failed
 */
export async function tryOpenAI(options: GenerateOptions): Promise<GenerateResult | null> {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey || apiKey === 'sk-placeholder-for-testing' || apiKey.startsWith('sk-placeholder')) {
    console.log('⚠️ OPENAI_API_KEY not configured')
    return null
  }

  const requestBody = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: '你是一位专业的内容创作者，擅长将海外热点本地化为适合中国平台的优质内容。要求：真实自然、客观中立、遵守广告法、价值导向。平台规范：小红书口语化加emoji、知乎结构化论述、公众号故事感、微博精炼话题词。输出纯文章内容，末尾添加合规声明。',
      },
      {
        role: 'user',
        content: `请为"${options.platform}"平台写一篇种草文章。\n\n趋势标题：${options.trendTitle}\n市场机会：${options.opportunity}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 800,
  }

  const startTime = Date.now()
  let lastError: string = ''

  // 尝试每个代理地址
  for (const baseURL of PROXY_CHAIN) {
    try {
      console.log(`🔄 尝试代理: ${baseURL}`)
      
      const response = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(30000),  // 每个代理最多等待30秒
      })

      if (response.ok) {
        const data = await response.json()
        const latency = Date.now() - startTime
        
        if (data.choices?.[0]?.message?.content) {
          console.log(`✅ OpenAI API 通过代理 ${baseURL} 成功，耗时 ${latency}ms`)
          return {
            content: data.choices[0].message.content,
            source: 'openai',
            quality: 'high',
            latency,
          }
        }
      } else {
        const errorText = await response.text().catch(() => '')
        console.warn(`⚠️ 代理 ${baseURL} 返回错误 ${response.status}: ${errorText.substring(0, 100)}`)
        lastError = `HTTP ${response.status}: ${errorText.substring(0, 50)}`
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.warn(`❌ 代理 ${baseURL} 连接失败: ${errorMsg}`)
      lastError = errorMsg
    }
  }

  console.error(`❌ 所有代理均失败，最后错误: ${lastError}`)
  return null
}

/**
 * Local intelligent template engine (guaranteed fallback)
 */
export function generateWithLocalEngine(options: GenerateOptions): GenerateResult {
  const platformKey = (options.platform as PlatformKey) || 'xiaohongshu'
  const templates = CONTENT_TEMPLATES[platformKey] || CONTENT_TEMPLATES.xiaohongshu
  
  const randomIndex = Math.floor(Math.random() * templates.length)
  const content = templates[randomIndex](options.trendTitle, options.opportunity)
  
  return { content, source: 'local', quality: 'template' }
}

/**
 * Main generation function - tries sources in priority order
 */
export async function generateContent(options: GenerateOptions): Promise<GenerateResult> {
  // Try OpenAI first (with proxy fallback)
  const openaiResult = await tryOpenAI(options)
  if (openaiResult) {
    console.log(`🎉 AI生成成功！耗时: ${openaiResult.latency}ms`)
    return openaiResult
  }
  
  // Fallback to local engine
  console.log('⚠️ OpenAI 不可用，回退到模板引擎')
  return generateWithLocalEngine(options)
}

/**
 * Analyze history and generate optimization suggestion
 */
export function analyzeHistory(history: any[]): string {
  if (!history || history.length === 0) return "暂无足够历史数据"
  
  const platformStats: Record<string, number> = {}
  const keywordStats: Record<string, number> = {}
  
  history.forEach((item: any) => {
    const platform = item.platform || "unknown"
    const keyword = item.keyword || item.trendTitle || "unknown"
    platformStats[platform] = (platformStats[platform] || 0) + 1
    keywordStats[keyword] = (keywordStats[keyword] || 0) + 1
  })
  
  const topKeyword = Object.entries(keywordStats)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
  
  return `热门话题：${topKeyword}`
}
