/**
 * @domain 레이아웃 & UI
 * @feature 404 페이지
 * @phase 출력 (Render)
 * @target 잘못된 URL 접속 시 노출되는 Not Found 뷰
 * @trigger 일치하지 않는 모든 URL 라우트 진입 (*)
 * @desc 유효하지 않은 경로 진입 시 사용자에게 404 에러 안내 및 홈으로 안전하게 복귀할 수 있는 액션 제공
 */
import { useNavigate } from 'react-router'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
          <FileQuestion className="h-10 w-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            404 Error
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">페이지를 찾을 수 없습니다</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            요청하신 페이지가 삭제되었거나 잘못된 경로입니다.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            이전 페이지
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  )
}
