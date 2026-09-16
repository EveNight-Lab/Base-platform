import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('단일 클래스명을 정상 반환해야 한다', () => {
    expect(cn('btn-primary')).toBe('btn-primary')
  })

  it('조건부 클래스 및 Falsy 값을 필터링해야 한다', () => {
    const isHidden = false
    expect(cn('btn', isHidden && 'hidden', null, undefined, 'active')).toBe('btn active')
  })

  it('Tailwind 클래스 충돌 시 후순위 클래스를 우선 적용해야 한다', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})
