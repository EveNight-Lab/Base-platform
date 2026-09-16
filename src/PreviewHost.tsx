/**
 * @domain 시스템 인프라
 * @feature 개발용 라이브 컴포넌트 프리뷰어
 * @phase 출력 (Render)
 * @target 단독 컴포넌트 격리 렌더링 샌드박스
 * @desc 인스펙터 보드에서 iframe으로 컴포넌트 실물을 미리볼 수 있도록 격리 렌더링 및 에러 바운더리 제공
 */
import React, { Component, useEffect, type ReactNode, type ErrorInfo } from 'react'

// Vite eager glob import for all components in src/components/
const componentModules = import.meta.glob<{ [key: string]: any }>('./components/**/*.tsx', {
  eager: true,
})

interface PreviewHostProps {
  componentName?: string
}

interface PreviewErrorState {
  hasError: boolean
  error: Error | null
}

class PreviewErrorBoundary extends Component<{ compName: string; children: ReactNode }, PreviewErrorState> {
  constructor(props: { compName: string; children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): PreviewErrorState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(`[Preview Error] '${this.props.compName}' 렌더링 실패:`, error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-2 text-center text-rose-500 text-[11px] leading-tight">
          <span className="font-bold">⚠️ 프리뷰 렌더링 실패</span>
          <span className="text-[10px] text-neutral-400 mt-1 max-w-[160px] truncate">
            {this.state.error?.message || '필수 Props 누락 또는 런타임 오류'}
          </span>
          <span className="text-[9px] text-indigo-400 mt-1">
            export const _previewProps 설정 권장
          </span>
        </div>
      )
    }
    return this.props.children
  }
}

export const PreviewHost: React.FC<PreviewHostProps> = ({ componentName }) => {
  const params = new URLSearchParams(window.location.search)
  const targetComp = componentName || params.get('preview')
  const theme = params.get('theme')

  useEffect(() => {
    // Theme sync
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  if (!targetComp) {
    return (
      <div className="flex h-screen items-center justify-center p-3 text-xs text-rose-500 font-medium text-center">
        미리볼 컴포넌트가 지정되지 않았습니다.
      </div>
    )
  }

  // Search module matching component name
  let matchedMod: { [key: string]: any } | null = null
  for (const p in componentModules) {
    if (p.includes(`/${targetComp}.tsx`) || p.endsWith(`${targetComp}.tsx`)) {
      matchedMod = componentModules[p]
      break
    }
  }

  if (!matchedMod) {
    return (
      <div className="flex h-screen items-center justify-center p-3 text-xs text-rose-500 font-medium text-center">
        컴포넌트 '{targetComp}'를 찾을 수 없습니다.
      </div>
    )
  }

  const Comp = matchedMod[targetComp] || matchedMod.default || Object.values(matchedMod)[0]

  if (!Comp) {
    return (
      <div className="flex h-screen items-center justify-center p-3 text-xs text-rose-500 font-medium text-center">
        모듈에서 '{targetComp}' 컴포넌트를 추출할 수 없습니다.
      </div>
    )
  }

  // Priority 1: Component's self-declared export const _previewProps
  // Priority 2: Fallback sampleProps map
  const sampleProps: Record<string, any> = {
    TechBadge: {
      name: 'React 19',
      version: 'v19.0',
      description: 'UI 라이브러리',
      icon: <span className="text-cyan-500 font-bold">⚛️</span>,
      badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    },
  }

  const props = (Comp as any)._previewProps || matchedMod._previewProps || sampleProps[targetComp || ''] || {}

  // Intelligent scaling so large cards (like CounterDemo) fit without clipping
  const scaleMap: Record<string, string> = {
    CounterDemo: 'scale-65 sm:scale-70',
    TechBadge: 'scale-90',
    ThemeToggle: 'scale-125',
  }

  const compScale = scaleMap[targetComp || ''] || 'scale-80'

  return (
    <div className="flex h-screen w-screen items-center justify-center p-1 bg-transparent select-none overflow-hidden">
      <div className={`flex items-center justify-center transform origin-center transition-transform ${compScale}`}>
        <PreviewErrorBoundary compName={targetComp}>
          <Comp {...props} />
        </PreviewErrorBoundary>
      </div>
    </div>
  )
}
