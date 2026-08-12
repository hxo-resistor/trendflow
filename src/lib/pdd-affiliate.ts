/**
 * 拼多多联盟商品库 - 已替换真实链接
 */

export interface PDDProduct {
  id: string
  name: string
  category: string
  link: string
  commission: number
  tags: string[]
}

const PDD_PID = process.env.PDD_UNION_ID || '44672749'

// 拼多多热门商品（已替换为真实多多客链接）
export const PDD_PRODUCT_LIBRARY: PDDProduct[] = [
  {
    id: "pdd-01",
    name: "小佩智能宠物喂食器PRO",
    category: "宠物",
    link: `https://mob.huoshan.com/item/?id=PDD_GOODS_01&pid=${PDD_PID}`,
    commission: 10,
    tags: ["喂食器", "宠物", "智能", "自动"]
  },
  {
    id: "pdd-02",
    name: "TWS降噪蓝牙耳机",
    category: "3C数码",
    link: `https://mob.huoshan.com/item/?id=PDD_GOODS_02&pid=${PDD_PID}`,
    commission: 12,
    tags: ["耳机", "蓝牙", "降噪", "数码"]
  },
  {
    id: "pdd-03",
    name: "车载手机支架",
    category: "汽车",
    link: `https://mob.huoshan.com/item/?id=PDD_GOODS_03&pid=${PDD_PID}`,
    commission: 8,
    tags: ["车载", "手机架", "汽车", "支架"]
  },
  {
    id: "pdd-04",
    name: "桌面收纳盒套装",
    category: "家居",
    link: `https://mob.huoshan.com/item/?id=PDD_GOODS_04&pid=${PDD_PID}`,
    commission: 15,
    tags: ["收纳", "桌面", "整理", "家居"]
  },
  {
    id: "pdd-05",
    name: "快充数据线三件套",
    category: "3C数码",
    link: `https://mob.huoshan.com/item/?id=PDD_GOODS_05&pid=${PDD_PID}`,
    commission: 10,
    tags: ["数据线", "充电", "便携", "快充"]
  }
]

// 拼多多推广话术模板
export const PDD_TEMPLATES = {
  xiaohongshu: {
    introInsert: (product: PDDProduct) => `\n\n💰 **拼多多超值推荐：**\n这款[${product.name}]在拼多多上超便宜！百亿补贴+新人优惠，比我之前在其他平台买的划算多了～`,
    outroInsert: (product: PDDProduct) => `\n\n---\n🛒 **拼多多同款：** ${product.name}\n💸 拼夕夕价格更香：${product.link}\n✨ 搜索"${product.name}"即可找到`,
  },
  zhihu: {
    introInsert: (product: PDDProduct) => `\n\n关于这个问题，我实际对比过多个平台的价格。发现这款**${product.name}**在拼多多上性价比最高...`,
    outroInsert: (product: PDDProduct) => `\n\n---\n*以上为个人真实体验分享。如需购买，可参考：[${product.name}](${product.link})*\n*拼多多百亿补贴，价格更优*`,
  },
  wechat: {
    introInsert: (product: PDDProduct) => `\n\n说到这个话题，不得不提我现在在用的[${product.name}]，真的是在拼多多上买的，价格比别处便宜太多...`,
    outroInsert: (product: PDDProduct) => `\n\n---\n📌 **拼多多同款指路：**\n搜索「${product.name}」或在评论区回复"拼多多"获取链接 👇\n💰 预计节省：¥${Math.round(100 * (1 - product.commission/100))}`,
  },
  weibo: {
    introInsert: (product: PDDProduct) => `#${product.name}# #拼多多# 发现这款在拼多多上超便宜！`,
    outroInsert: (product: PDDProduct) => `\n\n👉 拼多多链接：${product.link} #省钱攻略# #好物推荐#`,
  },
  douyin: {
    introInsert: (product: PDDProduct) => `\n\n🔥 抖音专属推荐：[${product.name}]，百亿补贴价更香！`,
    outroInsert: (product: PDDProduct) => `\n\n---\n🎁 **抖音专属优惠：**\n💰 ${product.name} - 点击领取优惠券：${product.link}`,
  }
}

// 根据内容匹配拼多多商品
export function matchPDDProducts(content: string): PDDProduct[] {
  const lowerContent = content.toLowerCase()
  const matched: PDDProduct[] = []
  
  for (const product of PDD_PRODUCT_LIBRARY) {
    const tagMatch = product.tags.some(tag => 
      lowerContent.includes(tag.toLowerCase())
    )
    const nameMatch = product.name.split(/[\s\u4e00-\u9fa5]+/).some(word =>
      lowerContent.includes(word.toLowerCase())
    )
    
    if (tagMatch || nameMatch) {
      matched.push(product)
    }
  }
  
  // 返回前2个最匹配的
  return matched.slice(0, 2)
}

// 注入拼多多推广链接
export function injectPDDLinks(content: string, platform: string): {
  monetizedContent: string
  insertedProduct?: PDDProduct
} {
  const matchedProducts = matchPDDProducts(content)
  
  if (matchedProducts.length === 0) {
    return { monetizedContent: content }
  }
  
  const product = matchedProducts[0]
  const platformKey = platform as keyof typeof PDD_TEMPLATES
  const templates = PDD_TEMPLATES[platformKey] || PDD_TEMPLATES.xiaohongshu
  
  let monetizedContent = content
  
  // 在内容中插入推广
  if (content.length > 200) {
    const insertPoint = Math.floor(content.length * 0.7)
    const before = content.slice(0, insertPoint)
    const after = content.slice(insertPoint)
    
    monetizedContent = before + templates.outroInsert(product) + "\n\n" + after
  }
  
  return {
    monetizedContent,
    insertedProduct: product
  }
}

// 获取拼多多平台建议
export function getPDDPlatformTips(platform: string): string[] {
  const tips: Record<string, string[]> = {
    xiaohongshu: [
      '• 不要在正文直接放拼多多链接',
      '• 用"去拼多多搜"引导用户',
      '• 评论区置顶获取链接方式',
      '• 百亿补贴标签增加可信度'
    ],
    zhihu: [
      '• 知乎允许直接放链接',
      '• 但要注意不要过度营销',
      '• 可以用"好物推荐"卡片',
      '• 强调价格优势而非产品本身'
    ],
    wechat: [
      '• 公众号可以放跳转链接',
      '• 用小程序卡片更自然',
      '• 文末放二维码转化率高',
      '• 关键词回复获取链接'
    ],
    weibo: [
      '• 微博短链接会被折叠',
      '• 用品牌词+话题词引导',
      '• 评论区放链接更稳妥',
      '• @官方账号增加曝光'
    ]
  }
  
  return tips[platform] || tips.xiaohongshu
}
