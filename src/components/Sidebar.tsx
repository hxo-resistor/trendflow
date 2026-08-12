"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Globe, PenTool, BarChart3, Clock, Brain, Crosshair, Command, LayoutGrid, ShoppingCart, Send, Zap, Sparkles, TrendingUp, Factory, Shield, Cpu, MessageSquare, Play } from "lucide-react"

const navItems = [
  { href: "/daily-tasks", label: "每日任务", icon: Play, highlight: true },
  { href: "/radar", label: "趋势雷达", icon: TrendingUp },
  { href: "/geo-dashboard", label: "GEO优化", icon: Cpu },
  { href: "/factory", label: "内容工厂", icon: Factory },
  { href: "/interceptor", label: "自动截流", icon: Zap },
  { href: "/smart-reply", label: "智能回复", icon: MessageSquare },
  { href: "/auto-publish", label: "自动发布", icon: Send },
  { href: "/trust-transfer", label: "信任转移", icon: Shield },
  { href: "/aeo", label: "AEO引擎", icon: Sparkles },
  { href: "/nexus", label: "神经中枢", icon: Zap },
  { href: "/discover", label: "热点发现", icon: Globe },
  { href: "/generate", label: "内容生成", icon: PenTool },
  { href: "/affiliate", label: "商品库", icon: ShoppingCart },
  { href: "/publish", label: "发布管理", icon: Send },
  { href: "/intel", label: "竞争情报", icon: Crosshair },
  { href: "/command", label: "指挥中心", icon: Command },
  { href: "/templates", label: "模板库", icon: LayoutGrid },
  { href: "/dashboard", label: "收益仪表盘", icon: BarChart3 },
  { href: "/evolve", label: "自我进化", icon: Brain },
  { href: "/scheduler", label: "定时任务", icon: Clock },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-secondary border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">TrendFlow</h1>
            <p className="text-xs text-muted-foreground">内容统治引擎</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          v2.0 • 分布式自动化
        </div>
      </div>
    </aside>
  )
}
