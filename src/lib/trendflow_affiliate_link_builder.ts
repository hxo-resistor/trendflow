/**
 * 联盟推广链接配置
 * 请在此文件中替换为真实的联盟PID和商品链接
 */

// ==================== 联盟ID配置 ====================
export const UNION_PIDS = {
  // 京东联盟ID
  jd: process.env.JD_UNION_ID || '2038448747',
  
  // 淘宝联盟ID
  taobao: process.env.TB_UNION_ID || '10458946368',
  
  // 拼多多多多进宝ID
  pdd: process.env.PDD_UNION_ID || '44672749',
  
  // 抖音账号
  douyin1: process.env.DOUYIN_ACCOUNT_1 || 'huaxingoudia',
  douyin2: process.env.DOUYIN_ACCOUNT_2 || '93793334881',
  
  // 亚马逊联盟Tag
  amazon: '20d-20'
}

// ==================== 京东商品链接 ====================
// 格式：https://union-click.jd.com/link?k={PID}&f={商品ID}
export const JD_PRODUCTS = [
  {
    id: "jd-01",
    name: "AirPods Pro 2代",
    category: "3C数码",
    // TODO: 替换为真实京东推广链接
    link: "https://union-click.jd.com/link?k=YOUR_JD_PID&f=AIRPODS_PRO_2",
    commission: 5,
    platforms: ["xiaohongshu", "zhihu", "wechat"],
    tags: ["耳机", "数码", "苹果"]
  },
  {
    id: "jd-02",
    name: "Anker 20000mAh充电宝",
    category: "3C数码",
    // TODO: 替换为真实京东推广链接
    link: "https://union-click.jd.com/link?k=YOUR_JD_PID&f=ANKER_POWERBANK",
    commission: 8,
    platforms: ["xiaohongshu", "weibo"],
    tags: ["充电宝", "便携", "数码"]
  },
  {
    id: "jd-03",
    name: "小佩智能喂食器PRO",
    category: "宠物",
    // TODO: 替换为真实京东推广链接
    link: "https://union-click.jd.com/link?k=YOUR_JD_PID&f=XIAOPEI_FEEDER",
    commission: 6,
    platforms: ["xiaohongshu", "zhihu", "wechat"],
    tags: ["喂食器", "宠物", "智能"]
  }
]

// ==================== 拼多多商品链接 ====================
// 格式：https://mob.huoshan.com/item/?id={商品ID}&pid={PID}
export const PDD_PRODUCTS = [
  {
    id: "pdd-01",
    name: "小佩智能宠物喂食器PRO",
    category: "宠物",
    // TODO: 替换为真实拼多多推广链接
    link: `https://mob.huoshan.com/item/?id=PDD_GOODS_ID_01&pid=${UNION_PIDS.pdd}`,
    commission: 10,
    platforms: ["xiaohongshu", "wechat", "pinduoduo"],
    tags: ["喂食器", "宠物", "智能"]
  },
  {
    id: "pdd-02",
    name: "TWS降噪蓝牙耳机",
    category: "3C数码",
    // TODO: 替换为真实拼多多推广链接
    link: `https://mob.huoshan.com/item/?id=PDD_GOODS_ID_02&pid=${UNION_PIDS.pdd}`,
    commission: 12,
    platforms: ["xiaohongshu", "zhihu", "pinduoduo"],
    tags: ["耳机", "蓝牙", "数码"]
  },
  {
    id: "pdd-03",
    name: "车载手机支架",
    category: "汽车",
    // TODO: 替换为真实拼多多推广链接
    link: `https://mob.huoshan.com/item/?id=PDD_GOODS_ID_03&pid=${UNION_PIDS.pdd}`,
    commission: 8,
    platforms: ["xiaohongshu", "weibo", "pinduoduo"],
    tags: ["车载", "手机架", "汽车"]
  },
  {
    id: "pdd-04",
    name: "桌面收纳盒套装",
    category: "家居",
    // TODO: 替换为真实拼多多推广链接
    link: `https://mob.huoshan.com/item/?id=PDD_GOODS_ID_04&pid=${UNION_PIDS.pdd}`,
    commission: 15,
    platforms: ["xiaohongshu", "wechat", "pinduoduo"],
    tags: ["收纳", "桌面", "整理"]
  },
  {
    id: "pdd-05",
    name: "快充数据线三件套",
    category: "3C数码",
    // TODO: 替换为真实拼多多推广链接
    link: `https://mob.huoshan.com/item/?id=PDD_GOODS_ID_05&pid=${UNION_PIDS.pdd}`,
    commission: 10,
    platforms: ["xiaohongshu", "weibo", "pinduoduo"],
    tags: ["数据线", "充电", "便携"]
  }
]

// ==================== 使用说明 ====================
/*
【替换真实链接步骤】

1. 京东联盟
   - 登录 https://union.jd.com/
   - 进入「我的推广」→「商品推广」
   - 搜索商品，复制推广链接
   - 替换 JD_PRODUCTS 中的 link 字段

2. 淘宝联盟
   - 登录 https://pub.alimama.com/
   - 进入「推广位管理」→「我要推广」
   - 选择商品，生成淘口令或短链
   - 替换相关商品的 link 字段

3. 拼多多多多进宝
   - 登录 https://kpp-duo.pinduoduo.com/
   - 进入「商品推广」→「多多客广场」
   - 搜索商品，复制推广链接
   - 替换 PDD_PRODUCTS 中的 link 字段

4. 抖音电商
   - 登录抖音创作者服务中心
   - 进入「选品广场」→「推广带货」
   - 选择商品，生成分享链接
   - 替换 douyin 相关商品的 link 字段

5. 亚马逊联盟
   - 登录 https://affiliate-program.amazon.com/
   - 进入「Product Advertising API」
   - 生成 tagging 链接（tag=YOUR-TAG-20）
   - 替换 amazon 相关商品的 link 字段

【链接格式说明】
- 京东：https://union-click.jd.com/link?k={PID}&f={商品标识}
- 淘宝：https://s.click.taobao.com/t?m={链接ID}
- 拼多多：https://mob.huoshan.com/item/?id={商品ID}&pid={PID}
- 抖音：https://www.douyin.com/note/{商品ID}?user_id={账号}
- 亚马逊：https://www.amazon.com/dp/{ASIN}?tag={TAG}-20
*/
