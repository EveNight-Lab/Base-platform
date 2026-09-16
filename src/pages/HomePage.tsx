/**
 * @domain 레이아웃 & UI
 * @feature 홈 대시보드 페이지
 * @phase 출력 (Render)
 * @target 메인 쇼케이스 대시보드 뷰
 * @trigger 루트 경로 ('/') 라우트 진입
 * @desc 플랫폼 기본 기술 스택, 인터랙션 데모(카운터, 토스트, 테마) 통합 쇼케이스 페이지
 */
import {
  Atom,
  Zap,
  FileCode2,
  Palette,
  Sparkles,
  Layers,
  FolderTree,
  Terminal,
  Compass,
  Bell,
  Bug,
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router'
import { TechBadge } from '@/components/TechBadge.tsx'
import { ThemeToggle } from '@/components/ThemeToggle.tsx'
import { CounterDemo } from '@/components/CounterDemo.tsx'

export function HomePage() {
  const techStack = [
    {
      icon: <Atom className="h-5 w-5 text-cyan-500" />,
      name: 'React',
      version: 'v19',
      description: '최신 React 19 버전의 고성능 UI 컴포넌트 렌더링 및 상태 관리',
      badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      name: 'Vite',
      version: 'v8',
      description: '초고속 HMR(Hot Module Replacement)과 최적화된 번들러 환경',
      badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: <FileCode2 className="h-5 w-5 text-blue-500" />,
      name: 'TypeScript',
      version: 'v6',
      description: '정적 타입 체크 및 견고하고 유지보수하기 쉬운 코드베이스 보장',
      badgeColor: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: <Palette className="h-5 w-5 text-teal-500" />,
      name: 'Tailwind CSS',
      version: 'v4',
      description: '별도 복잡한 config 없이 @tailwindcss/vite로 초고속 빌드 및 스타일링',
      badgeColor: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20',
    },
    {
      icon: <Compass className="h-5 w-5 text-orange-500" />,
      name: 'React Router',
      version: 'v7',
      description: '직관적인 페이지 라우팅 및 중첩 레이아웃 SPA 아키텍처 지원',
      badgeColor: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20',
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      name: 'Lucide & Sonner',
      version: 'Latest',
      description: '경량 벡터 아이콘 및 세련된 글로벌 토스트 알림 시스템',
      badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: <Layers className="h-5 w-5 text-rose-500" />,
      name: 'Path Alias (@)',
      version: 'Configured',
      description: '@/lib/utils, @/components 등 깔끔한 절대 경로 import 지원',
      badgeColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: <Bug className="h-5 w-5 text-emerald-500" />,
      name: 'Vitest Unit Test',
      version: 'Configured',
      description: '판단 및 연산 비즈니스 로직을 즉시 검증하는 초고속 유닛 테스트 러너',
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ]

  const handleTestToast = () => {
    toast.success('토스트 시스템이 정상 작동 중입니다!', {
      description: 'React 19 호환 sonner 토스트가 성공적으로 연동되었습니다.',
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-50">
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-10">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-semibold tracking-wide uppercase text-indigo-600 dark:text-indigo-400">
                Project Template
              </span>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                NEW Base
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestToast}
              className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-colors cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5" />
              토스트 테스트
            </button>

            <Link
              to="/404-test"
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:opacity-80 transition-opacity"
            >
              <Compass className="h-3.5 w-3.5" />
              404 라우트 테스트
            </Link>

            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Ready to Develop
            </div>

            <ThemeToggle />
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-14 text-center sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>차세대 AI 협업을 위한 초고속 스타터 킷</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            준비는 끝났습니다.{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              이제 만들기만 하세요.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
            모든 설정이 완료된 클린 캔버스입니다. 라우팅, 글로벌 예외 격리, 토스트 피드백, 
            유닛 테스트, 그리고 인스펙터 보드가 완벽하게 갖춰져 있습니다.
          </p>
        </section>

        {/* Interactive Demo Section */}
        <section className="mb-14">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight">인터랙션 데모 (State & Storage)</h3>
            <span className="text-xs text-neutral-500">포트 5174 인스펙터 보드와 실시간 연동</span>
          </div>
          <CounterDemo />
        </section>

        {/* Tech Stack Grid */}
        <section className="mb-14">
          <h3 className="mb-6 text-lg font-bold tracking-tight">탑재된 기반 기술</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech) => (
              <TechBadge key={tech.name} {...tech} />
            ))}
          </div>
        </section>

        {/* Development Guide Card */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3">
            <Terminal className="h-5 w-5" />
            <h3 className="font-bold">개발 시작 가이드</h3>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            새 컴포넌트나 라우트 페이지를 만들면 인스펙터 보드(<code className="rounded bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 text-xs text-indigo-500">http://localhost:5174/</code>)에 실시간으로 시각화됩니다.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1.5 border border-neutral-200 dark:border-neutral-700/60">
              <FolderTree className="h-3.5 w-3.5 inline mr-1 text-neutral-500" />
              src/pages/
            </div>
            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1.5 border border-neutral-200 dark:border-neutral-700/60">
              <FolderTree className="h-3.5 w-3.5 inline mr-1 text-neutral-500" />
              src/components/
            </div>
            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1.5 border border-neutral-200 dark:border-neutral-700/60">
              <FolderTree className="h-3.5 w-3.5 inline mr-1 text-neutral-500" />
              src/hooks/
            </div>
            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1.5 border border-neutral-200 dark:border-neutral-700/60">
              <FolderTree className="h-3.5 w-3.5 inline mr-1 text-neutral-500" />
              src/router/
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
