import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer-core'
import { createServer } from 'vite'

function findBrowserPath() {
  const isWindows = process.platform === 'win32'
  const isMac = process.platform === 'darwin'
  const isLinux = process.platform === 'linux'

  const candidates = []

  if (isWindows) {
    const localAppData = process.env.LOCALAPPDATA || ''
    const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files'
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)'

    candidates.push(
      path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe')
    )
  } else if (isMac) {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    )
  } else if (isLinux) {
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/microsoft-edge'
    )
  }

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p
    }
  }
  return null
}

async function runHeadlessCheck() {
  console.log('\n🔍 [Headless Check] 백그라운드 브라우저 런타임 점검을 시작합니다...')

  const executablePath = findBrowserPath()
  if (!executablePath) {
    console.warn('⚠️  [Headless Check] 설치된 Chrome 또는 Edge 브라우저를 찾을 수 없어 건너뜁니다.')
    process.exit(0)
  }

  console.log(`🌐 감지된 브라우저: ${path.basename(executablePath)}`)

  // 1. Vite 개발 서버를 임의의 비어있는 포트로 백그라운드 구동
  const server = await createServer({
    server: { port: 0, host: '127.0.0.1' },
    logLevel: 'error',
  })
  await server.listen()
  const port = server.config.server.port
  const targetUrl = `http://127.0.0.1:${port}/`

  let browser
  const errors = []
  const warnings = []

  try {
    // 2. Headless 브라우저 실행
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })

    const page = await browser.newPage()

    // 3. 에러 및 로그 리스너 설정
    page.on('console', (msg) => {
      const type = msg.type()
      if (type === 'error') {
        errors.push(`[Console Error] ${msg.text()}`)
      } else if (type === 'warn') {
        warnings.push(`[Console Warn] ${msg.text()}`)
      }
    })

    page.on('pageerror', (err) => {
      errors.push(`[Page Uncaught Exception] ${err.message || err.toString()}`)
    })

    page.on('error', (err) => {
      errors.push(`[Page Crash] ${err.message || err.toString()}`)
    })

    // 4. 페이지 이동 및 렌더링 대기
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 15000 })
    await new Promise((r) => setTimeout(r, 1500))

    // 5. 기본 DOM 마운트 여부 확인
    const rootElement = await page.$('#root')
    if (!rootElement) {
      errors.push('[DOM Error] #root 엘리먼트를 찾을 수 없거나 React 앱이 마운트되지 않았습니다.')
    }

    const title = await page.title()

    // 6. 결과 분석 및 보고
    if (errors.length > 0) {
      console.error('\n❌ [Headless Check] 런타임 오류가 감지되었습니다:')
      errors.forEach((err) => console.error(`  - ${err}`))
      process.exitCode = 1
    } else {
      console.log(`✅ [Headless Check] 페이지 로드 성공 ("${title}")`)
      console.log('🎉 콘솔 오류 및 런타임 먹통 현상 없음! 정상 작동 확인되었습니다.\n')
    }
  } catch (err) {
    console.error(`\n❌ [Headless Check] 실행 중 예외 발생: ${err.message}`)
    process.exitCode = 1
  } finally {
    if (browser) await browser.close()
    await server.close()
  }
}

runHeadlessCheck()
