<script setup lang="ts">
import type { ExamplePreset } from '@/utils/defaultCard'

defineProps<{
  isFormatting: boolean
  busyAction: 'png' | 'zip' | null
  presets: ExamplePreset[]
  activePresetId: string
}>()

const emit = defineEmits<{
  copy: []
  format: []
  refresh: []
  'apply-preset': [id: string]
  'download-png': []
  'download-zip': []
}>()
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__presets">
      <p>默认示例</p>
      <div class="toolbar__preset-list">
        <button
          v-for="preset in presets"
          :key="preset.id"
          type="button"
          class="toolbar__preset"
          :class="{ 'toolbar__preset--active': activePresetId === preset.id }"
          @click="emit('apply-preset', preset.id)"
        >
          <strong>{{ preset.name }}</strong>
          <span>{{ preset.description }}</span>
        </button>
      </div>
    </div>

    <div class="toolbar__actions">
      <button type="button" @click="emit('copy')">复制代码</button>
      <button type="button" :disabled="isFormatting" @click="emit('format')">
        {{ isFormatting ? '格式化中...' : '格式化代码' }}
      </button>
      <button type="button" @click="emit('refresh')">刷新预览</button>
      <button type="button" :disabled="busyAction === 'png'" @click="emit('download-png')">
        {{ busyAction === 'png' ? '生成中...' : '下载 PNG' }}
      </button>
      <button type="button" :disabled="busyAction === 'zip'" @click="emit('download-zip')">
        {{ busyAction === 'zip' ? '打包中...' : '打包组件' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: grid;
  gap: 18px;
}

.toolbar__presets {
  display: grid;
  gap: 10px;
}

.toolbar__presets p {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ca3af;
}

.toolbar__preset-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar__preset,
.toolbar__actions button {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #1f2937;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar__preset:hover,
.toolbar__actions button:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.toolbar__preset {
  min-width: 180px;
  display: grid;
  gap: 4px;
  text-align: left;
}

.toolbar__preset strong {
  font-size: 13px;
  color: #1f2937;
}

.toolbar__preset span {
  font-size: 12px;
  line-height: 1.5;
  color: #9ca3af;
}

.toolbar__preset--active {
  background: #1f2937;
  color: #ffffff;
  border-color: #1f2937;
}

.toolbar__preset--active strong {
  color: #ffffff;
}

.toolbar__preset--active span {
  color: #e5e7eb;
}

.toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar__actions button:disabled {
  cursor: progress;
  opacity: 0.64;
}
</style>
