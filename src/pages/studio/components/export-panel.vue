<script setup lang="ts">
import { ref } from 'vue'
import type { ProfileCardData } from '@/types/profile-card'

const props = defineProps<{
  data: ProfileCardData
  themeId: string
  exportScale?: number
}>()

const emit = defineEmits<{
  exportHtml: []
  exportPng: []
  exportZip: []
  'update:exportScale': [value: number]
}>()

const busy = ref<'html' | 'png' | 'zip' | null>(null)

async function doExport(type: 'html' | 'png' | 'zip') {
  if (busy.value) return
  busy.value = type
  try {
    if (type === 'html') emit('exportHtml')
    else if (type === 'png') emit('exportPng')
    else emit('exportZip')
  } finally {
    // reset after brief delay to show feedback
    setTimeout(() => {
      busy.value = null
    }, 1500)
  }
}

const scaleOptions = [1, 2, 3]
</script>

<template>
  <div class="export-panel">
    <div class="export-panel__scale">
      <span class="export-panel__scale-label">导出倍率</span>
      <div class="export-panel__scale-btns">
        <button
          v-for="s in scaleOptions"
          :key="s"
          class="scale-btn"
          :class="{ 'scale-btn--active': (exportScale ?? 2) === s }"
          @click="emit('update:exportScale', s)"
        >
          {{ s }}x
        </button>
      </div>
    </div>

    <div class="export-panel__actions">
      <button
        class="export-btn export-btn--html"
        :disabled="busy !== null"
        @click="doExport('html')"
      >
        {{ busy === 'html' ? '导出中…' : '⬇ HTML' }}
      </button>
      <button class="export-btn export-btn--png" :disabled="busy !== null" @click="doExport('png')">
        {{ busy === 'png' ? '导出中…' : '🖼 PNG' }}
      </button>
      <button class="export-btn export-btn--zip" :disabled="busy !== null" @click="doExport('zip')">
        {{ busy === 'zip' ? '打包中…' : '📦 Vue Component' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.export-panel {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.export-panel__scale {
  display: flex;
  align-items: center;
  gap: 8px;
}

.export-panel__scale-label {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.export-panel__scale-btns {
  display: flex;
  gap: 4px;
}

.scale-btn {
  padding: 4px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.12s;
}

.scale-btn--active {
  background: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
}

.export-panel__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.export-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.12s;
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.export-btn--html {
  background: #f0fdf4;
  color: #166534;
}

.export-btn--html:hover:not(:disabled) {
  background: #dcfce7;
}

.export-btn--png {
  background: #eff6ff;
  color: #1d4ed8;
}

.export-btn--png:hover:not(:disabled) {
  background: #dbeafe;
}

.export-btn--zip {
  background: #faf5ff;
  color: #7c3aed;
}

.export-btn--zip:hover:not(:disabled) {
  background: #ede9fe;
}
</style>
