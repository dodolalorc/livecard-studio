<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

import type { PanelMode, PanelState } from '@/utils/defaultCard'

const props = defineProps<{
  panel: PanelState
}>()

const emit = defineEmits<{
  'change-mode': [mode: PanelMode]
  dock: []
  focus: []
  'drag-start': [payload: { clientX: number; clientY: number; rect: DOMRect }]
}>()

const popupRootRef = ref<HTMLElement | null>(null)
const popupWindowRef = ref<Window | null>(null)
let popupCloseTimer: number | null = null

function copyStylesToPopup(target: Window) {
  const styles = document.querySelectorAll('style, link[rel="stylesheet"]')
  styles.forEach((node) => {
    target.document.head.appendChild(node.cloneNode(true))
  })
}

function openPopup() {
  if (popupWindowRef.value && !popupWindowRef.value.closed) return

  const popup = window.open(
    '',
    `vue-card-studio-${props.panel.id}`,
    `width=${Math.round(props.panel.width)},height=${Math.round(props.panel.height)},left=${window.screenX + 80},top=${window.screenY + 80}`,
  )

  if (!popup) {
    emit('change-mode', 'floating')
    return
  }

  popup.document.title = `${props.panel.title} - Vue Card Studio`
  popup.document.body.innerHTML = '<div id="popup-root"></div>'
  popup.document.body.style.margin = '0'
  popup.document.body.style.background = '#eef3ee'
  copyStylesToPopup(popup)
  popupRootRef.value = popup.document.getElementById('popup-root')
  popupWindowRef.value = popup

  popup.addEventListener('beforeunload', () => {
    popupWindowRef.value = null
    popupRootRef.value = null
    emit('change-mode', 'floating')
  })

  popupCloseTimer = window.setInterval(() => {
    if (popupWindowRef.value?.closed) {
      if (popupCloseTimer) {
        window.clearInterval(popupCloseTimer)
        popupCloseTimer = null
      }
      popupWindowRef.value = null
      popupRootRef.value = null
      emit('change-mode', 'floating')
    }
  }, 700)
}

function closePopup() {
  if (popupCloseTimer) {
    window.clearInterval(popupCloseTimer)
    popupCloseTimer = null
  }

  if (popupWindowRef.value && !popupWindowRef.value.closed) {
    popupWindowRef.value.close()
  }

  popupWindowRef.value = null
  popupRootRef.value = null
}

watch(
  () => props.panel.mode,
  (mode) => {
    if (mode === 'window') {
      openPopup()
    } else {
      closePopup()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  closePopup()
})

function emitDragStart(event: PointerEvent) {
  if (props.panel.mode === 'window') return
  emit('focus')
  const rect = (event.currentTarget as HTMLElement)
    .closest('.workspace-panel')
    ?.getBoundingClientRect()
  if (!rect) return
  emit('drag-start', {
    clientX: event.clientX,
    clientY: event.clientY,
    rect,
  })
}
</script>

<template>
  <Teleport v-if="panel.mode === 'window' && popupRootRef" :to="popupRootRef">
    <section class="workspace-panel workspace-panel--window" @pointerdown="emit('focus')">
      <header class="workspace-panel__header" @pointerdown.stop="emit('focus')">
        <div>
          <p class="workspace-panel__title">{{ panel.title }}</p>
          <span class="workspace-panel__mode">独立窗口</span>
        </div>
        <div class="workspace-panel__actions">
          <button type="button" @click="emit('change-mode', 'docked')">停靠</button>
          <button type="button" @click="emit('change-mode', 'floating')">悬浮</button>
        </div>
      </header>
      <div class="workspace-panel__body">
        <slot />
      </div>
    </section>
  </Teleport>

  <section
    v-else
    class="workspace-panel"
    :class="{
      'workspace-panel--floating': panel.mode === 'floating',
    }"
    :style="
      panel.mode === 'floating'
        ? {
            width: `${panel.width}px`,
            height: `${panel.height}px`,
            transform: `translate(${panel.x}px, ${panel.y}px)`,
            zIndex: panel.z,
          }
        : undefined
    "
    @pointerdown="emit('focus')"
  >
    <header class="workspace-panel__header" @pointerdown.stop="emitDragStart">
      <div>
        <p class="workspace-panel__title">{{ panel.title }}</p>
        <span class="workspace-panel__mode">
          {{ panel.mode === 'floating' ? '悬浮面板' : '停靠面板' }}
        </span>
      </div>
      <div class="workspace-panel__actions">
        <button
          v-if="panel.mode !== 'docked'"
          type="button"
          @pointerdown.stop
          @click="emit('change-mode', 'docked')"
        >
          停靠
        </button>
        <button
          v-if="panel.mode !== 'floating'"
          type="button"
          @pointerdown.stop
          @click="emit('change-mode', 'floating')"
        >
          悬浮
        </button>
        <button type="button" @pointerdown.stop @click="emit('change-mode', 'window')">弹窗</button>
      </div>
    </header>
    <div class="workspace-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.workspace-panel {
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.04);
}

.workspace-panel--floating {
  position: absolute;
  inset: 0 auto auto 0;
}

.workspace-panel--window {
  min-height: 100vh;
  border-radius: 0;
}

.workspace-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-bottom: 1px solid #e5e7eb;
  cursor: grab;
  user-select: none;
}

.workspace-panel__title {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.workspace-panel__mode {
  font-size: 12px;
  color: #9ca3af;
}

.workspace-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.workspace-panel__actions button {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #1f2937;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.workspace-panel__actions button:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.workspace-panel__body {
  min-height: 0;
  padding: 18px;
}
</style>
