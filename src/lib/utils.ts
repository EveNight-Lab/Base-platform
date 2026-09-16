/**
 * @domain 공통 인프라
 * @feature 공통 유틸리티
 * @phase 연산 (Compute)
 * @target cn() 클래스네임 조합 유틸리티
 * @desc clsx + tailwind-merge 클래스 충돌 해결 및 병합
 */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
