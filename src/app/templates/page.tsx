"use client"

import { useState } from "react"
import { LayoutGrid, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Template {
  id: string
  name: string
  category: string
  platform: string
  description: string
  example: string
}

const TEMPLATES: Template[] = [
  // 小红书模板
  { id: "xhs-001", name: "爆款种草模板", category: "种草", platform: "小红书", description: "高互动率的种草文案模板", example: "姐妹们！这个真的太绝了..." },
  { id: "xhs-002", name: "测评分享模板", category: "测评", platform: "小红书", description: "客观真实的测评分享风格", example: "用了两周，说说真实感受..." },
  { id: "xhs-003", name: "避坑指南模板", category: "避坑", platform: "小红书", description: "帮助用户避雷的实用内容", example: "千万别买！除非你看完这篇..." },
  { id: "xhs-004", name: "对比横评模板", category: "对比", platform: "小红书", description: "多款产品的对比分析模板", example: "A vs B vs C，哪个值得买？" },
  { id: "xhs-005", name: "攻略合集模板", category: "攻略", platform: "小红书", description: "系统性的选购攻略模板", example: "新手必看！一篇文章讲清楚..." },
  
  // 知乎模板
  { id: "zh-001", name: "专业分析模板", category: "分析", platform: "知乎", description: "理性客观的深度分析风格", example: "谢邀。从行业角度看..." },
  { id: "zh-002", name: "经验分享模板", category: "经验", platform: "知乎", description: "基于真实经验的分享模板", example: "从业5年，我来说几句..." },
  { id: "zh-003", name: "科普教育模板", category: "科普", platform: "知乎", description: "知识普及型内容模板", example: "什么是XXX？一文读懂..." },
  { id: "zh-004", name: "争议讨论模板", category: "讨论", platform: "知乎", description: "引发讨论的争议性话题模板", example: "XXX到底值不值得买？" },
  { id: "zh-005", name: "数据报告模板", category: "报告", platform: "知乎", description: "基于数据的分析报告模板", example: "我们收集了1000份样本..." },
  
  // 微博模板
  { id: "wb-001", name: "热点蹭流模板", category: "热点", platform: "微博", description: "快速蹭热点的短文案模板", example: "刚刚！XX事件引发热议..." },
  { id: "wb-002", name: "话题互动模板", category: "互动", platform: "微博", description: "引发评论互动的提问模板", example: "你们觉得呢？评论区聊聊..." },
  { id: "wb-003", name: "快讯播报模板", category: "快讯", platform: "微博", description: "快速新闻播报模板", example: "刚刚曝出！XX品牌新品..." },
  { id: "wb-004", name: "观点输出模板", category: "观点", platform: "微博", description: "鲜明观点表达模板", example: "说句得罪人的话..." },
  { id: "wb-005", name: "福利抽奖模板", category: "福利", platform: "微博", description: "活动福利类内容模板", example: "关注+转发，抽3位送..." },
  
  // 抖音模板
  { id: "dy-001", name: "口播脚本模板", category: "口播", platform: "抖音", description: "60秒口播脚本模板", example: "[开场3秒] 注意了！..." },
  { id: "dy-002", name: "剧情植入模板", category: "剧情", platform: "抖音", description: "软植入的剧情脚本模板", example: "[场景] 今天去超市..." },
  { id: "dy-003", name: "对比演示模板", category: "演示", platform: "抖音", description: "产品对比演示脚本模板", example: "[左边] 普通方法...\n[右边] 新方法..." },
  { id: "dy-004", name: "干货教学模板", category: "教学", platform: "抖音", description: "技能教学类脚本模板", example: "今天教大家一个绝招..." },
  { id: "dy-005", name: "测评开箱模板", category: "开箱", platform: "抖音", description: "开箱测评类脚本模板", example: "开箱时间到！..." },
  
  // 公众号模板
  { id: "wx-001", name: "深度故事模板", category: "故事", platform: "公众号", description: "故事化深度文章模板", example: "那是一个普通的下午..." },
  { id: "wx-002", name: "专业解读模板", category: "解读", platform: "公众号", description: "行业专业解读模板", example: "一文读懂XXX背后的逻辑..." },
  { id: "wx-003", name: "案例复盘模板", category: "案例", platform: "公众号", description: "成功案例复盘模板", example: "某品牌是如何做到的..." },
  { id: "wx-004", name: "观点评论模板", category: "评论", platform: "公众号", description: "时评观点类模板", example: "最近看到一个现象..." },
  { id: "wx-005", name: "清单汇总模板", category: "清单", platform: "公众号", description: "清单汇总类模板", example: "这10个XXX你一定要知道..." },
]

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTemplates = TEMPLATES.filter(t => {
    return !searchTerm || 
      t.name.includes(searchTerm) || 
      t.description.includes(searchTerm) ||
      t.category.includes(searchTerm)
  })

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-primary" />
            内容模板库
          </h1>
          <p className="text-muted-foreground mt-2">
            {TEMPLATES.length}种基础模板 × 多种变体组合
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索模板..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-secondary rounded-xl p-4 border border-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{template.platform}</span>
                <span className="text-xs text-muted-foreground">{template.category}</span>
              </div>
              <h3 className="font-medium text-foreground mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <div className="bg-background p-2 rounded text-xs text-foreground font-mono">
                {template.example}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 p-6 bg-secondary rounded-xl border border-border">
          <h3 className="font-semibold text-foreground mb-4">模板统计</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{TEMPLATES.length}</div>
              <div className="text-sm text-muted-foreground">基础模板</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">5</div>
              <div className="text-sm text-muted-foreground">平台类型</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">5</div>
              <div className="text-sm text-muted-foreground">内容角度</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{TEMPLATES.length * 5}</div>
              <div className="text-sm text-muted-foreground">内容变体</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
