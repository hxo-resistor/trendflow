import { NextResponse } from 'next/server'

/**
 * 话术生成API
 * POST /api/generate-comment
 */

interface CommentRequest {
  keyword: string
  platform?: string
  style?: string
}

interface CommentResponse {
  success: boolean
  comments: string[]
  keyword: string
}

// 话术模板库
const COMMENT_TEMPLATES: Record<string, string[]> = {
  '降噪蓝牙耳机': [
    '用了两周，降噪确实厉害，地铁上完全听不到噪音，音质也很棒，推荐~',
    '这款比我之前用的XX好多了，便宜又好用，链接放主页了',
    '对比了好几款，最后选的这款，性价比最高，没后悔',
    '老公说这个比苹果 AirPods 还好用，哈哈，反正我挺满意的',
    '用了两个月，电池续航很棒，充电一次能用好几天'
  ],
  '智能宠物喂食器': [
    '养猫必备！出门旅游再也不用担心主子饿肚子了',
    '自动投食太方便了，定时定量，猫咪也适应得很快',
    '比手动喂省心多了，还能手机远程操控，爱了爱了',
    '买了两台，一台放家里一台放父母家，很实用',
    '性价比很高，功能齐全，推荐入手'
  ],
  '车载手机支架': [
    '磁吸的很牢固，过减速带都不掉，开车必备',
    '安装很简单，几秒钟搞定，角度也能调，不错',
    '比之前买的XX好太多，这个稳固多了',
    '放在车上刚刚好，不影响空调出风口',
    '质感很好，值得购买'
  ],
  '空气炸锅': [
    '懒人神器！炸薯条炸鸡都不用油，健康又好吃',
    '买了后天天用，做东西超方便，清洗也容易',
    '比烤箱好用多了，预热快，容量也够',
    '做蛋挞、烤鸡翅都超赞，颜值还高',
    '性价比很高，家用足够了'
  ],
  '电动牙刷': [
    '刷得很干净，比手动牙刷提升太多，牙齿光滑很多',
    '用了半个月，牙龈出血好多了，推荐',
    '续航很强，充一次电能用好几个月',
    '有多个档位，敏感牙也能用',
    '送人自用都不错，包装也很精美'
  ],
  '机械键盘': [
    '打字手感太爽了，青轴声音清脆，效率翻倍',
    'RGB灯效很漂亮，晚上打字很有氛围感',
    '比薄膜键盘好用太多，编程必备',
    '键帽质感很好，字符清晰不褪色',
    '性价比高，入门首选'
  ]
}

// 默认话术模板
const DEFAULT_TEMPLATES = [
  '这款确实不错，用了几天才来推荐的',
  '对比了好几家，最后选了这款，没踩雷',
  '性价比很高，值得入手',
  '用了半个月，感觉还可以，推荐给需要的人',
  '链接放主页了，需要的自己去看'
]

export async function POST(request: Request) {
  try {
    const body: CommentRequest = await request.json()
    const { keyword, platform = 'weibo', style = 'casual' } = body

    if (!keyword) {
      return NextResponse.json(
        { error: '请提供关键词' },
        { status: 400 }
      )
    }

    // 根据关键词匹配合适的话术模板
    let templates = DEFAULT_TEMPLATES
    
    for (const [productKey, productTemplates] of Object.entries(COMMENT_TEMPLATES)) {
      if (keyword.includes(productKey) || productKey.includes(keyword)) {
        templates = productTemplates
        break
      }
    }

    // 随机选择3条话术
    const shuffled = [...templates].sort(() => Math.random() - 0.5)
    const selectedComments = shuffled.slice(0, 3)

    // 根据风格微调
    const comments = selectedComments.map(comment => {
      if (style === 'professional') {
        return comment.replace('~', '。').replace('哈哈', '').trim()
      }
      return comment
    })

    const response: CommentResponse = {
      success: true,
      comments,
      keyword
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Generate comment error:', error)
    return NextResponse.json(
      { error: '生成失败' },
      { status: 500 }
    )
  }
}
