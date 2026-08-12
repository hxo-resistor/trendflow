/**
 * 桌面端快捷键处理
 * 提升桌面用户的操作效率
 */
'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface HotkeyConfig {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  action: () => void
  description?: string
}

const HOTKEYS: HotkeyConfig[] = [
  {
    key: 'n',
    ctrl: true,
    shift: true,
    action: () => window.location.href = '/daily-tasks',
    description: '新建任务'
  },
  {
    key: 'g',
    action: () => window.location.href = '/radar',
    description: '打开雷达'
  },
  {
    key: 'd',
    action: () => window.location.href = '/dashboard',
    description: '查看数据'
  },
  {
    key: 'r',
    action: () => window.location.reload(),
    description: '刷新页面'
  },
  {
    key: '/',
    action: () => {
      const input = document.querySelector('input') as HTMLInputElement
      input?.focus()
    },
    description: '搜索焦点'
  },
  {
    key: 'Escape',
    action: () => {
      // 关闭弹窗或返回
      const modal = document.querySelector('dialog[open]') as HTMLDialogElement
      if (modal) {
        modal.close()
      }
    },
    description: '关闭弹窗'
  }
]

export function useHotkeys() {
  const router = useRouter()

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, altKey, shiftKey, metaKey } = event

    for (const hotkey of HOTKEYS) {
      if (
        hotkey.key.toLowerCase() === key.toLowerCase() &&
        (!!hotkey.ctrl === ctrlKey || hotkey.ctrl === undefined) &&
        (!!hotkey.alt === altKey || hotkey.alt === undefined) &&
        (!!hotkey.shift === shiftKey || hotkey.shift === undefined) &&
        (!!hotkey.meta === metaKey || hotkey.meta === undefined)
      ) {
        event.preventDefault()
        hotkey.action()
        break
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

/**
 * 快捷键提示组件
 */
export function HotkeyHint({ hotkey }: { hotkey: HotkeyConfig }) {
  const keys: string[] = []
  
  if (hotkey.ctrl) keys.push('Ctrl')
  if (hotkey.alt) keys.push('Alt')
  if (hotkey.shift) keys.push('Shift')
  if (hotkey.meta) keys.push('⌘')
  keys.push(hotkey.key.toUpperCase())

  return (
    <kbd className="inline-flex items-center justify-center px-2 py-1 text-xs font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
      {keys.join('+')}
    </kbd>
  )
}

/**
 * 快捷键帮助面板
 */
export function HotkeyHelp() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => {
          const panel = document.getElementById('hotkey-help-panel')
          panel?.classList.toggle('hidden')
        }}
        className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
        title="快捷键帮助"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>
      
      <div 
        id="hotkey-help-panel"
        className="hidden absolute bottom-12 right-0 w-64 bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl"
      >
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          快捷键
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {HOTKEYS.map((hotkey, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{hotkey.description}</span>
              <HotkeyHint hotkey={hotkey} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
