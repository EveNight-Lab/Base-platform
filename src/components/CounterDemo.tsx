/**
 * @domain 인터랙션 데모
 * @feature 카운터 인터랙션
 * @phase 입력 (Trigger)
 * @target 증감 & 초기화 버튼
 * @trigger 클릭
 * @desc 클릭 시 count 상태 변경 및 화면 재렌더링
 */
import { useState } from 'react'
import { Plus, Minus, RotateCcw, Sparkles } from 'lucide-react'

export function CounterDemo() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
          <Sparkles className="h-4 w-4" />
          인터랙션 테스트
        </div>
        <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          상태 관리 카운터 데모
        </h4>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          React useState 훅 및 Tailwind 호버/클릭 인터랙션이 정상 작동하는지 테스트합니다.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 rounded-xl bg-neutral-100 p-4 dark:bg-neutral-800/60">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="w-16 text-center text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
          {count}
        </span>

        <button
          onClick={() => setCount((c) => c + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          aria-label="Increase"
        >
          <Plus className="h-4 w-4" />
        </button>

        <button
          onClick={() => setCount(0)}
          className="ml-2 flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-500 shadow-sm transition hover:bg-neutral-50 hover:text-neutral-700 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          aria-label="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
