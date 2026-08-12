/**
 * 自动选品引擎
 * 从联盟抓取高佣金热销商品
 */

export interface SelectedProduct {
  id: string
  name: string
  category: string
  price: number
  commission: number      // 佣金率(%)
  commissionAmount: number // 预估佣金(元)
  sales: number            // 月销量
  positiveRate: number     // 好评率(%)
  image: string
  link: string
  tags: string[]
  reason: string           // 推荐理由
}

export interface DailyRecommendation {
  date: string
  products: SelectedProduct[]
  totalCommission: number  // 今日预估总收益
  avgCommission: number    // 平均佣金率
}

// 模拟商品数据库（实际应从联盟API获取）
const MOCK_PRODUCTS: SelectedProduct[] = [
  {
    id: "auto-001",
    name: "小佩智能宠物喂食器PRO",
    category: "宠物用品",
    price: 899,
    commission: 12,
    commissionAmount: 107.88,
    sales: 15680,
    positiveRate: 98,
    image: "https://img.jd.com/n1/s450x450_jfs/t1/123456/1/12345/123456/5f123456E12345678/12345678.jpg",
    link: "https://u.jd.com/xxxxxx",
    tags: ["智能", "自动", "远程"],
    reason: "复购率高，用户粘性强，适合上班族"
  },
  {
    id: "auto-002",
    name: "TWS降噪蓝牙耳机",
    category: "数码配件",
    price: 299,
    commission: 15,
    commissionAmount: 44.85,
    sales: 32560,
    positiveRate: 96,
    image: "https://img.jd.com/n1/s450x450_jfs/t1/234567/2/23456/234567/5f234567E23456789/23456789.jpg",
    link: "https://u.jd.com/yyyyyy",
    tags: ["降噪", "蓝牙", "便携"],
    reason: "爆款单品，转化率高，适合年轻人群"
  },
  {
    id: "auto-003",
    name: "车载手机支架",
    category: "汽车用品",
    price: 59.9,
    commission: 20,
    commissionAmount: 11.98,
    sales: 8920,
    positiveRate: 97,
    image: "https://img.jd.com/n1/s450x450_jfs/t1/345678/3/34567/345678/5f345678E34567890/34567890.jpg",
    link: "https://u.jd.com/zzzzzz",
    tags: ["车载", "手机架", "稳固"],
    reason: "低价走量，佣金率高，适合凑单"
  },
  {
    id: "auto-004",
    name: "桌面收纳盒套装",
    category: "家居用品",
    price: 89,
    commission: 18,
    commissionAmount: 16.02,
    sales: 12340,
    positiveRate: 95,
    image: "https://img.jd.com/n1/s450x450_jfs/t1/456789/4/45678/456789/5f456789E45678901/45678901.jpg",
    link: "https://u.jd.com/aaaaaa",
    tags: ["收纳", "桌面", "整理"],
    reason: "季节性需求强，夏季宅家整理热"
  },
  {
    id: "auto-005",
    name: "快充数据线三件套",
    category: "数码配件",
    price: 39.9,
    commission: 25,
    commissionAmount: 9.98,
    sales: 45670,
    positiveRate: 96,
    image: "https://img.jd.com/n1/s450x450_jfs/t1/567890/5/56789/567890/5f567890E56789012/56789012.jpg",
    link: "https://u.jd.com/bbbbbb",
    tags: ["充电", "数据线", "快充"],
    reason: "高频消耗品，复购率超高"
  },
  {
    id: "auto-006",
    name: "pidan猫砂",
    category: "宠物用品",
    price: 128,
    commission: 12,
    commissionAmount: 15.36,
    sales: 28900,
    positiveRate: 97,
    image: "https://img.jd.com/n1/s450x450_jfs/t1/678901/6/67890/678901/5f678901E67890123/67890123.jpg",
    link: "https://u.jd.com/dddddd",
    tags: ["猫砂", "除臭", "结团"],
    reason: "猫主人刚需，复购周期稳定"
  },
  {
    id: "auto-007",
    name: "Rokid AR智能眼镜",
    category: "数码科技",
    price: 2999,
    commission: 8,
    commissionAmount: 239.92,
    sales: 3560,
    positiveRate: 94,
    image: "https://img.alicdn.com/imgextra/i1/O1CN01abc123_!!0-item_pic.jpg",
    link: "https://m.tb.cn/h.xxxxxx",
    tags: ["AR", "智能眼镜", "影视"],
    reason: "高价商品，单笔佣金高"
  },
  {
    id: "auto-008",
    name: "Keep瑜伽垫",
    category: "运动健身",
    price: 199,
    commission: 15,
    commissionAmount: 29.85,
    sales: 8760,
    positiveRate: 96,
    image: "https://img.jd.com/n1/s450x450_jfs/t1/789012/7/78901/789012/5f789012E78901234/78901234.jpg",
    link: "https://u.jd.com/eeeeee",
    tags: ["瑜伽", "健身", "居家"],
    reason: "夏季减肥需求爆发，应季商品"
  },
  {
    id: "auto-009",
    name: "小米手环8",
    category: "智能穿戴",
    price: 299,
    commission: 10,
    commissionAmount: 29.9,
    sales: 56780,
    positiveRate: 95,
    image: "https://img.jd.com/n1/s450x450_jfs/t1/890123/8/89012/890123/5f890123E89012345/89012345.jpg",
    link: "https://u.jd.com/ffffff",
    tags: ["手环", "智能", "健康"],
    reason: "小米生态用户多，口碑好转化高"
  },
  {
    id: "auto-010",
    name: "70mai行车记录仪",
    category: "汽车用品",
    price: 399,
    commission: 12,
    commissionAmount: 47.88,
    sales: 12340,
    positiveRate: 96,
    image: "https://img.jd.com/n1/s450x450_jfs/t1/901234/9/90123/901234/5f901234E90123456/90123456.jpg",
    link: "https://u.jd.com/gggggg",
    tags: ["行车记录", "安全", "高清"],
    reason: "暑期出行高峰，驾车安全需求增加"
  }
]

/**
 * 自动选品：筛选高佣金热销商品
 */
export function autoSelectProducts(
  minCommission: number = 8,
  minSales: number = 1000,
  minPositiveRate: number = 95
): SelectedProduct[] {
  return MOCK_PRODUCTS
    .filter(p => 
      p.commission >= minCommission &&
      p.sales >= minSales &&
      p.positiveRate >= minPositiveRate
    )
    .sort((a, b) => b.commissionAmount - a.commissionAmount)
    .slice(0, 10)
}

/**
 * 获取每日推荐
 */
export function getDailyRecommendation(date?: string): DailyRecommendation {
  const targetDate = date || new Date().toISOString().split('T')[0]
  const products = autoSelectProducts()
  
  return {
    date: targetDate,
    products,
    totalCommission: products.reduce((sum, p) => sum + p.commissionAmount, 0),
    avgCommission: Math.round(products.reduce((sum, p) => sum + p.commission, 0) / products.length)
  }
}

/**
 * 为单个商品生成多平台内容
 */
export function generateProductContents(product: SelectedProduct, pid: string): Record<string, any> {
  const contents: Record<string, any> = {
    xiaohongshu: generateXiaohongshuContent(product, pid),
    zhihu: generateZhihuContent(product, pid),
    weibo: generateWeiboContent(product, pid),
    douyin: generateDouyinContent(product, pid)
  }
  
  return contents
}

/**
 * 生成小红书文案
 */
function generateXiaohongshuContent(product: SelectedProduct, pid: string): any {
  const titles = [
    `用了${product.name}一周，我真的会谢！`,
    `${product.name}到底是不是智商税？亲测告诉你`,
    `姐妹们！这款${product.name}太香了！`,
    `省下${Math.round(product.price * 0.3)}元！${product.name}真实体验`
  ]
  
  return {
    platform: 'xiaohongshu',
    title: titles[Math.floor(Math.random() * titles.length)],
    body: `姐妹们！今天必须给你们种草一款我最近超爱的${product.name}！

💰 价格：${product.price}元
📦 销量：${product.sales.toLocaleString()}人已经在用
⭐ 好评率：${product.positiveRate}%

说实话一开始我也没抱太大希望，结果用了之后真香了！

✅ 优点：
- ${product.tags[0]}效果很棒
- ${product.tags[1] || '质量'}很稳定
- 性价比超高

❌ 缺点：
- 唯一的问题就是太火了，经常缺货

👉 链接在这里：https://u.jd.com/${pid}（自己搜也能找到哦～）

#${product.category} #好物分享 #亲测有效 #宝藏单品`,
    images: [product.image],
    tags: [product.category, '好物分享', '亲测有效'],
    affiliateLink: `https://u.jd.com/${pid}`,
    wordCount: 280
  }
}

/**
 * 生成知乎文案
 */
function generateZhihuContent(product: SelectedProduct, pid: string): any {
  return {
    platform: 'zhihu',
    title: `${product.name}值得买吗？真实体验告诉你`,
    body: `作为${product.category}的资深用户，我来客观分析一下这款${product.name}。

## 基本参数
- **价格**：${product.price}元
- **月销量**：${product.sales.toLocaleString()}件
- **好评率**：${product.positiveRate}%
- **佣金率**：${product.commission}%

## 优点分析
1. **性价比高** - 同价位里表现突出
2. **用户认可度高** - 近万人好评
3. **售后有保障** - 大品牌值得信赖

## 缺点
- 偶尔缺货
- 颜色选择有限

## 购买建议
如果你也在考虑入手，可以参考我的链接：
https://u.jd.com/${pid}

以上纯属个人使用体验，仅供参考。`,
    images: [product.image],
    tags: [product.category, '评测', '推荐'],
    affiliateLink: `https://u.jd.com/${pid}`,
    wordCount: 350
  }
}

/**
 * 生成微博文案
 */
function generateWeiboContent(product: SelectedProduct, pid: string): any {
  return {
    platform: 'weibo',
    title: `#${product.category}#${product.name}真实感受`,
    body: `#${product.category}# ${product.name}真实体验来了！

💰价格：${product.price}元
📊销量：${product.sales.toLocaleString()}+
⭐好评：${product.positiveRate}%

亲测好用！链接→ https://u.jd.com/${pid}

#${product.category} #好物推荐 #种草`,
    images: [product.image],
    tags: [product.category, '#好物推荐#', '#种草#'],
    affiliateLink: `https://u.jd.com/${pid}`,
    wordCount: 80
  }
}

/**
 * 生成抖音文案
 */
function generateDouyinContent(product: SelectedProduct, pid: string): any {
  return {
    platform: 'douyin',
    title: `${product.name}真实测评`,
    body: `家人们！发现一款超好用的${product.name}！

💰只要${product.price}元
📦${product.sales.toLocaleString()}人已经买了
⭐${product.positiveRate}%好评

真的太香了！链接在评论区👇
https://u.jd.com/${pid}`,
    images: [product.image],
    tags: [product.category, '#测评#', '#好物#'],
    affiliateLink: `https://u.jd.com/${pid}`,
    wordCount: 60
  }
}
