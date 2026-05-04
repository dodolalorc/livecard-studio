/**
 * exportPng.ts
 * 通过本地 Playwright 导出桥接服务导出 PNG。
 */

import type { ProfileCardData } from '@/types/profile-card'
import { format } from './exportUtils'

const BRIDGE_URL = import.meta.env.VITE_EXPORT_BRIDGE_URL || 'http://127.0.0.1:3210/api/export/png'
const BRIDGE_HEALTH_URL = BRIDGE_URL.replace('/api/export/png', '/health')

async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs: number) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
        return await fetch(input, { ...init, signal: controller.signal })
    } finally {
        clearTimeout(timer)
    }
}

export async function exportPng(data: ProfileCardData, scale: number = 2): Promise<void> {
    // Preflight health check gives user-friendly diagnostics.
    const health = await fetchWithTimeout(BRIDGE_HEALTH_URL, { method: 'GET' }, 2500).catch(() => null)
    if (!health || !health.ok) {
        throw new Error('本地导出服务未启动，请先运行 pnpm export:bridge')
    }

    const response = await fetchWithTimeout(BRIDGE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cardData: data,
            scale,
            waitMs: 180,
        }),
    }, 50000)

    if (!response.ok) {
        let detail = ''
        try {
            const payload = await response.json()
            detail = payload?.error ? `: ${payload.error}` : ''
        } catch {
            // ignore parse errors
        }
        throw new Error(`本地导出服务不可用${detail}`)
    }

    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = objectUrl
    a.download = `livecard-${data.basic.nickname}-${format(new Date())}.png`
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(objectUrl)
}
