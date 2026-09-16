/**
 * @domain 시스템 인프라
 * @feature 애플리케이션 엔트리포인트
 * @phase 입력 (Trigger)
 * @target React DOM 루트 마운터
 * @trigger 페이지 마운트
 * @desc 브라우저 로드 시 URL 쿼리를 감지하여 메인 App 또는 PreviewHost 마운트
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PreviewHost } from './PreviewHost.tsx'

const isPreviewMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('preview')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPreviewMode ? <PreviewHost /> : <App />}
  </StrictMode>,
)

