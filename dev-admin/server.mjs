import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const SRC_DIR = path.resolve(ROOT_DIR, 'src')
const PORT = process.env.ADMIN_PORT || 5174

// Normalized phase names and order
const PHASES = [
  { id: 'trigger', label: '입력 (Trigger)', color: '#10b981', icon: '⚡' },
  { id: 'decision', label: '판단 (Decision)', color: '#f59e0b', icon: '⚖️' },
  { id: 'compute', label: '연산 (Compute)', color: '#3b82f6', icon: '⚙️' },
  { id: 'api', label: 'API (Network)', color: '#06b6d4', icon: '🌐' },
  { id: 'store', label: '저장소 (Store)', color: '#ec4899', icon: '💾' },
  { id: 'render', label: '출력 (Render)', color: '#8b5cf6', icon: '🎨' },
]

function mapPhase(raw) {
  if (!raw) return 'compute'
  const lower = raw.toLowerCase()
  if (lower.includes('입력') || lower.includes('trigger') || lower.includes('input')) return 'trigger'
  if (lower.includes('판단') || lower.includes('decision') || lower.includes('guard') || lower.includes('condition')) return 'decision'
  if (lower.includes('api') || lower.includes('network') || lower.includes('fetch')) return 'api'
  if (lower.includes('저장') || lower.includes('store') || lower.includes('storage')) return 'store'
  if (lower.includes('출력') || lower.includes('render') || lower.includes('view') || lower.includes('ui')) return 'render'
  return 'compute'
}

function parseFileMetadata(filePath, relativePath, content) {
  const lines = content.split(/\r?\n/)
  const lineCount = lines.length

  // Match JSDoc blocks /** ... */
  const docMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
  const docText = docMatch ? docMatch[1] : ''

  const getTag = (tag) => {
    const reg = new RegExp(`@${tag}\\s+([^\r\n*]+)`)
    const m = docText.match(reg)
    return m ? m[1].trim() : null
  }

  // Parse @domain or @module or @group
  const domain = getTag('domain') || getTag('module') || getTag('group') || '일반 / 공통'

  // Parse @feature (can be comma-separated or array)
  const rawFeature = getTag('feature') || '기본 공통'
  const features = rawFeature.split(',').map((f) => f.trim()).filter(Boolean)

  // Parse @phase
  const rawPhase = getTag('phase')
  let phase = mapPhase(rawPhase)

  // Fallback phase inference if unannotated
  if (!rawPhase) {
    if (relativePath.endsWith('.css')) phase = 'render'
    else if (relativePath.includes('components/')) phase = 'render'
    else if (relativePath.includes('hooks/')) phase = 'compute'
    else if (relativePath.includes('lib/')) phase = 'compute'
  }

  // Parse @desc
  const desc = getTag('desc') || getTag('description') || `${path.basename(filePath)} 모듈`

  // Parse @trigger (e.g. "버튼 클릭", "페이지 로드")
  const trigger = getTag('trigger')

  // Parse @target (e.g. "ThemeToggleButton", "CounterControls")
  const target = getTag('target')

  // Parse @next (outgoing connection target)
  const rawNext = getTag('next')
  const nextTargets = rawNext ? rawNext.split(',').map((t) => t.trim()) : []

  // Parse @store (e.g. "@store localStorage (write: theme)" or "@store inventoryStore (read)")
  const rawStore = getTag('store')
  let storeInfo = null
  if (rawStore) {
    const isWrite = rawStore.toLowerCase().includes('write') || rawStore.toLowerCase().includes('쓰기')
    const isRead = rawStore.toLowerCase().includes('read') || rawStore.toLowerCase().includes('읽기')
    const nameMatch = rawStore.match(/^([^\s(]+)/)
    const name = nameMatch ? nameMatch[1] : rawStore
    storeInfo = {
      name,
      mode: isWrite ? 'write' : isRead ? 'read' : 'both',
      detail: rawStore,
    }
  }

  // Parse imports to find connections
  const imports = []
  const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g
  let match
  while ((match = importRegex.exec(content)) !== null) {
    const imp = match[1]
    if (imp.startsWith('.') || imp.startsWith('@/')) {
      imports.push(imp)
    }
  }

  // Detect if file is a renderable React component
  const normalizedRel = relativePath.replace(/\\/g, '/')
  const isComponent = normalizedRel.startsWith('src/components/') && normalizedRel.endsWith('.tsx')
  const componentName = isComponent ? path.basename(filePath, path.extname(filePath)) : null
  const previewUrl = isComponent ? `http://localhost:5173/?preview=${componentName}` : null

  return {
    id: normalizedRel,
    name: path.basename(filePath),
    filePath: normalizedRel,
    fullPath: filePath,
    lineCount,
    domain,
    features,
    phase,
    desc,
    trigger,
    target,
    nextTargets,
    storeInfo,
    imports,
    isComponent,
    componentName,
    previewUrl,
  }
}

function scanProject() {
  const nodes = []

  function walk(dir) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'dist') {
          walk(full)
        }
      } else if (/\.(tsx?|jsx?|css)$/.test(entry.name)) {
        try {
          const content = fs.readFileSync(full, 'utf-8')
          const rel = path.relative(SRC_DIR, full)
          nodes.push(parseFileMetadata(full, `src/${rel}`, content))
        } catch {
          // ignore read errors
        }
      }
    }
  }

  walk(SRC_DIR)

  // Collect domains and features hierarchically
  const domainMap = {}
  const featureMap = {}
  const phaseOrder = { trigger: 1, decision: 2, compute: 3, api: 4, store: 5, render: 6 }

  for (const node of nodes) {
    const dom = node.domain || '일반 / 공통'
    if (!domainMap[dom]) {
      domainMap[dom] = {}
    }

    for (const feat of node.features) {
      if (!domainMap[dom][feat]) {
        domainMap[dom][feat] = []
      }
      domainMap[dom][feat].push(node)

      if (!featureMap[feat]) {
        featureMap[feat] = []
      }
      featureMap[feat].push(node)
    }
  }

  // Sort nodes in each feature by phase order
  for (const feat in featureMap) {
    featureMap[feat].sort((a, b) => (phaseOrder[a.phase] || 99) - (phaseOrder[b.phase] || 99))
  }

  const domainList = Object.keys(domainMap).map((domName) => {
    const fMap = domainMap[domName]
    const featList = Object.keys(fMap).map((fName) => {
      fMap[fName].sort((a, b) => (phaseOrder[a.phase] || 99) - (phaseOrder[b.phase] || 99))
      return {
        name: fName,
        domain: domName,
        nodeCount: fMap[fName].length,
        nodes: fMap[fName],
      }
    })
    return {
      name: domName,
      featureCount: featList.length,
      features: featList,
    }
  })

  // Collect store hub (stores with writes and reads)
  const storeHub = {}
  for (const node of nodes) {
    if (node.storeInfo) {
      const sName = node.storeInfo.name
      if (!storeHub[sName]) {
        storeHub[sName] = { name: sName, writes: [], reads: [] }
      }
      if (node.storeInfo.mode === 'write' || node.storeInfo.mode === 'both') {
        storeHub[sName].writes.push({
          nodeId: node.id,
          name: node.name,
          desc: node.desc,
          domain: node.domain,
          feature: node.features[0],
          detail: node.storeInfo.detail,
        })
      }
      if (node.storeInfo.mode === 'read' || node.storeInfo.mode === 'both') {
        storeHub[sName].reads.push({
          nodeId: node.id,
          name: node.name,
          desc: node.desc,
          domain: node.domain,
          feature: node.features[0],
          detail: node.storeInfo.detail,
        })
      }
    }
  }

  return {
    meta: {
      totalFiles: nodes.length,
      updatedAt: new Date().toISOString(),
      phases: PHASES,
    },
    domains: domainList,
    features: Object.keys(featureMap).map((name) => ({
      name,
      nodeCount: featureMap[name].length,
      nodes: featureMap[name],
    })),
    stores: Object.values(storeHub),
    allNodes: nodes,
  }
}

// SSE Clients set
const sseClients = new Set()

function broadcastUpdate() {
  const data = JSON.stringify({ type: 'update', timestamp: Date.now() })
  for (const res of sseClients) {
    res.write(`data: ${data}\n\n`)
  }
}

// Watch src folder for live sync
let watchDebounce = null
try {
  fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && /\.(tsx?|jsx?|css)$/.test(filename)) {
      clearTimeout(watchDebounce)
      watchDebounce = setTimeout(() => {
        broadcastUpdate()
      }, 100)
    }
  })
} catch (e) {
  console.warn('fs.watch error:', e.message)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

  if (url.pathname === '/api/graph') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    })
    return res.end(JSON.stringify(scanProject(), null, 2))
  }

  if (url.pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })
    res.write(': connected\n\n')
    sseClients.add(res)
    req.on('close', () => {
      sseClients.delete(res)
    })
    return
  }

  // Serve static UI assets from dev-admin/public
  const safePath = path.normalize(url.pathname === '/' ? '/index.html' : url.pathname)
  const filePath = path.join(__dirname, 'public', safePath)
  if (filePath.startsWith(path.join(__dirname, 'public')) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath)
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.svg': 'image/svg+xml',
    }
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    })
    return res.end(fs.readFileSync(filePath))
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Not Found')
})

function startServer(port, retryCount = 0) {
  server.removeAllListeners('error')
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (retryCount < 5) {
        const nextPort = port + 1
        console.warn(`⚠️  [Admin Inspector] 포트 ${port}이(가) 이미 사용 중입니다. 다음 포트(${nextPort})로 자동 전환합니다...`)
        startServer(nextPort, retryCount + 1)
      } else {
        console.error(`❌ [Admin Inspector] 포트 ${port}까지 모두 사용 중입니다. 기존 node 프로세스를 종료하거나 ADMIN_PORT 환경 변수를 지정해 주세요.`)
        process.exit(1)
      }
    } else {
      console.error('❌ [Admin Inspector] 서버 실행 오류:', err)
      process.exit(1)
    }
  })

  server.listen(port, '0.0.0.0', () => {
    console.log(`\n🚀 [Admin Inspector] 관리자 아키텍처 뷰 서버 구동 완료!`)
    console.log(`👉 http://localhost:${port}/ (or http://127.0.0.1:${port}/)\n`)
  })
}

startServer(Number(PORT))
