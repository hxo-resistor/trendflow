/**
 * 去AI化引擎 - Content Humanizer
 * 让AI生成的内容更像真人写的，避免平台识别降权
 */

export interface HumanizeResult {
  original: string
  humanized: string
  score: number  // 真人感评分 0-100
  changes: string[]
}

// 口语化表达库
const COLLOQUIAL_PHRASES = [
  '说实话',
  '有一说一',
  '讲真',
  '不吹不黑',
  '亲测有效',
  '个人感觉',
  '真心觉得',
  '踩了好多坑才总结出来',
  '用了半个月才发现',
  '真的绝了',
  '救命',
  '谁懂啊',
  '我真的会谢',
  '栓Q',
  '笑死',
  '蚌埠住了'
]

// 不完美细节（模拟真人习惯）
const IMPERFECT_DETAILS = [
  '拍照技术太烂了凑合看',
  '懒得修图了',
  '随手拍的',
  '原相机直出',
  '没打光',
  '画质渣勿喷',
  '设备有限',
  '大家将就着看'
]

// 常见错别字/口语化用词
const TYPICAL_MISTAKES: Record<string, string[]> = {
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
  '首先', '其次', '最后', '综上所述', '总而言之',
  '大家好今天来', '今天小编来', '大家好'
]

/**
 * 主去AI化处理函数
 */
export function humanizeContent(
  content: string,
  options: {
    platform?: string
    targetScore?: number
    maxIterations?: number
  } = {}
): HumanizeResult {
  let processed = content
  const changes: string[] = []
  const maxIterations = options.maxIterations || 5
  const targetScore = options.targetScore || 70
  
  for (let i = 0; i < maxIterations; i++) {
    const before = processed
    
    // 1. 替换AI式开头
    processed = replaceAiOpenings(processed)
    changes.push('替换了AI式开头')
    
    // 2. 随机插入口语化表达
    processed = insertColloquialExpressions(processed)
    changes.push('插入口语化表达')
    
    // 3. 添加不完美细节
    processed = addImperfectDetails(processed)
    changes.push('添加不完美细节')
    
    // 4. 随机添加错别字（概率20%）
    if (Math.random() < 0.2) {
      processed = addTypo(processed)
      changes.push('添加口语化变体')
    }
    
    // 5. 打乱部分完美结构
    processed = breakPerfectStructure(processed)
    changes.push('打破完美结构')
    
    // 检查得分
    const score = calculateHumanScore(processed)
    if (score >= targetScore) {
      break
    }
    
    // 如果内容没有变化，退出循环
    if (processed === before) break
  }
  
  const finalScore = calculateHumanScore(processed)
  
  return {
    original: content,
    humanized: processed,
    score: finalScore,
    changes
  }
}

/**
 * 替换AI式开头
 */
function replaceAiOpenings(content: string): string {
  const lines = content.split('\n')
  if (lines.length === 0) return content
  
  const firstLine = lines[0]
  const hasForbiddenOpening = FORBIDDEN_OPENINGS.some(word => firstLine.includes(word))
  
  if (!hasForbiddenOpening) return content
  
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
  const newFirstLine = firstLine.replace(new RegExp(`^${FORBIDDEN_OPENINGS.find(w => firstLine.includes(w))}|^[^\s]+`), '')
  
  lines[0] = `${randomOpening}，${newFirstLine}`
  return lines.join('\n')
}

/**
 * 随机插入口语化表达
 */
function insertColloquialExpressions(content: string): string {
  if (Math.random() > 0.6) return content
  
  const phrase = COLLOQUIAL_PHRASES[Math.floor(Math.random() * COLLOQUIAL_PHRASES.length)]
  const sentences = content.split(/[。！？\n]/).filter(s => s.trim())
  
  if (sentences.length < 2) return content
  
  const pos = Math.floor(Math.random() * (sentences.length - 1)) + 1
  const before = sentences.slice(0, pos).join('。') + '。'
  const after = sentences.slice(pos).join('。') + '。'
  
  return `${before}${phrase}，${after}`
}

/**
 * 添加不完美细节
 */
function addImperfectDetails(content: string): string {
  if (Math.random() > 0.4) return content
  
  const detail = IMPERFECT_DETAILS[Math.floor(Math.random() * IMPERFECT_DETAILS.length)]
  
  // 在图片描述附近插入
  const imagePatterns = ['图', '照片', '视频', '截图', '实拍']
  for (const pattern of imagePatterns) {
    const index = content.indexOf(pattern)
    if (index !== -1 && index > 0) {
      return content.slice(0, index) + detail + content.slice(index)
    }
  }
  
  return content + '\n\n' + detail
}

/**
 * 添加口语化错别字
 */
function addTypo(content: string): string {
  const words = Object.keys(TYPICAL_MISTAKES)
  const randomWord = words[Math.floor(Math.random() * words.length)]
  const typos = TYPICAL_MISTAKES[randomWord]
  const randomTypo = typos[Math.floor(Math.random() * typos.length)]
  
  // 只替换第一个出现的
  const regex = new RegExp(randomWord, 'g')
  const match = content.match(regex)
  
  if (match) {
    return content.replace(regex, randomTypo)
  }
  
  return content
}

/**
 * 打乱完美结构
 */
function breakPerfectStructure(content: string): string {
  if (Math.random() > 0.7) return content
  
  const lines = content.split('\n')
  if (lines.length < 5) return content
  
  // 随机插入空行，打破完美段落
  const randomIndex = Math.floor(Math.random() * (lines.length - 1)) + 1
  lines.splice(randomIndex, 0, '')
  
  return lines.join('\n')
}

/**
 * 计算真人感分数
 */
function calculateHumanScore(content: string): number {
  let score = 50 // 基础分
  
  // 检查是否包含口语化表达
  for (const phrase of COLLOQUIAL_PHRASES) {
    if (content.includes(phrase)) score += 5
  }
  
  // 检查是否包含不完美细节
  for (const detail of IMPERFECT_DETAILS) {
    if (content.includes(detail)) score += 3
  }
  
  // 检查是否有AI式开头
  for (const forbidden of FORBIDDEN_OPENINGS) {
    if (content.startsWith(forbidden)) score -= 10
  }
  
  // 检查结构是否工整（段落数量）
  const paragraphs = content.split('\n').filter(l => l.trim()).length
  if (paragraphs > 10) score -= 5 // 段落太多显得工整
  if (paragraphs >= 3 && paragraphs <= 8) score += 5 // 适中段落数
  
  // 检查是否有缺点描述
  if (content.includes('缺点') || content.includes('不足') || content.includes('不满意')) {
    score += 10
  }
  
  // 检查是否有具体数据/时间
  if (/\d+天|\d+个月|\d+小时/.test(content)) {
    score += 5
  }
  
  return Math.min(100, Math.max(0, score))
}

/**
 * 批量去AI化处理
 */
export function batchHumanize(contents: string[], options = {}): HumanizeResult[] {
  return contents.map(content => humanizeContent(content, options))
}

/**
 * 获取真人感评分说明
 */
export function getScoreExplanation(score: number): { level: string; advice: string } {
  if (score >= 90) {
    return { 
      level: '💯 极度真实', 
      advice: '内容已经非常自然，可以放心发布' 
    }
  } else if (score >= 70) {
    return { 
      level: '👍 真实可信', 
      advice: '内容表现良好，只需微调即可' 
    }
  } else if (score >= 50) {
    return { 
      level: '⚠️ 仍有AI痕迹', 
      advice: '建议再次运行去AI化处理' 
    }
  } else {
    return { 
      level: '🚨 AI感明显', 
      advice: '需要大量人工修改或重新生成' 
    }
  }
}
