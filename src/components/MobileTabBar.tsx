/**
 * TrendFlow Mobile Tab Bar Component
 * 移动端底部导航栏 - 2分钟操作，3次点击
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, Radio, Settings } from 'lucide-react'

const TABS = [
  { href: '/daily-tasks', label: '任务', icon: Home },
  { href: '/dashboard', label: '数据', icon: BarChart3 },
  { href: '/radar', label: '雷达', icon: Radio },
  { href: '/settings', label: '设置', icon: Settings },
]

export default function MobileTabBar() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 只在移动端显示
    const checkMobile = () => {
      setIsVisible(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isVisible) return null

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab.href)
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                active 
                  ? 'text-blue-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon 
                className={`w-6 h-6 mb-1 ${active ? 'fill-current' : ''}`} 
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="text-xs font-medium">{tab.label}</span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-400 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
