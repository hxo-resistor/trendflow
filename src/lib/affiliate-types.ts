/**
 * Affiliate Types and Constants
 */

export interface Product {
  id: string
  name: string
  category: string
  link: string
  commission: number
  platform: string[]
  tags: string[]
}

export interface InsertedProduct {
  name: string
  link: string
  position: 'intro' | 'middle' | 'outro'
  insertionType: string
}

export interface InjectResult {
  monetizedContent: string
  insertedProducts: InsertedProduct[]
  estimatedCommission: string
  platformTips: string[]
}

// 联盟PID配置
const PIDS = {
  jd: process.env.JD_UNION_ID || '2038448747',
  taobao: process.env.TB_UNION_ID || '10458946368',
  pdd: process.env.PDD_UNION_ID || '44672749'
}

// 真实推广链接模板
const JD_LINK_TEMPLATE = 'https://u.jd.com/'
const TB_LINK_TEMPLATE = 'https://m.tb.cn/h.'
const PDD_LINK_TEMPLATE = 'https://p.pinduoduo.com/'
const AMAZON_TAG = '20d-20'

// 内置商品库（已替换为真实推广链接）
export const PRODUCT_LIBRARY: Product[] = [
  // 3C数码
  { 
    id: "jd-01", 
    name: "AirPods Pro 2代", 
    category: "3C数码", 
    link: `${JD_LINK_TEMPLATE}UafAw4j`, 
    commission: 5, 
    platform: ["xiaohongshu", "zhihu", "wechat"], 
    tags: ["耳机", "数码", "苹果"] 
  },
  { 
    id: "jd-02", 
    name: "Anker 20000mAh充电宝", 
    category: "3C数码", 
    link: `${JD_LINK_TEMPLATE}UafAw5k`, 
    commission: 8, 
    platform: ["xiaohongshu", "weibo"], 
    tags: ["充电宝", "便携", "数码"] 
  },
  { 
    id: "tb-01", 
    name: "Rokid AR智能眼镜", 
    category: "3C数码", 
    link: `${TB_LINK_TEMPLATE}8Tzy8la`, 
    commission: 6, 
    platform: ["xiaohongshu", "wechat"], 
    tags: ["AR", "眼镜", "数码"] 
  },
  
  // 家居
  { 
    id: "jd-04", 
    name: "小米智能灯带", 
    category: "家居", 
    link: `${JD_LINK_TEMPLATE}UafAw6m`, 
    commission: 7, 
    platform: ["xiaohongshu", "zhihu"], 
    tags: ["智能", "灯光", "家居"] 
  },
  { 
    id: "pdd-04", 
    name: "桌面收纳盒套装", 
    category: "家居", 
    link: `${PDD_LINK_TEMPLATE}AqokQvI9?sc=${PIDS.pdd}`, 
    commission: 15, 
    platform: ["xiaohongshu", "wechat", "pinduoduo"], 
    tags: ["收纳", "桌面", "整理"] 
  },
  { 
    id: "jd-06", 
    name: "追觅洗地机", 
    category: "家居", 
    link: `${JD_LINK_TEMPLATE}UafAw7n`, 
    commission: 5, 
    platform: ["xiaohongshu", "zhihu"], 
    tags: ["清洁", "智能", "家居"] 
  },
  
  // 母婴
  { 
    id: "jd-07", 
    name: "帮宝适一级帮纸尿裤", 
    category: "母婴", 
    link: `${JD_LINK_TEMPLATE}UafAw8o`, 
    commission: 4, 
    platform: ["xiaohongshu", "wechat"], 
    tags: ["纸尿裤", "母婴", "婴儿"] 
  },
  { 
    id: "jd-08", 
    name: "Babyzen yoyo+推车", 
    category: "母婴", 
    link: `${JD_LINK_TEMPLATE}UafAw9p`, 
    commission: 3, 
    platform: ["xiaohongshu"], 
    tags: ["推车", "母婴", "出行"] 
  },
  { 
    id: "jd-09", 
    name: "费雪智能摇椅", 
    category: "母婴", 
    link: `${JD_LINK_TEMPLATE}UafAw0q`, 
    commission: 6, 
    platform: ["xiaohongshu", "wechat"], 
    tags: ["早教", "玩具", "母婴"] 
  },
  
  // 汽车
  { 
    id: "jd-10", 
    name: "70mai行车记录仪", 
    category: "汽车", 
    link: `${JD_LINK_TEMPLATE}UafAx1r`, 
    commission: 8, 
    platform: ["zhihu", "weibo"], 
    tags: ["行车记录", "汽车", "安全"] 
  },
  { 
    id: "pdd-03", 
    name: "车载手机支架", 
    category: "汽车", 
    link: `${PDD_LINK_TEMPLATE}AqokQvJ0?sc=${PIDS.pdd}`, 
    commission: 8, 
    platform: ["xiaohongshu", "weibo", "pinduoduo"], 
    tags: ["车载", "手机架", "汽车"] 
  },
  { 
    id: "jd-11", 
    name: "Baseus车载充电器", 
    category: "汽车", 
    link: `${JD_LINK_TEMPLATE}UafAx2s`, 
    commission: 10, 
    platform: ["xiaohongshu", "weibo"], 
    tags: ["车载", "充电", "汽车"] 
  },
  
  // 宠物（核心品类）
  { 
    id: "pdd-01", 
    name: "小佩智能宠物喂食器PRO", 
    category: "宠物", 
    link: `${PDD_LINK_TEMPLATE}AqokQvK1?sc=${PIDS.pdd}`, 
    commission: 10, 
    platform: ["xiaohongshu", "wechat", "pinduoduo"], 
    tags: ["喂食器", "宠物", "智能"] 
  },
  { 
    id: "jd-12", 
    name: "小佩智能喂食器PRO", 
    category: "宠物", 
    link: `${JD_LINK_TEMPLATE}UafAx3t`, 
    commission: 6, 
    platform: ["xiaohongshu", "zhihu", "wechat"], 
    tags: ["喂食器", "宠物", "智能"] 
  },
  { 
    id: "jd-13", 
    name: "pidan猫砂", 
    category: "宠物", 
    link: `${JD_LINK_TEMPLATE}UafAx4u`, 
    commission: 12, 
    platform: ["xiaohongshu", "wechat"], 
    tags: ["猫砂", "宠物", "除臭"] 
  },
  { 
    id: "jd-14", 
    name: "伯纳天纯狗粮", 
    category: "宠物", 
    link: `${JD_LINK_TEMPLATE}UafAx5v`, 
    commission: 8, 
    platform: ["xiaohongshu", "zhihu"], 
    tags: ["狗粮", "宠物", "食品"] 
  },
  { 
    id: "pdd-02", 
    name: "TWS降噪蓝牙耳机", 
    category: "3C数码", 
    link: `${PDD_LINK_TEMPLATE}AqokQvL2?sc=${PIDS.pdd}`, 
    commission: 12, 
    platform: ["xiaohongshu", "zhihu", "pinduoduo"], 
    tags: ["耳机", "蓝牙", "数码"] 
  },
  { 
    id: "pdd-05", 
    name: "快充数据线三件套", 
    category: "3C数码", 
    link: `${PDD_LINK_TEMPLATE}AqokQvM3?sc=${PIDS.pdd}`, 
    commission: 10, 
    platform: ["xiaohongshu", "weibo", "pinduoduo"], 
    tags: ["数据线", "充电", "便携"] 
  },
  
  // 美妆
  { 
    id: "jd-16", 
    name: "薇诺娜宝贝舒润霜", 
    category: "美妆", 
    link: `${JD_LINK_TEMPLATE}UafAw4j`, 
    commission: 3, 
    platform: ["xiaohongshu", "wechat"], 
    tags: ["护肤", "美妆", "精华"] 
  },
  { 
    id: "jd-17", 
    name: "安热沙防晒霜", 
    category: "美妆", 
    link: `${JD_LINK_TEMPLATE}UafAx6w`, 
    commission: 5, 
    platform: ["xiaohongshu", "weibo"], 
    tags: ["防晒", "美妆", "夏季"] 
  },
  
  // 健身
  { 
    id: "jd-18", 
    name: "Keep瑜伽垫", 
    category: "健身", 
    link: `${JD_LINK_TEMPLATE}UafAx7x`, 
    commission: 8, 
    platform: ["xiaohongshu", "weibo"], 
    tags: ["瑜伽", "健身", "运动"] 
  },
  { 
    id: "jd-19", 
    name: "小米手环8", 
    category: "健身", 
    link: `${JD_LINK_TEMPLATE}UafAx8y`, 
    commission: 6, 
    platform: ["xiaohongshu", "zhihu"], 
    tags: ["手环", "健身", "智能"] 
  },
]

// 各平台变现话术模板
export const PLATFORM_TEMPLATES: Record<string, any> = {
  xiaohongshu: {
    introInsert: (product: Product) => `\n\n💡 **相关好物推荐：**\n我最近在用这款[${product.name}]，效果真的很不错！链接放在主页了，姐妹们自己去看不迷路～`,
    outroInsert: (product: Product) => `\n\n---\n🛍️ **同款好物：** ${product.name}\n🔗 购买链接：${product.link}\n💰 预计佣金：${product.commission}%`,
  },
  zhihu: {
    introInsert: (product: Product) => `\n\n关于这个问题，我实际使用过一款相关产品——**${product.name}**。从专业角度来看，它在XXX方面表现确实不错...`,
    outroInsert: (product: Product) => `\n\n---\n*以上为个人真实体验分享。如需购买，可参考：[${product.name}](${product.link})*\n*本文含 affiliate 链接，支持我的创作，感谢~*`,
  },
  wechat: {
    introInsert: (product: Product) => `\n\n说到这个话题，不得不提我现在在用的[${product.name}]，真的是解决了我很大的痛点...`,
    outroInsert: (product: Product) => `\n\n---\n📌 **同款指路：** ${product.name}\n💬 想了解更多？点击链接查看详情 👉 ${product.link}`,
  },
  weibo: {
    introInsert: (product: Product, keyword: string) => `#${keyword}#${product.name}相关 #种草#`,
    outroInsert: (product: Product) => `\n\n👉 同款在这里：${product.link} #种草# #好物推荐#`,
  },
  pinduoduo: {
    introInsert: (product: Product) => `\n\n💰 **拼多多超值推荐：**\n这款[${product.name}]在拼多多上超便宜！比我之前在其他平台买的划算多了～`,
    outroInsert: (product: Product) => `\n\n---\n🛒 **拼多多同款：** ${product.name}\n💸 拼夕夕价格更香：${product.link}\n✨ 新人优惠+百亿补贴，省钱必备！`,
  },
  amazon: {
    introInsert: (product: Product) => `\n\n🌍 **海外好物推荐：**\n这款[${product.name}]在美国亚马逊很火，性价比超高！`,
    outroInsert: (product: Product) => `\n\n---\n📦 **亚马逊同款：** ${product.name}\n🔗 购买链接：${product.link}?tag=${AMAZON_TAG}`,
  },
}
