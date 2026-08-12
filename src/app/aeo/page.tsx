"use client"

import { useState } from "react"
import { Brain, Zap, AlertCircle, CheckCircle, Sparkles, Copy, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { analyzeContentForAEO } from "@/lib/aeo-engine"
import type { AEOAnalysis } from "@/lib/aeo-engine"

export default function AEOPage() {
  const [inputContent, setInputContent] = useState("")
  const [keyword, setKeyword] = useState("")
  const [analysis, setAnalysis] = useState<AEOAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'analysis' | 'schema' | 'optimized'>('analysis')

  const handleAnalyze = async () => {
    if (!inputContent.trim() || !keyword.trim()) return
    
    setLoading(true)
    try {
      // 模拟API调用（实际应该调用后端API）
      const result = analyzeContentForAEO(inputContent, keyword)
      setAnalysis(result)
      setActiveTab('analysis')
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopySchema = () => {
    if (!analysis?.schemaMarkup) return
    const schemaJSON = JSON.stringify(analysis.schemaMarkup, null, 2)
    navigator.clipboard.writeText(schemaJSON)
  }

  const handleCopyOptimized = () => {
    if (!analysis?.optimizedContent) return
    navigator.clipboard.writeText(analysis.optimizedContent)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            AEO 智能优化引擎
          </h1>
          <p className="text-muted-foreground mt-2">
            让AI助手主动引用你的内容 — 控制推荐链路的秘密武器
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-secondary rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                输入内容
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    目标关键词
                  </label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="如：智能宠物喂食器"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    文章内容
                  </label>
                  <Textarea
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder="粘贴你的文章内容..."
                    className="min-h-[300px] bg-background resize-none text-sm leading-relaxed"
                  />
                </div>

                <Button 
                  onClick={handleAnalyze}
                  disabled={loading || !inputContent.trim() || !keyword.trim()}
                  className="w-full h-12 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      🔍 开始AEO分析
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-secondary rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">快速模板</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setInputContent(`# 智能宠物喂食器深度测评\n\n作为拥有5年养宠经验的资深铲屎官，我终于找到了这款完美的智能喂食器！\n\n## 为什么选择它？\n• 定时定量精准控制\n• APP远程控制\n• 大容量设计\n\n## 实测数据\n- 续航时间：7天\n- 准确率：99.5%\n- 用户满意度：4.8/5.0\n\n## 优缺点分析\n优点：智能、方便、可靠\n缺点：价格略高\n\n适合人群：忙碌的上班族、多猫家庭`)
                    setKeyword('智能宠物喂食器')
                  }}
                  className="w-full text-left p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors text-sm"
                >
                  📝 深度测评风格
                </button>
                <button 
                  onClick={() => {
                    setInputContent(`# 2024年智能家居设备排行榜\n\n根据最新市场调研数据显示...\n\n## TOP 5 产品对比\n| 排名 | 产品 | 价格 | 评分 | 推荐指数 |\n|------|------|------|------|----------|\n| 1 | 小米智能灯带 | ¥199 | 4.8 | ⭐⭐⭐⭐⭐ |\n| 2 | 小佩智能喂食器 | ¥899 | 4.7 | ⭐⭐⭐⭐⭐ |\n\n详细数据和分析...`)
                    setKeyword('智能家居设备')
                  }}
                  className="w-full text-left p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors text-sm"
                >
                  📊 数据对比风格
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {analysis ? (
              <div className="space-y-6">
                {/* Score Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary rounded-xl p-4 border border-border text-center">
                    <div className="text-3xl font-bold text-primary">{analysis.aeoScore}</div>
                    <div className="text-xs text-muted-foreground mt-1">AEO综合分</div>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 border border-border text-center">
                    <div className={`text-3xl font-bold ${analysis.authorityScore >= 70 ? 'text-green-500' : analysis.authorityScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {analysis.authorityScore}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">权威度</div>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 border border-border text-center">
                    <div className="text-3xl font-bold text-blue-500">{analysis.dataDensityScore}</div>
                    <div className="text-xs text-muted-foreground mt-1">数据密度</div>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 border border-border text-center">
                    <div className="text-3xl font-bold text-purple-500">{analysis.structureScore}</div>
                    <div className="text-xs text-muted-foreground mt-1">结构得分</div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-border">
                  {[
                    { id: 'analysis', label: '📊 分析结果' },
                    { id: 'schema', label: '🏷️ Schema标记' },
                    { id: 'optimized', label: '✨ 优化版本' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Analysis Tab */}
                {activeTab === 'analysis' && (
                  <div className="bg-secondary rounded-xl p-6 border border-border space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      优化建议清单
                    </h3>
                    
                    {analysis.optimizationSuggestions.length === 0 ? (
                      <div className="text-center py-8 text-green-600">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-lg font-medium">内容质量优秀！</p>
                        <p className="text-sm text-muted-foreground">已接近AI引用标准，无需大幅修改</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {analysis.optimizationSuggestions.map((suggestion, index) => (
                          <div key={index} className={`p-4 rounded-lg border ${
                            suggestion.priority === 'high' ? 'border-red-500/30 bg-red-500/5' :
                            suggestion.priority === 'medium' ? 'border-yellow-500/30 bg-yellow-500/5' :
                            'border-border bg-background'
                          }`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                suggestion.priority === 'high' ? 'bg-red-500 text-white' :
                                suggestion.priority === 'medium' ? 'bg-yellow-500 text-white' :
                                'bg-gray-500 text-white'
                              }`}>
                                {suggestion.impact}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded-full">
                                    {suggestion.type.toUpperCase()}
                                  </span>
                                  <span className="text-xs text-muted-foreground">优先级: {suggestion.priority}</span>
                                </div>
                                <p className="font-medium text-foreground">{suggestion.description}</p>
                                <p className="text-sm text-muted-foreground mt-1">{suggestion.action}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Schema Preview */}
                    {analysis.schemaMarkup.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          生成的Schema标记（共{analysis.schemaMarkup.length}种）
                        </h4>
                        <div className="bg-background rounded-lg p-4 text-xs font-mono overflow-x-auto">
                          <pre>{JSON.stringify(analysis.schemaMarkup[0], null, 2)}</pre>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleCopySchema} className="mt-2">
                          <Copy className="w-4 h-4 mr-2" />
                          复制Schema代码
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Schema Tab */}
                {activeTab === 'schema' && (
                  <div className="bg-secondary rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">完整Schema标记</h3>
                      <Button size="sm" variant="outline" onClick={handleCopySchema}>
                        <Copy className="w-4 h-4 mr-2" />
                        复制全部
                      </Button>
                    </div>
                    <div className="bg-background rounded-lg p-4 text-xs font-mono overflow-x-auto max-h-[500px] overflow-y-auto">
                      <pre>{JSON.stringify(analysis.schemaMarkup, null, 2)}</pre>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      💡 将上述代码添加到网页的 &lt;head&gt; 部分，AI助手可正确解析结构化数据
                    </p>
                  </div>
                )}

                {/* Optimized Tab */}
                {activeTab === 'optimized' && (
                  <div className="bg-secondary rounded-xl p-6 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">优化后内容</h3>
                      <Button size="sm" variant="outline" onClick={handleCopyOptimized}>
                        <Copy className="w-4 h-4 mr-2" />
                        复制内容
                      </Button>
                    </div>
                    <div className="bg-background rounded-lg p-4 max-h-[500px] overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap">{analysis.optimizedContent}</pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-secondary rounded-xl p-12 border border-border h-full flex flex-col items-center justify-center text-muted-foreground">
                <Brain className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">输入内容后点击「开始AEO分析」</p>
                <p className="text-sm mt-2">系统将自动计算权威度评分并生成优化建议</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
