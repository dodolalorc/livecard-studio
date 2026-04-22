<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { createApp, type App as VueApp } from 'vue'

import { compileVueSfc } from '@/utils/sfcCompiler'

const props = defineProps<{
  code: string
  refreshToken: number
}>()

const emit = defineEmits<{
  'state-change': [payload: { error: string; warnings: string[] }]
}>()

const canvasRef = ref<HTMLDivElement | null>(null)
const mountRef = ref<HTMLDivElement | null>(null)
const styleHostRef = ref<HTMLDivElement | null>(null)

const currentApp = shallowRef<VueApp<Element> | null>(null)

let renderToken = 0

async function renderPreview() {
  const currentToken = ++renderToken
  emit('state-change', { error: '', warnings: [] })

  try {
    const result = compileVueSfc(props.code)
    if (currentToken !== renderToken) return

    currentApp.value?.unmount()
    currentApp.value = null

    if (styleHostRef.value) {
      styleHostRef.value.innerHTML = ''
      result.styles.forEach((style) => {
        const styleTag = document.createElement('style')
        styleTag.textContent = style
        styleHostRef.value?.appendChild(styleTag)
      })
    }

    if (mountRef.value) {
      mountRef.value.innerHTML = ''
      const mountNode = document.createElement('div')
      mountNode.className = 'preview-pane__mount-node'
      mountRef.value.appendChild(mountNode)
      await nextTick()
      currentApp.value = createApp(result.component)
      currentApp.value.mount(mountNode)
    }

    emit('state-change', { error: '', warnings: result.warnings })
  } catch (error) {
    currentApp.value?.unmount()
    currentApp.value = null

    if (mountRef.value) {
      mountRef.value.innerHTML = ''
    }

    if (styleHostRef.value) {
      styleHostRef.value.innerHTML = ''
    }

    emit('state-change', {
      error: error instanceof Error ? error.message : '组件渲染失败。',
      warnings: [],
    })
  }
}

watch(() => props.code, renderPreview, { immediate: true })
watch(() => props.refreshToken, renderPreview)

onBeforeUnmount(() => {
  currentApp.value?.unmount()
})

function getCaptureNode() {
  return canvasRef.value
}

defineExpose({
  getCaptureNode,
})
</script>

<template>
  <div class="preview-pane">
    <div class="preview-pane__meta">
      <span>动态编译</span>
      <span>单文件组件预览</span>
    </div>

    <div ref="canvasRef" class="preview-pane__canvas">
      <div ref="styleHostRef" />
      <div class="preview-pane__frame">
        <div ref="mountRef" class="preview-pane__mount" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-pane {
  display: grid;
  gap: 14px;
  height: 100%;
}

.preview-pane__meta {
  display: flex;
  justify-content: space-between;
  color: #d1d5db;
  font-size: 12px;
}

.preview-pane__canvas {
  flex: 1;
  min-height: 100%;
  padding: 28px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.preview-pane__frame {
  display: grid;
  place-items: center;
  min-height: 100%;
  padding: 28px;
  border-radius: 8px;
  border: 2px dashed #e5e7eb;
  background: #fafbfc;
}

.preview-pane__mount {
  width: min(100%, 520px);
}
</style>
