/**
 * @domain 레이아웃 & UI
 * @feature 기술 스택 쇼케이스
 * @phase 출력 (Render)
 * @target 기술 스택 카드 UI
 * @desc React, Vite, TS 등 아이콘과 버전 뱃지 렌더링
 */
import React from 'react'
import { cn } from '@/lib/utils'

interface TechBadgeProps {
  icon: React.ReactNode
  name: string
  version: string
  description: string
  badgeColor?: string
}

export const TechBadge: React.FC<TechBadgeProps> & { _previewProps?: TechBadgeProps } = ({
  icon,
  name,
  version,
  description,
  badgeColor = 'text-blue-500 bg-blue-500/10 border-blue-500/20',
}) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
            {icon}
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {name}
            </h3>
            <span
              className={cn(
                'inline-block rounded-full border px-2 py-0.5 text-xs font-medium',
                badgeColor
              )}
            >
              {version}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  )
}

// 인스펙터 실시간 프리뷰를 위한 컴포넌트 기본 Mock Props (Zero-config)
TechBadge._previewProps = {
  name: 'React 19',
  version: 'v19.0',
  description: 'UI 컴포넌트 렌더링 및 상태 관리',
  icon: <span className="text-cyan-500 font-bold">⚛️</span>,
  badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
}
