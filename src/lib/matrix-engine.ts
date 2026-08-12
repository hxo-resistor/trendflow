/**
 * NEXUS-2027 矩阵战争核心引擎
 * 50账号矩阵管理系统
 */

export interface Account {
  id: string
  platform: 'weibo' | 'zhihu' | 'xiaohongshu' | 'baijiahao' | 'toutiao'
  persona: Persona
  status: 'warming' | 'active' | 'suspended' | 'banned'
  followers: number
  dailyPosts: number
  dailyComments: number
  lastActivity: string
  createdAt: string
}

export interface Persona {
  name: string
  profile: string
  style: string
  products: string[]
  accounts: number
}

export const PERSONAS: Persona[] = [
  {
    name: "数码极客男",
    profile: "科技爱好者 | 数码产品深度玩家 | 真实体验分享",
    style: "理性、参数党、数据说话",
    products: ["降噪耳机", "智能手表", "蓝牙音箱"],
    accounts: 10
  },
  {
    name: "精致宝妈",
    profile: "90后宝妈 | 育儿好物分享 | 只推荐宝宝真正需要的",
    style: "感性、实用、性价比",
    products: ["智能喂食器", "婴儿监控", "扫地机器人"],
    accounts: 10
  },
  {
    name: "学生党省钱王",
    profile: "大学生 | 省钱攻略 | 平价好物挖掘机",
    style: "直白、接地气、穷但精致",
    products: ["蓝牙耳机", "充电宝", "手机支架"],
    accounts: 10
  },
  {
    name: "汽车发烧友",
    profile: "汽车博主 | 改装爱好者 | 车载好物实测",
    style: "专业、硬核、动手党",
    products: ["车载支架", "行车记录仪", "车载充电器"],
    accounts: 10
  },
  {
    name: "家居生活家",
    profile: "家居博主 | 好物推荐 | 让家更舒服",
    style: "温馨、实用、种草",
    products: ["扫地机器人", "空气净化器", "智能家居"],
    accounts: 10
  }
]

// 互顶机制配置
export const INTERACTION_RULES = {
  minInterval: 5000,         // 最小间隔5秒
  maxInterval: 30000,        // 最大间隔30秒
  batchSize: 3,              // 每批最多3个号同时操作
  batchInterval: 60000,      // 批次间隔1分钟
  dailyLimit: 50,            // 每个号每天最多参与50次互顶
  randomRange: 0.3           // 随机偏移30%
}

// 防封策略配置
export const ANTI_BAN_CONFIG = {
  ipRotation: true,
  ipChangeInterval: 86400000, // 每天换一次IP
  randomDelay: { min: 2000, max: 15000 },
  mouseMovement: true,
  scrollBehavior: true,
  dailyPosts: { max: 10 },
  dailyComments: { max: 20 },
  dailyLikes: { max: 50 },
  accountAge: 3,              // 3天以上才能发内容
  warmupDays: 3,              // 3天养号期
  contentRatio: 0.3,          // 推广内容不超过30%
  banDetection: true,
  backupAccounts: 10,         // 10个备用号
  crossPlatform: true
}

// 评论海配置
export const COMMENT_ARMY = {
  questioners: 10,
  recommenders: 15,
  experiencers: 10,
  doubters: 5,
  supporters: 5,
  linkers: 5
}

// 评论话术库
export const COMMENT_ARMY_SCRIPTS = {
  questioner: [
    "这个多少钱啊？",
    "哪里买比较便宜？",
    "和XX比哪个好？",
    "有优惠券吗？",
    "质量怎么样？用过的说说"
  ],
  recommender: [
    "我买了XX，比这个便宜一半，效果一样",
    "推荐XX，用了半年了，没出过问题",
    "这个价位不如买XX，性价比高很多",
    "XX用户路过，表示真香",
    "我对比了好几个，最后选的XX，不后悔"
  ],
  doubter: [
    "真的假的？我买回来试试",
    "观望中，等更多评价",
    "先收藏，等降价再入手"
  ],
  supporter: [
    "楼主推荐的这个确实好，我朋友买了",
    "跟风入了一个，确实不错",
    "看到好多人推荐，打算入手了"
  ],
  linker: [
    "我整理了几款的对比，去我主页看",
    "主页有详细测评，需要的自己去看",
    "我写了篇对比，主页有链接"
  ]
}

// 竞品截流配置
export const COMPETITOR_SOURCES = [
  { platform: "zhihu", type: "search", keyword: "宠物喂食器推荐" },
  { platform: "xiaohongshu", type: "search", keyword: "降噪耳机" },
  { platform: "weibo", type: "search", keyword: "车载支架" },
  { platform: "zhihu", type: "account", name: "竞品A" },
  { platform: "xiaohongshu", type: "account", name: "竞品B" }
]

export const COMPETITOR_INTERCEPT = [
  "这个也不错，不过我对比后选了另一款，性价比更高",
  "我两个都买了，个人觉得XX更适合我",
  "好巧，我也在对比这两个，最后入了XX",
  "XX用户路过，当时也看了这个，但还是选了XX",
  "各有优势吧，XX的性价比确实高一些"
]

/**
 * 生成50个账号
 */
export function generateMatrixAccounts(): Account[] {
  const accounts: Account[] = []
  const platforms: Array<'weibo' | 'zhihu' | 'xiaohongshu' | 'baijiahao' | 'toutiao'> = ['weibo', 'zhihu', 'xiaohongshu', 'baijiahao', 'toutiao']
  
  PERSONAS.forEach((persona, pIdx) => {
    for (let i = 0; i < persona.accounts; i++) {
      const platform = platforms[pIdx % platforms.length]
      accounts.push({
        id: `acc-${pIdx}-${i}`,
        platform,
        persona,
        status: 'warming',
        followers: Math.floor(Math.random() * 100),
        dailyPosts: 0,
        dailyComments: 0,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString()
      })
    }
  })
  
  return accounts
}

/**
 * 计算矩阵总数据
 */
export function getMatrixStats(accounts: Account[]) {
  return {
    total: accounts.length,
    active: accounts.filter(a => a.status === 'active').length,
    warming: accounts.filter(a => a.status === 'warming').length,
    suspended: accounts.filter(a => a.status === 'suspended').length,
    banned: accounts.filter(a => a.status === 'banned').length,
    byPlatform: Object.entries(
      accounts.reduce((acc, a) => {
        acc[a.platform] = (acc[a.platform] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ),
    byPersona: Object.entries(
      accounts.reduce((acc, a) => {
        acc[a.persona.name] = (acc[a.persona.name] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ),
    totalFollowers: accounts.reduce((sum, a) => sum + a.followers, 0),
    totalDailyPosts: accounts.reduce((sum, a) => sum + a.dailyPosts, 0),
    totalDailyComments: accounts.reduce((sum, a) => sum + a.dailyComments, 0)
  }
}

/**
 * 检查是否需要换IP（模拟）
 */
export function shouldRotateIP(account: Account): boolean {
  const lastActivity = new Date(account.lastActivity).getTime()
  const now = Date.now()
  return (now - lastActivity) > ANTI_BAN_CONFIG.ipChangeInterval
}

/**
 * 获取随机延迟时间
 */
export function getRandomDelay(min: number = 2000, max: number = 15000): number {
  const range = max - min
  const random = Math.random()
  return Math.floor(min + range * random * (1 + INTERACTION_RULES.randomRange))
}

/**
 * 生成互顶任务
 */
export function generateInteractionTasks(
  mainAccount: Account,
  targetCommentId: string,
  supportCount: number = 10
): Array<{ accountId: string; action: 'like' | 'reply'; delay: number }> {
  const tasks: Array<{ accountId: string; action: 'like' | 'reply'; delay: number }> = []
  
  // 点赞任务
  for (let i = 0; i < Math.min(supportCount, INTERACTION_RULES.batchSize); i++) {
    tasks.push({
      accountId: `support-${Date.now()}-${i}`,
      action: 'like',
      delay: getRandomDelay(INTERACTION_RULES.minInterval, INTERACTION_RULES.maxInterval)
    })
  }
  
  return tasks
}

/**
 * 生成评论海任务
 */
export function generateCommentArmyTasks(
  postUrl: string,
  persona: Persona
): Array<{ role: keyof typeof COMMENT_ARMY; script: string; delay: number }> {
  const tasks: Array<{ role: keyof typeof COMMENT_ARMY; script: string; delay: number }> = []
  const roles = Object.keys(COMMENT_ARMY) as Array<keyof typeof COMMENT_ARMY>
  
  roles.forEach(role => {
    const count = COMMENT_ARMY[role]
    const scripts = COMMENT_ARMY_SCRIPTS[role as keyof typeof COMMENT_ARMY_SCRIPTS] || []
    
    for (let i = 0; i < count; i++) {
      const script = scripts[i % scripts.length]
      tasks.push({
        role,
        script,
        delay: getRandomDelay(10000, 60000) // 5分钟内均匀分布
      })
    }
  })
  
  // 按 persona 调整话术风格
  return tasks.map(t => ({
    ...t,
    script: adjustScriptByPersona(t.script, persona.style)
  }))
}

/**
 * 根据人设风格调整话术
 */
function adjustScriptByPersona(script: string, style: string): string {
  // 简单实现：根据不同风格添加前缀或后缀
  if (style.includes('理性')) {
    return `[数据党] ${script}`
  } else if (style.includes('感性')) {
    return `[宝妈分享] ${script}`
  } else if (style.includes('直白')) {
    return `[省钱王] ${script}`
  } else if (style.includes('专业')) {
    return `[车主认证] ${script}`
  } else if (style.includes('温馨')) {
    return `[家居控] ${script}`
  }
  return script
}
