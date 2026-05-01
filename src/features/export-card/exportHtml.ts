/**
 * exportHtml.ts
 * 导出当前预览为可离线打开的 HTML 文件。
 */

import { format } from './exportUtils'

export async function exportHtml(exportRoot: HTMLElement, nickname: string): Promise<void> {
    const clone = exportRoot.cloneNode(true) as HTMLElement

    // Collect all <style> and <link rel="stylesheet"> from document
    const styleSheets = Array.from(document.styleSheets)
    let inlinedCss = ''
    for (const sheet of styleSheets) {
        try {
            const rules = Array.from(sheet.cssRules)
            inlinedCss += rules.map((r) => r.cssText).join('\n')
        } catch {
            // Cross-origin stylesheets — skip
        }
    }

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LiveCard — ${nickname}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; padding: 32px; background: #f1f5f9; display: flex; align-items: flex-start; justify-content: center; min-height: 100vh; font-family: -apple-system, 'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif; }
    ${inlinedCss}
  </style>
</head>
<body>
  <div style="width: 100%; max-width: 480px;">
    ${clone.outerHTML}
  </div>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    downloadBlob(blob, `livecard-${nickname}-${format(new Date())}.html`)
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
