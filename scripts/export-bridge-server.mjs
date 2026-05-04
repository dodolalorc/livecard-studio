import { createServer } from 'node:http'
import process from 'node:process'
import { chromium } from 'playwright'

const PORT = Number(process.env.LIVECARD_EXPORT_BRIDGE_PORT || 3210)
const TARGET_URL_CANDIDATES = [
    process.env.LIVECARD_EXPORT_TARGET_URL,
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://127.0.0.1:4173',
    'http://localhost:4173',
].filter(Boolean)
const STORAGE_KEY = 'livecard-studio-profile-card-v1'

const EXPORT_TIMEOUT_MS = Number(process.env.LIVECARD_EXPORT_TIMEOUT_MS || 45000)
const EXPORT_SCENE_PADDING = Number(process.env.LIVECARD_EXPORT_SCENE_PADDING || 120)
const EXPORT_CARD_RADIUS = Number(process.env.LIVECARD_EXPORT_CARD_RADIUS || 22)

let activeTargetUrl = TARGET_URL_CANDIDATES[0]
let renderChain = Promise.resolve()

const browser = await chromium.launch({ headless: true })

async function probeUrl(url) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 1500)
    try {
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
        })
        return response.ok || response.status === 304
    } catch {
        return false
    } finally {
        clearTimeout(timer)
    }
}

async function resolveTargetUrl() {
    for (const candidate of TARGET_URL_CANDIDATES) {
        const ok = await probeUrl(candidate)
        if (ok) {
            activeTargetUrl = candidate
            return candidate
        }
    }
    return null
}

async function waitForImagesIn(rootLocator) {
    await rootLocator.evaluate(async (root) => {
        const images = Array.from(root.querySelectorAll('img'))
        await Promise.all(
            images.map(
                (img) =>
                    new Promise((resolveDone) => {
                        if (img.complete) return resolveDone(true)
                        img.addEventListener('load', () => resolveDone(true), { once: true })
                        img.addEventListener('error', () => resolveDone(true), { once: true })
                    }),
            ),
        )
    })
}

async function renderCardPng({ cardData, scale = 2, waitMs = 180 }) {
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1400 },
        deviceScaleFactor: Math.max(1, Number(scale) || 2),
        colorScheme: 'light',
        locale: 'zh-CN',
    })

    try {
        const page = await context.newPage()

        await page.addInitScript(
            ({ key, data }) => {
                localStorage.setItem(key, JSON.stringify(data))
            },
            { key: STORAGE_KEY, data: cardData },
        )

        const target = await resolveTargetUrl()
        if (!target) {
            throw new Error(
                `目标页面不可访问，请先启动前端服务（尝试过: ${TARGET_URL_CANDIDATES.join(', ')}）`,
            )
        }

        await page.goto(target, { waitUntil: 'networkidle', timeout: 30000 })

        await page.evaluate(async () => {
            if (document.fonts && document.fonts.ready) {
                await document.fonts.ready
            }
        })

        const root = page.locator('[data-export-root="profile-card"]')
        await root.waitFor({ state: 'visible', timeout: 15000 })
        await waitForImagesIn(root)

        // Disable animations first
        await page.addStyleTag({
            content: `
                *, *::before, *::after {
                    animation-duration: 0s !important;
                    transition-duration: 0s !important;
                    caret-color: transparent !important;
                }
            `,
        })

        if (waitMs > 0) await page.waitForTimeout(Number(waitMs) || 0)

        // Get the natural card dimensions before any layout manipulation
        const bbox = await root.boundingBox()
        if (!bbox) {
            throw new Error('导出目标不可见，无法计算截图区域')
        }

        const padding = Math.max(0, Number(EXPORT_SCENE_PADDING) || 0)
        const radius = Math.max(0, Number(EXPORT_CARD_RADIUS) || 0)
        const sceneWidth = Math.ceil(bbox.width + padding * 2)
        const sceneHeight = Math.ceil(bbox.height + padding * 2)

        // Resize viewport to exactly fit card + padding on all four sides
        await page.setViewportSize({ width: sceneWidth, height: sceneHeight })

        // Create a fixed full-viewport overlay, move the actual card element into it
        // so Vue reactivity and computed styles are preserved intact
        await page.evaluate(
            ({ pad, rad }) => {
                const card = document.querySelector('[data-export-root="profile-card"]')
                if (!card) return

                // Apply card presentation styles
                card.style.setProperty('border-radius', rad + 'px', 'important')
                card.style.setProperty('overflow', 'hidden', 'important')
                card.style.setProperty(
                    'box-shadow',
                    [
                        `0 70px 140px rgba(10, 18, 40, 0.46)`,
                        `0 28px 56px rgba(10, 18, 40, 0.30)`,
                        `0 8px 18px rgba(10, 18, 40, 0.18)`,
                    ].join(', '),
                    'important',
                )

                // Build scene overlay
                const scene = document.createElement('div')
                scene.id = '__livecard-export-scene__'
                Object.assign(scene.style, {
                    position: 'fixed',
                    inset: '0',
                    zIndex: '2147483647',
                    background:
                        'radial-gradient(ellipse at 30% 20%, #dce8f8 0%, #c9d9ef 35%, #b8cce4 70%, #adc4de 100%)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: pad + 'px',
                    boxSizing: 'border-box',
                })

                scene.appendChild(card)
                document.body.appendChild(scene)
            },
            { pad: padding, rad: radius },
        )

        return await page.screenshot({
            type: 'png',
            omitBackground: false,
            animations: 'disabled',
        })
    } finally {
        await context.close()
    }
}

function setCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function withTimeout(promise, timeoutMs) {
    return new Promise((resolveDone, rejectDone) => {
        const timer = setTimeout(() => {
            rejectDone(new Error(`导出超时（>${timeoutMs}ms）`))
        }, timeoutMs)

        promise
            .then((value) => {
                clearTimeout(timer)
                resolveDone(value)
            })
            .catch((error) => {
                clearTimeout(timer)
                rejectDone(error)
            })
    })
}

const server = createServer(async (req, res) => {
    setCors(res)

    if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
    }

    if (req.method === 'GET' && req.url === '/health') {
        const targetOk = (await resolveTargetUrl()) !== null
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(
            JSON.stringify({
                ok: true,
                targetOk,
                activeTargetUrl,
                candidates: TARGET_URL_CANDIDATES,
            }),
        )
        return
    }

    if (req.method === 'POST' && req.url === '/api/export/png') {
        try {
            let raw = ''
            req.setEncoding('utf8')
            for await (const chunk of req) {
                raw += chunk
                if (raw.length > 2_000_000) {
                    throw new Error('payload too large')
                }
            }

            const body = raw ? JSON.parse(raw) : {}
            if (!body.cardData || typeof body.cardData !== 'object') {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
                res.end(JSON.stringify({ error: 'cardData is required' }))
                return
            }

            const nextTask = () =>
                withTimeout(
                    renderCardPng({
                        cardData: body.cardData,
                        scale: body.scale,
                        waitMs: body.waitMs,
                    }),
                    EXPORT_TIMEOUT_MS,
                )

            const pngBuffer = await (renderChain = renderChain.then(nextTask, nextTask))

            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Cache-Control': 'no-store',
                'Content-Length': pngBuffer.length,
            })
            res.end(pngBuffer)
            return
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(
                JSON.stringify({
                    error: error instanceof Error ? error.message : 'export failed',
                }),
            )
            return
        }
    }

    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ error: 'not found' }))
})

server.listen(PORT, '127.0.0.1', () => {
    // eslint-disable-next-line no-console
    console.log(`[livecard-export-bridge] listening on http://127.0.0.1:${PORT}`)
    // eslint-disable-next-line no-console
    console.log(`[livecard-export-bridge] target candidates: ${TARGET_URL_CANDIDATES.join(', ')}`)
})

function shutdown() {
    server.close(async () => {
        await browser.close()
        process.exit(0)
    })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
