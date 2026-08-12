"use client"

import { useState } from "react"
import { Crosshair, Loader2, Copy, Check, TrendingUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnalysisResult {
  competitor: string
  contentThemes: string[]
  highFrequencyKeywords: string[]
  estimatedStrategy: string
  weaknesses: string[]
}

interface SurroundContent {
  type: string
  title: string
  body: string
  angle: string
  targetKeyword: string
}

interface DistributePlan {
  platform: string
  keyword: string
  priority: number
  reason: string
}

export default function IntelPage() {
  const [competitor, setCompetitor] = useState("")
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [contents, setContents] = useState<SurroundContent[]>([])
  const [distributePlan, setDistributePlan] = useState<DistributePlan[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [error, setError] = useState<string>("")

  const handleAnalyze = async () => {
    if (!competitor.trim()) {
      setError("请输入竞品名称")
      return
    }

    setLoading(true)
    setError("")
    setAnalysis(null)
    setContents([])
    setDistributePlan([])

    try {
      // Analyze competitor
      const analyzeRes = await fetch("/api/intel/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitor }),
      })
      const analyzeData = await analyzeRes.json()

      if (analyzeData.success) {
        setAnalysis(analyzeData)

        // Generate surrounding content
        const surroundRes = await fetch("/api/intel/surround", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ competitor }),
        })
        const surroundData = await surroundRes.json()

        if (surroundData.success) {
          setContents(surroundData.contents || [])
        }

        // Get distribution plan
        const distributeRes = await fetch("/api/intel/distribute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ competitor }),
        })
        const distributeData = await distributeRes.json()

        if (distributeData.success) {
          setDistributePlan(distributeData.plan || [])
        }
      } else {
        setError(analyzeData.error || "分析失败")
      }
    } catch (err) {
      setError("网络错误，请重试")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Crosshair className="w-8 h-8 text-primary" />
            竞争情报与自动包围
          </h1>
          <p className="text-muted-foreground mt-2">
            分析竞品内容策略，自动生成包围式优质内容
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-secondary rounded-xl p-6 border border-border mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
              placeholder="输入竞品名称（如：AI宠物喂食器）"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <Button 
              onClick={handleAnalyze}
              disabled={loading || !competitor.trim()}
              className="px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Crosshair className="w-4 h-4 mr-2" />
                  一键分析
                </>
              )}
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Competitor Analysis */}
            <div className="bg-secondary rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                竞品分析：{analysis.competitor}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">内容主题</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.contentThemes.map((theme, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">高频关键词</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.highFrequencyKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-accent text-accent-foreground rounded text-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">预估策略</h4>
                <p className="text-sm text-foreground bg-background p-3 rounded">{analysis.estimatedStrategy}</p>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">可超越方向</h4>
                <ul className="space-y-1">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Surround Content */}
            {contents.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-4">包围内容（{contents.length}篇）</h3>
                <div className="space-y-4">
                  {contents.map((item, index) => (
                    <div key={index} className="bg-secondary rounded-xl p-4 border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{item.title}</h4>
                          <span className="text-xs text-muted-foreground">{item.angle}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(index, item.body)}
                        >
                          {copiedIndex === index ? (
                            <><Check className="w-4 h-4 mr-1" />已复制</>
                          ) : (
                            <><Copy className="w-4 h-4 mr-1" />复制</>
                          )}
                        </Button>
                      </div>
                      <pre className="text-sm text-foreground bg-background p-3 rounded whitespace-pre-wrap font-normal">
                        {item.body}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Distribution Plan */}
            {distributePlan.length > 0 && (
              <div className="bg-secondary rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">分发策略</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-muted-foreground">优先级</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">平台</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">目标关键词</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">建议理由</th>
                      </tr>
                    </thead>
                    <tbody>
                      {distributePlan.map((plan, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                              plan.priority === 1 ? 'bg-primary text-primary-foreground' :
                              plan.priority === 2 ? 'bg-yellow-500 text-white' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {plan.priority}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-foreground">{plan.platform}</td>
                          <td className="py-3 px-3 text-muted-foreground">{plan.keyword}</td>
                          <td className="py-3 px-3 text-muted-foreground">{plan.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !analysis && (
          <div className="text-center py-20 text-muted-foreground">
            <Crosshair className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>输入竞品名称，开始竞争情报分析</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">正在分析竞品并生成包围内容...</p>
          </div>
        )}
      </div>
    </div>
  )
}
