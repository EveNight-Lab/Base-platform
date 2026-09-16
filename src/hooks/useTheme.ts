/**
 * @domain 레이아웃 & UI
 * @feature 테마 전환
 * @phase 연산 (Compute)
 * @target 테마 상태 반전 및 영속화
 * @desc light ↔ dark 상태값 반전 및 localStorage 저장
 * @store localStorage (write: theme, read: theme)
 * @next src/index.css
 */
import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme | null
      if (saved) return saved
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme, setTheme }
}
