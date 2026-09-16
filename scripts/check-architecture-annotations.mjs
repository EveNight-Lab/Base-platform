/**
 * @domain 시스템 인프라
 * @feature 아키텍처 린트 자동 검증기
 * @phase 판단 (Decision)
 * @target 소스 파일 필수 아키텍처 JSDoc 메타데이터 검증 스크립트
 * @desc src/ 내 모든 소스 파일에 @domain, @feature, @phase 주석이 누락되지 않았는지 기계적으로 검사
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SRC_DIR = path.resolve(__dirname, '../src')

const EXCLUDE_FILES = new Set(['vite-env.d.ts'])

function getSourceFiles(dir) {
  const files = []
  if (!fs.existsSync(dir)) return files

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        files.push(...getSourceFiles(full))
      }
    } else if (/\.(tsx?|jsx?|css)$/.test(entry.name)) {
      if (!EXCLUDE_FILES.has(entry.name) && !/\.(test|spec)\.[^.]+$/.test(entry.name)) {
        files.push(full)
      }
    }
  }
  return files
}

function checkAnnotations() {
  const files = getSourceFiles(SRC_DIR)
  const errors = []

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const relPath = path.relative(path.resolve(__dirname, '..'), filePath).replace(/\\/g, '/')

    // Extract top block comment
    const docMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
    const docText = docMatch ? docMatch[1] : ''

    const missing = []

    // Check @domain or @module
    const hasDomain = /@(domain|module)\s+[^\r\n*]+/.test(docText)
    if (!hasDomain) missing.push('@domain (또는 @module)')

    // Check @feature
    const hasFeature = /@feature\s+[^\r\n*]+/.test(docText)
    if (!hasFeature) missing.push('@feature')

    // Check @phase
    const hasPhase = /@phase\s+[^\r\n*]+/.test(docText)
    if (!hasPhase) missing.push('@phase (입력|판단|연산|API|저장소|출력)')

    if (missing.length > 0) {
      errors.push({ file: relPath, missing })
    }
  }

  if (errors.length > 0) {
    console.error('\n❌ [Architecture Lint Error] 필수 아키텍처 주석이 누락된 파일이 발견되었습니다:\n')
    for (const err of errors) {
      console.error(`  📄 ${err.file}`)
      for (const m of err.missing) {
        console.error(`     └─ 누락: ${m}`)
      }
    }
    console.error('\n💡 AGENTS.md의 6단계 노드 파이프라인 표준 주석을 파일 상단에 추가해 주세요.\n')
    process.exit(1)
  } else {
    console.log(`\n✓ [Arch Lint] 총 ${files.length}개 파일의 아키텍처 메타데이터(@domain, @feature, @phase) 검증 통과!\n`)
    process.exit(0)
  }
}

checkAnnotations()
