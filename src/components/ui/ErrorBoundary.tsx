/**
 * @domain 시스템 인프라 & UI
 * @feature 전역 예외 처리기 (ErrorBoundary)
 * @phase 판단 (Decision)
 * @target 언핸들드 런타임 오류 감지 및 Fallback UI 렌더링
 * @trigger 하위 컴포넌트 렌더링 중 예외 발생 시 자동 트리거
 * @desc React 트리 내 렌더링 에러를 포착하여 전체 앱 화이트아웃을 방지하고 복구 액션을 제공
 */
import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Global ErrorBoundary Caught]', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    } else {
      window.location.reload()
    }
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
          <div className="max-w-md w-full rounded-2xl border border-rose-500/20 bg-white dark:bg-neutral-900/90 p-6 shadow-xl shadow-rose-500/5">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">오류가 발생했습니다</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  컴포넌트 렌더링 도중 예외가 감지되었습니다.
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-6 rounded-lg bg-neutral-100 dark:bg-neutral-950/80 p-3 font-mono text-xs text-rose-600 dark:text-rose-400 border border-neutral-200 dark:border-neutral-800 break-all overflow-x-auto max-h-32">
                {this.state.error.message || this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                다시 시도
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Home className="h-4 w-4" />
                홈으로
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
