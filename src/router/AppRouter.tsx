/**
 * @domain 시스템 인프라 & 라우팅
 * @feature 라우터 셸
 * @phase 입력 (Trigger)
 * @target 브라우저 URL 경로 감지기
 * @trigger 브라우저 주소 변경 및 탐색 이벤트
 * @desc BrowserRouter 기반 최상위 URL 라우팅 및 페이지 전환 제어
 * @next src/pages/HomePage.tsx, src/pages/NotFoundPage.tsx
 */
import { BrowserRouter, Routes, Route } from 'react-router'
import { HomePage } from '@/pages/HomePage.tsx'
import { NotFoundPage } from '@/pages/NotFoundPage.tsx'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
