/**
 * 真人感增强引擎
 * 让AI生成的内容更像真人写的
 */

export interface HumanizeOptions {
  platform: string
  humanLevel: number  // 1-5级，默认3级
  maxWords?: number   // 字数上限
}

// 口语化表达库（按平台分类）
const COLLOQUIAL_PHRASES: Record<string, string[]> = {
  xiaohongshu: [
    '说真的',
    '姐妹们',
    '踩坑了',
    '亲测有效',
    '真的绝了',
    '无语子',
    '绝绝子',
    '救命',
    '谁懂啊',
    '我真的会谢',
    '栓Q',
    '笑死',
    '蚌埠住了',
    '泰裤辣',
    'YYDS',
    '种草',
    '拔草',
    '智商税'
  ],
  zhihu: [
    '说句实话',
    '个人经验',
    '供参考',
    '不吹不黑',
    '客观来说',
    '说实话',
    '有一说一',
    '理性看待',
    '个人观点'
  ],
  weibo: [
    '啊啊啊',
    '绝了',
    '太香了',
    '冲!',
    '爱了爱了',
    '哭死',
    '笑死',
    '救命',
    '真的假的'
  ],
  douyin: [
    '家人们',
    '兄弟们',
    '姐妹们',
    '真的绝',
    '太香了',
    '冲就完了',
    '闭眼入',
    '按头安利'
  ],
  wechat: [
    '大家好',
    '我来说两句',
    '真心觉得',
    '实不相瞒',
    '掏心窝子说'
  ]
}

// 不完美细节（模拟真人习惯）
const IMPERFECT_DETAILS = [
  '拍照技术太烂了凑合看',
  '懒得修图了',
  '随手拍的',
  '原相机直出',
  '没打光',
  '随便拍拍',
  '手机拍的',
  '将就着看',
  '画质渣勿喷',
  '设备有限'
]

// 常见错别字/口语化用词
const TYPICAL_MISTAKES = {
  '这个': ['介个', '这该', '这嘎'],
  '真的': ['真滴', '珍的', '真个'],
  '特别': ['特变', '提别', '忒别'],
  '非常': ['灰常', '肥常', '非偿'],
  '但是': ['但系', '但西', '担是'],
  '什么': ['神马', '嘛什', '撒'],
  '不是': ['部是', '不事', '不私'],
  '现在': ['线在', '现咱', '现拽']
}

// 禁止的AI开头
const FORBIDDEN_OPENINGS = [
  '随着', '在当今', '近年来', '众所周知', '总的来说',
  '首先', '其次', '最后', '综上所述', '总而言之'
]

// 禁止的标题词汇
const FORBIDDEN_TITLE_WORDS = [
  '深度测评', '全面分析', '推荐', '指南', '攻略',
  '详解', '评测', '报告', '总结', '汇总'
]

/**
 * 生成真人感内容
 */
export function humanizeContent(content: string, options: HumanizeOptions): string {
  let processed = content
  const platformPhrases = COLLOQUIAL_PHRASES[options.platform] || COLLOQUIAL_PHRASES.xiaohongshu
  
  // 1. 替换AI式开头
  processed = replaceAiOpenings(processed)
  
  // 2. 根据humanLevel插入口语化表达
  const insertCount = Math.ceil(options.humanLevel / 2)
  for (let i = 0; i < insertCount; i++) {
    const phrase = platformPhrases[Math.floor(Math.random() * platformPhrases.length)]
    processed = insertPhraseRandomly(processed, phrase)
  }
  
  // 3. 插入不完美细节（概率30%）
  if (Math.random() < 0.3) {
    const detail = IMPERFECT_DETAILS[Math.floor(Math.random() * IMPERFECT_DETAILS.length)]
    processed = insertDetail(processed, detail)
  }
  
  // 4. 插入错别字（概率20%）
  if (Math.random() < 0.2 && options.humanLevel >= 4) {
    processed = insertTypo(processed, TYPICAL_MISTAKES)
  }
  
  // 5. 截断到字数限制
  if (options.maxWords) {
    processed = truncateToWordCount(processed, options.maxWords)
  }
  
  return processed
}

/**
 * 替换AI式开头
 */
function replaceAiOpenings(content: string): string {
  const lines = content.split('\n')
  if (lines.length === 0) return content
  
  const firstLine = lines[0]
  
  // 检查是否包含禁止的开头词
  const hasForbiddenOpening = FORBIDDEN_OPENINGS.some(word => firstLine.includes(word))
  
  if (hasForbiddenOpening) {
    // 替换为更自然的开头
    const naturalOpenings = [
      '说实话',
      '用了30天',
      '踩过坑',
      '亲测',
      '姐妹们',
      '家人们',
      '今天',
      '最近'
    ]
    const randomOpening = naturalOpenings[Math.floor(Math.random() * naturalOpenings.length)]
    lines[0] = `${randomOpening}，${firstLine.replace(new RegExp(`^${FORBIDDEN_OPENINGS.find(w => firstLine.includes(w))}|^[^\s]+`), '')}`
  }
  
  return lines.join('\n')
}

/**
 * 随机插入口语化表达
 */
function insertPhraseRandomly(content: string, phrase: string): string {
  const sentences = content.split(/[。！？\n]/).filter(s => s.trim())
  if (sentences.length < 2) return content
  
  // 随机选择一个位置插入
  const insertPos = Math.floor(Math.random() * (sentences.length - 1)) + 1
  const prefix = sentences.slice(0, insertPos).join('。') + '。'
  const suffix = sentences.slice(insertPos).join('。') + '。'
  
  return `${prefix}${phrase}，${suffix}`
}

/**
 * 插入不完美细节
 */
function insertDetail(content: string, detail: string): string {
  // 在图片描述附近插入
  const imagePatterns = ['图', '照片', '视频', '截图', '实拍']
  for (const pattern of imagePatterns) {
    const index = content.indexOf(pattern)
    if (index !== -1 && index > 0) {
      return content.slice(0, index) + detail + content.slice(index)
    }
  }
  
  // 如果没有找到图片相关词汇，在结尾插入
  return content + '\n\n' + detail
}

/**
 * 插入错别字
 */
function insertTypo(content: string, mistakes: Record<string, string[]>): string {
  const words = Object.keys(mistakes)
  const randomWord = words[Math.floor(Math.random() * words.length)]
  const typos = mistakes[randomWord]
  const randomTypo = typos[Math.floor(Math.random() * typos.length)]
  
  // 只替换第一个出现的
  const index = content.indexOf(randomWord)
  if (index === -1) return content
  return content.slice(0, index) + randomTypo + content.slice(index + randomWord.length)
}

/**
 * 截断到指定字数
 */
function truncateToWordCount(content: string, maxWords: number): string {
  // 估算字数（中文字符+英文单词）
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length
  const totalWords = chineseChars + englishWords
  
  if (totalWords <= maxWords) {
    return content
  }
  
  // 找到合适的截断点
  let truncated = content
  while (countWords(truncated) > maxWords) {
    truncated = truncated.slice(0, -1)
  }
  
  // 确保不在句子中间截断
  const lastPeriod = Math.max(
    truncated.lastIndexOf('。'),
    truncated.lastIndexOf('！'),
    truncated.lastIndexOf('？'),
    truncated.lastIndexOf('\n')
  )
  
  if (lastPeriod > maxWords * 0.8) {
    truncated = truncated.slice(0, lastPeriod + 1)
  } else {
    truncated += '...'
  }
  
  return truncated
}

/**
 * 统计字数
 */
function countWords(text: string): number {
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
  return chineseChars + englishWords
}

/**
 * 生成吸引人的标题
 */
export function generateHumanTitle(keyword: string, options: { emotion?: string }): string {
  const emotions = options.emotion || ['后悔', '震惊', '真香', '踩坑', '逆袭']
  const numbers = ['3天', '7天', '15天', '30天', '半年', '一年']
  const patterns = [
    `用了${numbers[Math.floor(Math.random() * numbers.length)]}，我决定${Math.random() > 0.5 ? '把' + keyword + '退了' : '又买了'+keyword}`,
    `${keyword}真实体验：${emotions[Math.floor(Math.random() * emotions.length)]}`,
    `千万别买${keyword}！除非...`,
    `${keyword}大实话：${emotions[Math.floor(Math.random() * emotions.length)]}`,
    `用了${keyword}${numbers[Math.floor(Math.random() * numbers.length)]}，终于敢说真话了`,
    `${keyword}到底是不是智商税？亲测告诉你答案`
  ]
  
  let title = patterns[Math.floor(Math.random() * patterns.length)]
  
  // 确保标题长度适中
  if (title.length > 30) {
    title = title.slice(0, 27) + '...'
  }
  
  return title
}

/**
 * 检查标题是否包含禁止词
 */
export function isValidTitle(title: string): boolean {
  return !FORBIDDEN_TITLE_WORDS.some(word => title.includes(word))
}
