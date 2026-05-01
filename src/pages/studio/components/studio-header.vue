<script setup lang="ts">
import type { ProfileCardData } from '@/types/profile-card'
import ThemePicker from './theme-picker.vue'
import ExportPanel from './export-panel.vue'

const props = defineProps<{
  data: ProfileCardData
}>()

const emit = defineEmits<{
  'update:data': [value: ProfileCardData]
  exportHtml: []
  exportPng: []
  exportZip: []
  reset: []
}>()

function updatePreferences(val: ProfileCardData['preferences']) {
  emit('update:data', { ...props.data, preferences: val })
}

function updateExportScale(scale: number) {
  emit('update:data', {
    ...props.data,
    preferences: { ...props.data.preferences, exportScale: scale },
  })
}
</script>

<template>
  <header class="studio-header">
    <div class="studio-header__brand">
      <span class="studio-header__logo">⚡</span>
      <span class="studio-header__title">LiveCard Studio</span>
      <span class="studio-header__sub">个人介绍卡片工作台</span>
    </div>

    <div class="studio-header__tools">
      <ThemePicker :model-value="data.preferences" @update:model-value="updatePreferences" />

      <ExportPanel
        :data="data"
        :theme-id="data.preferences.themeId"
        :export-scale="data.preferences.exportScale"
        @export-html="emit('exportHtml')"
        @export-png="emit('exportPng')"
        @export-zip="emit('exportZip')"
        @update:export-scale="updateExportScale"
      />

      <button class="header-btn" title="重置为默认数据" @click="emit('reset')">↩ 重置</button>
    </div>
  </header>
</template>

<style scoped>
.studio-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  gap: 16px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.studio-header__brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.studio-header__logo {
  font-size: 20px;
}

.studio-header__title {
  font-size: 15px;
  font-weight: 800;
  color: #172033;
}

.studio-header__sub {
  font-size: 11px;
  color: #94a3b8;
}

.studio-header__tools {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.header-btn {
  padding: 7px 14px;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: background 0.12s;
}

.header-btn:hover {
  background: #f1f5f9;
}
</style>
