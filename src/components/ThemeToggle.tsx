/**
 * @domain 레이아웃 & UI
 * @feature 테마 전환
 * @phase 입력 (Trigger)
 * @target Sun/Moon 토글 버튼
 * @trigger 클릭
 * @desc 클릭 시 toggleTheme() 호출하여 테마 반전 트리거
 * @next src/hooks/useTheme.ts
 */
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme.ts'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-neutral-600" />
      )}
    </button>
  )
}
