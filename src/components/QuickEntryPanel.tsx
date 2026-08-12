/**
 * 快速数据录入面板
 * 每日任务底部快速录入
 */

'use client'

import { useState } from 'react'
import { Plus, CheckCircle, X } from 'lucide-react'

interface QuickEntryData {
  source: string
  type: string
  quantity: string
  product: string
}

const SOURCES = ['微博', '知乎', '小红书', '抖音', '百度', '微信']
const TYPES = ['点击', '收益', '浏览', '转化', '分享']
const PRODUCTS = [
  '降噪蓝牙耳机',
  '智能宠物喂食器',
  '车载手机支架',
  '空气炸锅',
  '电动牙刷',
  '机械键盘'
]

export default function QuickEntryPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<QuickEntryData>({
    source: '',
    type: '',
    quantity: '',
    product: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!data.source || !data.type || !data.quantity || !data.product) {
      alert('请填写所有字段')
      return
    }

    try {
      const response = await fetch('/api/data/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setIsOpen(false)
          setData({ source: '', type: '', quantity: '', product: '' })
        }, 1500)
      }
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  return (
    <>
      {/* 快速录入按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-40"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* 弹窗面板 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
          <div className="bg-slate-900 w-full max-w-md rounded-t-2xl md:rounded-2xl p-6 border-t md:border border-slate-800 animate-slide-up">
            {/* 标题 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                快速录入
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 表单 */}
            <div className="space-y-4">
              {/* 来源 */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">来源</label>
                <select
                  value={data.source}
                  onChange={e => setData({ ...data, source: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">选择来源</option>
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* 类型 */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">类型</label>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setData({ ...data, type })}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        data.type === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 数量 */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">数量</label>
                <input
                  type="number"
                  value={data.quantity}
                  onChange={e => setData({ ...data, quantity: e.target.value })}
                  placeholder="输入数量"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 产品 */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">产品</label>
                <select
                  value={data.product}
                  onChange={e => setData({ ...data, product: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">选择产品</option>
                  {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  已提交
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  提交记录
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
