<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { saveAs } from 'file-saver'
import { toBlob } from 'html-to-image'

import CodeEditor from '@/components/CodeEditor.vue'
import PreviewPane from '@/components/PreviewPane.vue'
import StylePanel from '@/components/StylePanel.vue'
import ToolbarPanel from '@/components/ToolbarPanel.vue'
import {
  DEFAULT_STYLE_CONTROLS,
  DEFAULT_PRESET_ID,
  EXAMPLE_PRESETS,
  type StyleControls,
} from '@/utils/defaultCard'
import { buildComponentZip } from '@/utils/exporters'
import { formatVueSfc } from '@/utils/prettier'
import {
  applyStyleControlsToCode,
  extractStyleControls,
  styleControlsEqual,
} from '@/utils/styleSync'

type ToastTone = 'info' | 'success' | 'error'
type ResizeTarget = 'main-vertical' | 'left-horizontal' | 'controls-vertical'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ResizeState {
  target: ResizeTarget
}

const MIN_LEFT_WIDTH = 420
const MIN_RIGHT_WIDTH = 420
const MIN_TOP_HEIGHT = 220
const MIN_BOTTOM_HEIGHT = 240
const MIN_TOOL_WIDTH = 320
const MIN_STYLE_WIDTH = 280
const SPLITTER_SIZE = 10

const shellRef = ref<HTMLElement | null>(null)
const previewPaneRef = ref<InstanceType<typeof PreviewPane> | null>(null)
const resizeState = ref<ResizeState | null>(null)
const resizeObserver = ref<ResizeObserver | null>(null)

const code = ref(EXAMPLE_PRESETS.find((preset) => preset.id === DEFAULT_PRESET_ID)?.code ?? '')
const activePresetId = ref(DEFAULT_PRESET_ID)
const previewError = ref('')
const previewWarnings = ref<string[]>([])
const previewRefreshToken = ref(0)
const isFormatting = ref(false)
const busyAction = ref<'png' | 'zip' | null>(null)
const toasts = ref<ToastItem[]>([])
const styleControls = ref<StyleControls>(extractStyleControls(code.value))

const layout = reactive({
  leftWidth: 0,
  leftTopHeight: 0,
  toolWidth: 0,
})

let toastSeed = 0
let isSyncingFromPanel = false

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function pushToast(message: string, tone: ToastTone = 'info') {
  const id = ++toastSeed
  toasts.value = [...toasts.value, { id, message, tone }]
  window.setTimeout(() => {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }, 2800)
}

function syncLayout() {
  const shell = shellRef.value
  if (!shell) return

  const rect = shell.getBoundingClientRect()
  const mainWidth = rect.width
  const mainHeight = rect.height
  const maxLeftWidth = Math.max(MIN_LEFT_WIDTH, mainWidth - MIN_RIGHT_WIDTH - SPLITTER_SIZE)
  const maxTopHeight = Math.max(MIN_TOP_HEIGHT, mainHeight - MIN_BOTTOM_HEIGHT - SPLITTER_SIZE)

  if (!layout.leftWidth) {
    layout.leftWidth = clamp((mainWidth - SPLITTER_SIZE) / 2, MIN_LEFT_WIDTH, maxLeftWidth)
  } else {
    layout.leftWidth = clamp(layout.leftWidth, MIN_LEFT_WIDTH, maxLeftWidth)
  }

  if (!layout.leftTopHeight) {
    layout.leftTopHeight = clamp(mainHeight * 0.42, MIN_TOP_HEIGHT, maxTopHeight)
  } else {
    layout.leftTopHeight = clamp(layout.leftTopHeight, MIN_TOP_HEIGHT, maxTopHeight)
  }

  const topWidth = layout.leftWidth
  const maxToolWidth = Math.max(MIN_TOOL_WIDTH, topWidth - MIN_STYLE_WIDTH - SPLITTER_SIZE)

  if (!layout.toolWidth) {
    layout.toolWidth = clamp((topWidth - SPLITTER_SIZE) * 0.52, MIN_TOOL_WIDTH, maxToolWidth)
  } else {
    layout.toolWidth = clamp(layout.toolWidth, MIN_TOOL_WIDTH, maxToolWidth)
  }
}

function startResize(target: ResizeTarget) {
  resizeState.value = { target }
}

function handlePointerMove(event: PointerEvent) {
  const shell = shellRef.value
  const current = resizeState.value
  if (!shell || !current) return

  const rect = shell.getBoundingClientRect()

  if (current.target === 'main-vertical') {
    const maxLeftWidth = Math.max(MIN_LEFT_WIDTH, rect.width - MIN_RIGHT_WIDTH - SPLITTER_SIZE)
    layout.leftWidth = clamp(event.clientX - rect.left, MIN_LEFT_WIDTH, maxLeftWidth)
  }

  if (current.target === 'left-horizontal') {
    const maxTopHeight = Math.max(MIN_TOP_HEIGHT, rect.height - MIN_BOTTOM_HEIGHT - SPLITTER_SIZE)
    layout.leftTopHeight = clamp(event.clientY - rect.top, MIN_TOP_HEIGHT, maxTopHeight)
  }

  if (current.target === 'controls-vertical') {
    const maxToolWidth = Math.max(
      MIN_TOOL_WIDTH,
      layout.leftWidth - MIN_STYLE_WIDTH - SPLITTER_SIZE,
    )
    layout.toolWidth = clamp(event.clientX - rect.left, MIN_TOOL_WIDTH, maxToolWidth)
  }
}

function stopResize() {
  resizeState.value = null
}

watch(
  code,
  (value) => {
    if (isSyncingFromPanel) {
      isSyncingFromPanel = false
      return
    }

    const next = extractStyleControls(value)
    if (!styleControlsEqual(next, styleControls.value)) {
      styleControls.value = next
    }
  },
  { immediate: true },
)

function applyPreset(id: string) {
  const preset = EXAMPLE_PRESETS.find((item) => item.id === id)
  if (!preset) return

  activePresetId.value = preset.id
  code.value = preset.code
  styleControls.value = extractStyleControls(preset.code)
  previewRefreshToken.value += 1
  pushToast(`已切换到默认示例：${preset.name}。`, 'success')
}

function handleStyleControlsChange(next: StyleControls) {
  styleControls.value = next
  const updated = applyStyleControlsToCode(code.value, next)
  if (updated !== code.value) {
    isSyncingFromPanel = true
    code.value = updated
  }
}

function handleStyleReset() {
  handleStyleControlsChange({ ...DEFAULT_STYLE_CONTROLS })
  pushToast('样式参数已重置。', 'info')
}

function handlePreviewState(payload: { error: string; warnings: string[] }) {
  previewError.value = payload.error
  previewWarnings.value = payload.warnings
}

async function handleFormatCode() {
  if (isFormatting.value) return

  isFormatting.value = true
  try {
    code.value = await formatVueSfc(code.value)
    pushToast('代码格式化完成。', 'success')
  } catch (error) {
    pushToast(error instanceof Error ? error.message : '代码格式化失败。', 'error')
  } finally {
    isFormatting.value = false
  }
}

async function handleCopyCode() {
  try {
    await navigator.clipboard.writeText(code.value)
    pushToast('组件代码已复制到剪贴板。', 'success')
  } catch {
    pushToast('复制失败，请检查浏览器剪贴板权限。', 'error')
  }
}

async function handleDownloadPng() {
  const node = previewPaneRef.value?.getCaptureNode()
  if (!node) {
    pushToast('预览区域尚未准备完成。', 'error')
    return
  }

  busyAction.value = 'png'
  try {
    const blob = await toBlob(node, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#eef3f1',
    })

    if (!blob) {
      throw new Error('截图生成失败。')
    }

    saveAs(blob, `vue-card-preview-${Date.now()}.png`)
    pushToast('PNG 截图已下载。', 'success')
  } catch (error) {
    pushToast(error instanceof Error ? error.message : 'PNG 导出失败。', 'error')
  } finally {
    busyAction.value = null
  }
}

async function handleDownloadZip() {
  busyAction.value = 'zip'
  try {
    const blob = await buildComponentZip(code.value, styleControls.value)
    saveAs(blob, `vue-card-component-${Date.now()}.zip`)
    pushToast('组件 ZIP 包已下载。', 'success')
  } catch (error) {
    pushToast(error instanceof Error ? error.message : 'ZIP 打包失败。', 'error')
  } finally {
    busyAction.value = null
  }
}

function handleRefreshPreview() {
  previewRefreshToken.value += 1
  pushToast('预览已强制刷新。', 'info')
}

onMounted(() => {
  syncLayout()
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', stopResize)

  resizeObserver.value = new ResizeObserver(() => {
    syncLayout()
  })

  if (shellRef.value) {
    resizeObserver.value.observe(shellRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', stopResize)
  resizeObserver.value?.disconnect()
})
</script>

<template>
  <div class="app-shell">
    <div
      ref="shellRef"
      class="workspace"
      :class="{ 'workspace--resizing': resizeState }"
      :style="{ gridTemplateColumns: `${layout.leftWidth}px ${SPLITTER_SIZE}px minmax(0, 1fr)` }"
    >
      <section
        class="workspace__left"
        :style="{ gridTemplateRows: `${layout.leftTopHeight}px ${SPLITTER_SIZE}px minmax(0, 1fr)` }"
      >
        <div
          class="workspace__left-top"
          :style="{ gridTemplateColumns: `${layout.toolWidth}px ${SPLITTER_SIZE}px minmax(0, 1fr)` }"
        >
          <section class="panel panel--tools">
            <header class="panel__header">
              <div>
                <p class="panel__eyebrow">功能区</p>
                <h2>默认示例、导出和调试入口</h2>
              </div>
              <div class="panel__meta">
                <span>介绍卡片已内置</span>
                <span>拖拽边界可改布局</span>
              </div>
            </header>

            <ToolbarPanel
              :active-preset-id="activePresetId"
              :busy-action="busyAction"
              :is-formatting="isFormatting"
              :presets="EXAMPLE_PRESETS"
              @apply-preset="applyPreset"
              @copy="handleCopyCode"
              @download-png="handleDownloadPng"
              @download-zip="handleDownloadZip"
              @format="handleFormatCode"
              @refresh="handleRefreshPreview"
            />
          </section>

          <div
            class="splitter splitter--vertical"
            role="separator"
            aria-orientation="vertical"
            @pointerdown="startResize('controls-vertical')"
          />

          <section class="panel panel--style">
            <header class="panel__header">
              <div>
                <p class="panel__eyebrow">样式面板</p>
                <h2>同步调色、圆角、阴影</h2>
              </div>
            </header>

            <StylePanel
              :controls="styleControls"
              @change="handleStyleControlsChange"
              @reset="handleStyleReset"
            />
          </section>
        </div>

        <div
          class="splitter splitter--horizontal"
          role="separator"
          aria-orientation="horizontal"
          @pointerdown="startResize('left-horizontal')"
        />

        <section class="panel panel--editor">
          <header class="panel__header">
            <div>
              <p class="panel__eyebrow">代码编辑</p>
              <h2>左下编辑器</h2>
            </div>
            <div class="panel__meta">
              <span>{{ previewError ? '存在编译错误' : '实时同步中' }}</span>
            </div>
          </header>

          <CodeEditor v-model="code" :error-message="previewError" />
        </section>
      </section>

      <div
        class="splitter splitter--vertical"
        role="separator"
        aria-orientation="vertical"
        @pointerdown="startResize('main-vertical')"
      />

      <section class="panel panel--preview">
        <header class="panel__header">
          <div>
            <p class="panel__eyebrow">实时预览</p>
            <h2>右侧预览区默认占半屏</h2>
          </div>
          <div class="panel__meta">
            <span>Warnings {{ previewWarnings.length }}</span>
            <span>{{ activePresetId }}</span>
          </div>
        </header>

        <PreviewPane
          ref="previewPaneRef"
          :code="code"
          :refresh-token="previewRefreshToken"
          @state-change="handlePreviewState"
        />
      </section>
    </div>

    <div class="toast-stack">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :data-tone="toast.tone">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 16px;
  background:
    radial-gradient(circle at top left, rgba(239, 171, 92, 0.22), transparent 24%),
    linear-gradient(135deg, #eef3ee 0%, #dfe8e1 100%);
}

.workspace {
  display: grid;
  gap: 0;
  height: calc(100vh - 32px);
  min-height: 720px;
  border-radius: 26px;
  overflow: hidden;
  border: 1px solid rgba(19, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 60px rgba(16, 28, 21, 0.12);
}

.workspace--resizing {
  user-select: none;
  cursor: col-resize;
}

.workspace__left {
  display: grid;
  min-width: 0;
  min-height: 0;
}

.workspace__left-top {
  display: grid;
  min-width: 0;
  min-height: 0;
}

.panel {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  padding: 18px;
  overflow: hidden;
}

.panel--tools,
.panel--style,
.panel--editor {
  background: rgba(255, 255, 255, 0.82);
}

.panel--preview {
  background:
    radial-gradient(circle at top, rgba(238, 155, 92, 0.14), transparent 22%),
    rgba(248, 251, 248, 0.88);
}

.panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.panel__eyebrow {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #d17b49;
}

.panel__header h2 {
  margin: 0;
  font-size: 18px;
  line-height: 1.1;
  color: #17211b;
}

.panel__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.panel__meta span {
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(23, 33, 27, 0.06);
  color: #607067;
  font-size: 12px;
}

.splitter {
  position: relative;
  background: rgba(23, 33, 27, 0.06);
}

.splitter::after {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: 999px;
  background: rgba(209, 123, 73, 0.42);
}

.splitter--vertical {
  cursor: col-resize;
}

.splitter--horizontal {
  cursor: row-resize;
}

.toast-stack {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: grid;
  gap: 10px;
  z-index: 20;
}

.toast {
  min-width: 240px;
  max-width: 340px;
  padding: 12px 14px;
  border-radius: 14px;
  box-shadow: 0 18px 34px rgba(16, 27, 22, 0.16);
  background: rgba(255, 255, 255, 0.92);
  color: #152018;
  font-size: 13px;
}

.toast[data-tone='success'] {
  border-left: 4px solid #2f8f5b;
}

.toast[data-tone='error'] {
  border-left: 4px solid #c85a4a;
}

.toast[data-tone='info'] {
  border-left: 4px solid #487c86;
}

@media (max-width: 1100px) {
  .app-shell {
    padding: 12px;
  }

  .workspace {
    height: auto;
    min-height: calc(100vh - 24px);
    grid-template-columns: 1fr !important;
    grid-template-rows: auto auto;
  }

  .workspace__left {
    grid-template-rows: auto auto auto !important;
  }

  .workspace__left-top {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto auto auto;
  }

  .splitter {
    display: none;
  }
}
</style>
