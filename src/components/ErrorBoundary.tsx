/**
 * 错误边界组件 - 捕获React组件树中的JavaScript错误
 */
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            {/* 错误图标 */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* 错误信息 */}
            <h1 className="text-2xl font-bold text-white mb-2">
              哎呀，出了点问题
            </h1>
            <p className="text-slate-400 mb-6">
              页面遇到意外错误，请尝试刷新或返回首页
            </p>

            {/* 错误详情（开发环境显示） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
                <p className="text-red-400 text-sm font-mono">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-slate-400 text-xs cursor-pointer hover:text-slate-300">
                      查看堆栈跟踪
                    </summary>
                    <pre className="text-xs text-slate-500 mt-2 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                刷新页面
              </button>
              
              <Link
                href="/"
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                返回首页
              </Link>
            </div>

            {/* 提示 */}
            <p className="mt-6 text-xs text-slate-500">
              如果问题持续存在，请联系支持团队
            </p>
          </div>
        </div>
      )
    }

  return this.props.children
}
}

// 默认导出
export default ErrorBoundary
