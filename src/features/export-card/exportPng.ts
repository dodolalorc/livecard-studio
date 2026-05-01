/**
 * exportPng.ts
 * 使用 html-to-image 导出当前预览卡片为 PNG。
 */

import { toPng } from 'html-to-image'
import { format } from './exportUtils'

export async function exportPng(
    exportRoot: HTMLElement,
    nickname: string,
    scale: number = 2,
): Promise<void> {
    const dataUrl = await toPng(exportRoot, {
        pixelRatio: scale,
        cacheBust: true,
        backgroundColor: undefined,
    })

    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `livecard-${nickname}-${format(new Date())}.png`
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
