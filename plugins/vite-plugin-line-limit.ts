import fs from 'fs'
import path from 'path'
import type { Plugin, ResolvedConfig } from 'vite'

interface LineLimitOptions {
  maxLines?: number
}

export function lineLimitWarningPlugin(options: LineLimitOptions = {}): Plugin {
  const maxLines = options.maxLines ?? 300
  let config: ResolvedConfig

  function checkDir(dir: string, root: string) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        checkDir(fullPath, root)
      } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8')
          // 단일 파일로서의 높은 응집도가 인정되는 경우 경고 무시
          if (content.includes('@cohesive-file') || content.includes('@ignore-line-limit')) {
            continue
          }

          const lines = content.split(/\r?\n/).length
          if (lines > maxLines) {
            const relPath = path.relative(root, fullPath).replace(/\\/g, '/')
            const message =
              `\n\x1b[33m[Architecture Advisory]\x1b[0m ℹ️  '${relPath}' 파일이 ${lines}줄입니다 (권고 기준: ${maxLines}줄 초과).\n` +
              `   👉 두 가지 이상의 독립적인 기능/관심사가 섞여 있다면 기능 단위(컴포넌트/훅) 분리를 검토하세요.\n` +
              `   💡 단일 기능으로서 응집도가 높아 한 파일 유지가 더 낫다면 파일 상단에 '// @cohesive-file'을 추가하세요.\n`
            if (config?.logger) {
              config.logger.warn(message)
            } else {
              console.warn(message)
            }
          }
        } catch {
          // ignore file read error
        }
      }
    }
  }

  return {
    name: 'vite-plugin-line-limit-warning',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    buildStart() {
      const srcDir = path.resolve(config?.root || process.cwd(), 'src')
      checkDir(srcDir, config?.root || process.cwd())
    },
  }
}

