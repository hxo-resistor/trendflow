/**
 * NEXUS-2027 每日任务引擎
 * 让用户每天只需3步，5分钟搞定
 */

export interface DailyTask {
  id: string
  type: 'comment' | 'reply' | 'data_check'
  title: string
  description: string
  platform: string
  targetPost?: {
    url: string
    title: string
    author: string
    hotScore: number
  }
  content?: {
    original: string
    suggested: string
    scripts: string[]
  }
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  metadata?: {
    timesUsed?: number
    successRate?: number
    userFeedback?: string
  }
}

export interface DailyReport {
  date: string
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  stats: {
    commentsPosted: number
    repliesSent: number
    dataChecked: number
  }
  tasks: DailyTask[]
  recommendations: string[]
}

// 模拟任务数据（实际应从各平台API获取）
const MOCK_TASKS: DailyTask[] = [
  {
    id: 'task-001',
    type: 'comment',
    title: '微博评论截流',
    description: '发现热门帖子，生成专属截流话术',
    platform: 'weibo',
    targetPost: {
      url: 'https://weibo.com/hotpost123',
      title: '华为FreeClip2音质实测',
      author: '搞机王腾霄',
      hotScore: 92
    },
    content: {
      original: '这款耳机确实不错，但我觉得另一款性价比更高...',
      suggested: '华为这款确实可以，不过我对比后选了另一款，降噪效果更惊艳，链接放主页了~',
      scripts: [
        '华为这款确实可以，不过我对比后选了另一款，降噪效果更惊艳',
        '同款路过，用了半个月，个人感觉XX更香',
        '求同款的来，我已经入手了，确实不错'
      ]
    },
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-002',
    type: 'reply',
    title: '互动回复建议',
    description: '检测评论区互动，生成智能回复',
    platform: 'xiaohongshu',
    content: {
      original: '用户问：是不是自有品牌？',
      suggested: '不是不是，我自己买来用的，觉得不错分享下，主页有详细对比',
      scripts: [
        '不是，我自己买来用的，主页有整理',
        '哈哈不是，我要是开厂还在这混？',
        '纯分享，无广，真的好用才推荐的'
      ]
    },
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-003',
    type: 'data_check',
    title: '数据日报查看',
    description: '汇总昨日各平台数据，生成报告',
    platform: 'all',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
]

// 智能回复策略库
export const REPLY_STRATEGIES = {
  askBrand: {
    detect: ['自有品牌', '你的店', '你卖的', '哪里买', '旗舰店'],
    reply: [
      '不是不是，我自己买来用的，觉得不错分享下',
      '不是卖货的，纯用户分享，主页有整理你可以看看',
      '哈哈不是，我要是开厂还在这混？'
    ]
  },
  askPrice: {
    detect: ['多少钱', '价格', '贵不贵', '多少钱一个'],
    reply: [
      '我买的时候XX元，现在好像降价了',
      '当时活动价入的，现在正常价你可以去搜搜',
      '具体价格记不太清了，反正性价比很高'
    ]
  },
  askLink: {
    detect: ['链接', '求链接', '哪里买', '购买'],
    reply: [
      '主页有整理，你可以去看看',
      '我主页写了对比，有链接',
      '搜"XXX推荐"能看到我的主页'
    ]
  },
  positive: {
    detect: ['不错', '好看', '种草', '想要', '厉害'],
    reply: [
      '确实可以，用了没后悔',
      '性价比挺高的，推荐',
      '感谢认可，真的好用'
    ]
  },
  doubt: {
    detect: ['真的假的', '智商税', '别买', '坑'],
    reply: [
      '每个人感受不一样，我是觉得不错',
      '仅供参考，建议多看几家评价',
      '我个人体验很好，不知道你怎么想的'
    ]
  }
}

/**
 * 生成今日任务清单
 */
export function generateDailyTasks(date?: string): DailyReport {
  const actualDate = date || new Date().toISOString().split('T')[0]
  const todayTasks: DailyTask[] = [...MOCK_TASKS]
  
  // 计算完成进度
  const completedTasks = todayTasks.filter(t => t.status === 'completed').length
  const pendingTasks = todayTasks.filter(t => t.status === 'pending').length
  
  // 生成推荐
  const recommendations = generateRecommendations(todayTasks)
  
  return {
    date: actualDate,
    totalTasks: todayTasks.length,
    completedTasks,
    pendingTasks,
    stats: {
      commentsPosted: todayTasks.filter(t => t.type === 'comment' && t.status === 'completed').length,
      repliesSent: todayTasks.filter(t => t.type === 'reply' && t.status === 'completed').length,
      dataChecked: todayTasks.filter(t => t.type === 'data_check' && t.status === 'completed').length
    },
    tasks: todayTasks,
    recommendations
  }
}

/**
 * 生成推荐策略
 */
function generateRecommendations(tasks: DailyTask[]): string[] {
  const recs: string[] = []
  
  // 根据任务状态给出建议
  const pendingComments = tasks.filter(t => t.type === 'comment' && t.status === 'pending')
  if (pendingComments.length > 0) {
    recs.push(`还有${pendingComments.length}条评论待发布，建议趁热打铁`)
  }
  
  const pendingReplies = tasks.filter(t => t.type === 'reply' && t.status === 'pending')
  if (pendingReplies.length > 0) {
    recs.push(`有${pendingReplies.length}条互动待回复，及时回复能提升权重`)
  }
  
  // 根据时间给出建议
  const hour = new Date().getHours()
  if (hour >= 8 && hour < 12) {
    recs.push('上午是发布黄金时间，建议尽快执行')
  } else if (hour >= 18 && hour < 22) {
    recs.push('晚上是流量高峰，适合发布和互动')
  }
  
  if (recs.length === 0) {
    recs.push('今日任务已完成，准备明日计划')
  }
  
  return recs
}

/**
 * 完成任务
 */
export function completeTask(taskId: string): { success: boolean; task?: DailyTask } {
  const task = MOCK_TASKS.find(t => t.id === taskId)
  if (!task) {
    return { success: false }
  }
  
  task.status = 'completed'
  task.completedAt = new Date().toISOString()
  
  // 更新元数据
  if (!task.metadata) {
    task.metadata = {}
  }
  task.metadata.timesUsed = (task.metadata.timesUsed || 0) + 1
  
  return { success: true, task }
}

/**
 * 标记任务为进行中
 */
export function startTask(taskId: string): { success: boolean; task?: DailyTask } {
  const task = MOCK_TASKS.find(t => t.id === taskId)
  if (!task) {
    return { success: false }
  }
  
  task.status = 'in_progress'
  return { success: true, task }
}

/**
 * 获取智能回复建议
 */
export function getSmartReply(text: string, platform: string = 'weibo'): {
  strategy: string
  suggestions: string[]
} | null {
  for (const [key, strategy] of Object.entries(REPLY_STRATEGIES)) {
    if (strategy.detect.some(keyword => text.includes(keyword))) {
      // 随机选择3条回复建议
      const shuffled = [...strategy.reply].sort(() => 0.5 - Math.random())
      return {
        strategy: key,
        suggestions: shuffled.slice(0, 3)
      }
    }
  }
  
  return null
}

/**
 * 检查任务完成度
 */
export function getTaskProgress(): {
  total: number
  completed: number
  percentage: number
  status: 'pending' | 'in_progress' | 'completed'
} {
  const total = MOCK_TASKS.length
  const completed = MOCK_TASKS.filter(t => t.status === 'completed').length
  const inProgress = MOCK_TASKS.filter(t => t.status === 'in_progress').length
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  let status: 'pending' | 'in_progress' | 'completed'
  if (completed === total) {
    status = 'completed'
  } else if (inProgress > 0) {
    status = 'in_progress'
  } else {
    status = 'pending'
  }
  
  return {
    total,
    completed,
    percentage,
    status
  }
}
