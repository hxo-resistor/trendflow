/**
 * 去AI化处理器
 * 让内容更自然、更像真人写的
 */

export interface AntiAiOptions {
  enhanceHumanTouch: boolean  // 是否增强真人感
  platform: string            // 目标平台
  targetWordCount?: number    // 目标字数
}

// 各平台字数限制
const PLATFORM_WORD_LIMITS: Record<string, number> = {
  xiaohongshu: 1000,      // 小红书1000字以内
  zhihu: 5000,           // 知乎不限（建议5000以内）
  weibo: 140,            // 微博140字以内
  douyin: 800,           // 抖音脚本800字以内
  wechat: 3000           // 公众号不限
}

// 口语化表达库（随机插入）
const COLLOQUIAL_PHRASES = [
  '说实话',
  '个人感觉',
  '用了两周后才发现',
  '真心觉得',
  '不吹不黑',
  '亲测有效',
  '踩了好多坑才总结出来',
  '说真的',
  '我个人认为',
  '有一说一',
  '讲真',
  '实话实说',
  '实测下来',
  '用了一段时间',
  '实际体验'
]

// 不完美标点（模拟真人打字习惯）
const IMPERFECT_PUNCTUATION = [
  '...（省略号）',
  '~（波浪号）',
  '！！！（多个感叹号）',
  '？？？（多个问号）',
  '——（破折号）',
]

// 平台人设语气
interface PlatformPersona {
  greeting: string[]
  signature: string[]
  style: string
}

const PLATFORM_PERSONAS: Record<string, PlatformPersona> = {
  xiaohongshu: {
    greeting: ['姐妹们', '宝子们', '姐妹们！'],
    signature: ['下期见~', '爱你们哟💕', '求点赞收藏~', '关注我不迷路~'],
    style: '闺蜜聊天式，多用emoji，语气热情活泼'
  },
  zhihu: {
    greeting: ['谢邀', '先说结论', '从专业角度来分析'],
    signature: ['以上', '欢迎讨论', '有问必答'],
    style: '专家分享式，结构清晰，有理有据'
  },
  weibo: {
    greeting: ['#话题#'],
    signature: ['#转发评论抽红包#', '#转发本条抽奖#'],
    style: '精炼短文案，话题驱动'
  },
  douyin: {
    greeting: ['家人们', '兄弟们', '姐妹们'],
    signature: ['点赞关注不迷路', '下期更精彩'],
    style: '口语化强，节奏感快'
  },
  wechat: {
    greeting: ['大家好', '欢迎关注'],
    signature: ['如果觉得有用，请点赞+在看', '感谢您的阅读'],
    style: '故事感强，有温度'
  }
}

/**
 * 去AI化处理函数
 */
export function antiAiProcessing(content: string, options: AntiAiOptions): string {
  if (!options.enhanceHumanTouch) {
    return trimToLimit(content, options.platform, options.targetWordCount)
  }

  const persona = PLATFORM_PERSONAS[options.platform as keyof typeof PLATFORM_PERSONAS] || PLATFORM_PERSONAS.xiaohongshu
  let processed = content

  // 1. 随机插入口语化表达
  if (Math.random() > 0.5) {
    const phrase = COLLOQUIAL_PHRASES[Math.floor(Math.random() * COLLOQUIAL_PHRASES.length)]
    // 在开头或中间插入
    const insertPositions = [
      { pos: 0, before: true },
      { pos: Math.floor(processed.length * 0.3), before: false }
    ]
    const randomPos = insertPositions[Math.floor(Math.random() * insertPositions.length)]
    
    if (randomPos.before) {
      processed = `${phrase}，${processed}`
    } else {
      processed = processed.slice(0, randomPos.pos) + `\n\n${phrase}，` + processed.slice(randomPos.pos)
    }
  }

  // 2. 添加平台特色问候语
  if (Math.random() > 0.7) {
    const greeting = persona.greeting[Math.floor(Math.random() * persona.greeting.length)]
    if (!processed.startsWith(greeting)) {
      processed = `${greeting}！\n\n${processed}`
    }
  }

  // 3. 添加平台特色签名
  if (Math.random() > 0.6) {
    const signature = persona.signature[Math.floor(Math.random() * persona.signature.length)]
    if (!processed.includes(signature)) {
      processed = `${processed}\n\n${signature}`
    }
  }

  // 4. 随机添加不完美标点
  if (Math.random() > 0.7) {
    const punctuation = IMPERFECT_PUNCTUATION[Math.floor(Math.random() * IMPERFECT_PUNCTUATION.length)]
    // 替换部分句号为省略号等
    processed = processed.replace(/\。/g, (match, offset) => {
      // 只替换前2个句号
      return offset < processed.indexOf('。') + processed.slice(processed.indexOf('。')).indexOf('。') + 2 ? '...' : match
    })
  }

  // 5. 打乱部分完美结构（制造真实感）
  if (Math.random() > 0.8) {
    // 在某些位置添加换行，打破完美段落
    const lines = processed.split('\n')
    if (lines.length > 3) {
      const randomIndex = Math.floor(Math.random() * (lines.length - 1)) + 1
      lines.splice(randomIndex, 0, '')
      processed = lines.join('\n')
    }
  }

  // 6. 截断到字数限制
  processed = trimToLimit(processed, options.platform, options.targetWordCount)

  return processed
}

/**
 * 按平台字数限制截断
 */
function trimToLimit(content: string, platform: string, customLimit?: number): string {
  const limit = customLimit || PLATFORM_WORD_LIMITS[platform] || 1000
  
  if (content.length <= limit) {
    return content
  }
  
  // 智能截断：在句子边界处截断
  let truncated = content.slice(0, limit)
  
  // 找到最近的句子边界
  const lastPeriod = Math.max(
    truncated.lastIndexOf('。'),
    truncated.lastIndexOf('！'),
    truncated.lastIndexOf('？'),
    truncated.lastIndexOf('\n')
  )
  
  if (lastPeriod > limit * 0.8) {
    truncated = truncated.slice(0, lastPeriod + 1)
  } else {
    // 如果没有合适的边界，直接截断并加省略号
    truncated += '...'
  }
  
  return truncated
}

/**
 * 获取平台建议字数
 */
export function getPlatformWordLimit(platform: string): number {
  return PLATFORM_WORD_LIMITS[platform] || 1000
}

/**
 * 统计实际字数
 */
export function countWords(text: string): number {
  // 中文字符 + 英文单词
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
  return chineseChars + englishWords
}

/**
 * 检测是否疑似AI生成（简单启发式规则）
 */
export function detectAiLikelihood(content: string): {
  score: number  // 0-100，越高越像AI
  indicators: string[]
} {
  const indicators: string[] = []
  let score = 0

  // 检查指标
  if (content.includes('综上所述')) {
    indicators.push('使用"综上所述"等总结词')
    score += 15
  }
  
  if (content.includes('首先...其次...最后')) {
    indicators.push('使用过度结构化的连接词')
    score += 10
  }
  
  if (content.split('\n').filter(l => l.trim()).length > 10) {
    indicators.push('段落过于工整')
    score += 5
  }
  
  if (!content.includes('我') && !content.includes('个人')) {
    indicators.push('缺少个人观点表达')
    score += 10
  }
  
  const sequenceWords = ['首先', '其次', '再次', '最后']
  if (sequenceWords.every(w => content.includes(w))) {
    indicators.push('使用完整顺序词组')
    score += 15
  }

  // 满分100
  return {
    score: Math.min(100, score),
    indicators
  }
}
