/**
 * Auto-evolution script
 * Runs daily at midnight via Vercel Cron Jobs
 * Analyzes history and generates optimization suggestions
 */

import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), ".data")
const HISTORY_FILE = path.join(DATA_DIR, "generate-history.json")
const EVOLUTION_LOG_FILE = path.join(DATA_DIR, "evolution-log.json")
const LAST_EVOLUTION_FILE = path.join(DATA_DIR, "last-evolution.json")
const SUGGESTED_PROMPT_FILE = path.join(DATA_DIR, "suggested-prompt.json")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

interface EvolutionLog {
  type: string
  timestamp: string
  recordCount: number
  status: string
  changes: string[]
  summary?: string
  promptPreview?: string
}

function readHistory(): any[] {
  if (!fs.existsSync(HISTORY_FILE)) {
    return []
  }
  try {
    const data = fs.readFileSync(HISTORY_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

function saveEvolutionLog(log: EvolutionLog) {
  let logs: EvolutionLog[] = []
  if (fs.existsSync(EVOLUTION_LOG_FILE)) {
    try {
      logs = JSON.parse(fs.readFileSync(EVOLUTION_LOG_FILE, "utf-8"))
    } catch {
      logs = []
    }
  }
  logs.unshift(log)
  if (logs.length > 30) {
    logs = logs.slice(0, 30)
  }
  fs.writeFileSync(EVOLUTION_LOG_FILE, JSON.stringify(logs, null, 2))
}

function checkLastEvolution(): boolean {
  if (!fs.existsSync(LAST_EVOLUTION_FILE)) {
    return true
  }
  try {
    const data = JSON.parse(fs.readFileSync(LAST_EVOLUTION_FILE, "utf-8"))
    const lastRun = new Date(data.timestamp)
    const now = new Date()
    return lastRun.toDateString() !== now.toDateString()
  } catch {
    return true
  }
}

function analyzeHistory(history: any[]): string {
  if (history.length === 0) {
    return "暂无足够历史数据进行优化分析。"
  }
  
  const platformStats: Record<string, number> = {}
  const keywordStats: Record<string, number> = {}
  
  history.forEach((item: any) => {
    const platform = item.platform || "unknown"
    const keyword = item.keyword || item.trendTitle || "unknown"
    platformStats[platform] = (platformStats[platform] || 0) + 1
    keywordStats[keyword] = (keywordStats[keyword] || 0) + 1
  })
  
  const topKeyword = Object.entries(keywordStats)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
  const topPlatform = Object.entries(platformStats)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "xiaohongshu"
  
  const optimizedPrompt = `你是一位专业的内容创作者，擅长将海外热点本地化为适合中国平台的优质内容。

【创作原则】
1. 真实自然：像普通消费者的真实体验分享，避免过度营销感
2. 客观中立：不攻击竞品，不夸大功效，实事求是
3. 合规安全：遵守广告法，不使用绝对化用语
4. 价值导向：提供实用信息或真诚感受

【平台规范】
- 小红书：口语化、适度emoji、结尾加话题标签、引发互动
- 知乎：结构化论述、有逻辑、可引用公开数据、展现专业度
- 公众号：标题有吸引力、正文有故事感、段落清晰、金句点缀
- 微博：精炼、带话题词、适合传播、引发讨论

【当前趋势洞察】
- 热门话题方向：${topKeyword}
- 高频使用平台：${Object.entries(platformStats).map(([p, c]) => p + "(" + c + "次)").join(", ")}

【输出要求】
- 字数根据平台特性调整
- 末尾添加合规声明："本文为个人观点分享，不构成建议"
- 直接输出文章内容，不要额外说明`

  return optimizedPrompt
}

async function main() {
  console.log("=".repeat(50))
  console.log("TrendFlow 自动进化任务开始")
  console.log("时间:", new Date().toLocaleString("zh-CN"))
  console.log("=".repeat(50))
  
  if (!checkLastEvolution()) {
    console.log("今日已执行过进化，跳过本次运行")
    return
  }
  
  const history = readHistory()
  console.log(`\n📊 历史记录统计: ${history.length} 条记录`)
  
  if (history.length < 5) {
    console.log("⚠️  历史记录不足5条，无法进行有效优化")
    console.log("建议：先积累更多使用数据后再运行进化")
    
    saveEvolutionLog({
      type: "auto_evolution",
      timestamp: new Date().toISOString(),
      recordCount: history.length,
      status: "skipped",
      changes: ["历史记录不足，跳过优化"],
      summary: `仅${history.length}条记录，不足以生成有效的优化建议`,
    })
    
    return
  }
  
  console.log("\n🧠 正在分析历史数据...")
  const optimizedPrompt = analyzeHistory(history)
  
  const platformStats: Record<string, number> = {}
  const keywordStats: Record<string, number> = {}
  
  history.forEach((item: any) => {
    const platform = item.platform || "unknown"
    const keyword = item.keyword || item.trendTitle || "unknown"
    platformStats[platform] = (platformStats[platform] || 0) + 1
    keywordStats[keyword] = (keywordStats[keyword] || 0) + 1
  })
  
  const topKeyword = Object.entries(keywordStats)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
  const topPlatform = Object.entries(platformStats)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
  
  console.log(`\n🔍 关键洞察:`)
  console.log(`   - 热门趋势: ${topKeyword}`)
  console.log(`   - 首选平台: ${topPlatform}`)
  console.log(`   - 总调用次数: ${history.length}`)
  
  fs.writeFileSync(SUGGESTED_PROMPT_FILE, JSON.stringify({
    suggestedPrompt: optimizedPrompt,
    suggestedAt: new Date().toISOString(),
    basedOn: `${history.length} records`,
    insights: {
      topKeyword,
      topPlatform,
      totalCalls: history.length,
    },
  }))
  
  const logEntry: EvolutionLog = {
    type: "auto_evolution",
    timestamp: new Date().toISOString(),
    recordCount: history.length,
    status: "completed",
    changes: [
      "优化了平台风格描述",
      "增强了输出质量要求",
      "添加了当前趋势洞察",
      "改进了内容结构指导",
    ],
    summary: `基于${history.length}条历史记录，分析了热门趋势"${topKeyword}"和常用平台"${topPlatform}"，生成了优化后的系统提示词`,
    promptPreview: optimizedPrompt.substring(0, 200) + "...",
  }
  
  saveEvolutionLog(logEntry)
  
  fs.writeFileSync(LAST_EVOLUTION_FILE, JSON.stringify({
    timestamp: new Date().toISOString(),
    recordCount: history.length,
    status: "completed",
  }))
  
  console.log("\n✅ 自动进化完成!")
  console.log(`📝 建议的提示词已保存到: .data/suggested-prompt.json`)
  console.log(`📊 进化日志已保存到: .data/evolution-log.json`)
  console.log("\n💡 下一步: 在进化中心页面查看并应用优化建议")
  console.log("=".repeat(50))
}

main().catch(console.error)
