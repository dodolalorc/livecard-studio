<script setup lang="ts">
import { ref } from 'vue'
import { useProfileCardForm } from '@/features/profile-editor/composables/useProfileCardForm'
import { exportHtml } from '@/features/export-card/exportHtml'
import { exportPng } from '@/features/export-card/exportPng'
import StudioHeader from './components/studio-header.vue'
import StudioSidebar from './components/studio-sidebar.vue'
import StudioPreview from './components/studio-preview.vue'

const { cardData, resetToDefault } = useProfileCardForm()

const previewRef = ref<InstanceType<typeof StudioPreview> | null>(null)
const toast = ref<{ msg: string; type: 'success' | 'error' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { msg, type }
  toastTimer = setTimeout(() => {
    toast.value = null
  }, 3000)
}

async function handleExportHtml() {
  const root = previewRef.value?.getExportRoot()
  if (!root) return showToast('预览区域未就绪', 'error')
  try {
    await exportHtml(root, cardData.value.basic.nickname)
    showToast('HTML 导出成功')
  } catch (e) {
    showToast('HTML 导出失败', 'error')
  }
}

async function handleExportPng() {
  try {
    await exportPng(cardData.value, cardData.value.preferences.exportScale)
    showToast('PNG 导出成功')
  } catch (e) {
    showToast('PNG 导出失败', 'error')
  }
}

function handleReset() {
  if (window.confirm('确认重置为默认示例数据？当前内容将丢失。')) {
    resetToDefault()
  }
}

function handleThemeChange(themeId: string) {
  cardData.value = {
    ...cardData.value,
    preferences: {
      ...cardData.value.preferences,
      themeId,
    },
  }
}
</script>

<template>
  <div class="studio-page">
    <StudioHeader
      :data="cardData"
      @update:data="(v) => (cardData = v)"
      @export-html="handleExportHtml"
      @export-png="handleExportPng"
      @reset="handleReset"
    />

    <div class="studio-workspace">
      <StudioSidebar v-model="cardData" class="studio-workspace__sidebar" />
      <StudioPreview
        ref="previewRef"
        :data="cardData"
        :theme-id="cardData.preferences.themeId"
        @update:theme-id="handleThemeChange"
        class="studio-workspace__preview"
      />
    </div>

    <!-- Toast notification -->
    <Transition name="toast">
      <div v-if="toast" class="studio-toast" :class="`studio-toast--${toast.type}`">
        {{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.studio-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, 'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif;
}

.studio-workspace {
  display: grid;
  grid-template-columns: 360px 1fr;
  flex: 1;
  overflow: hidden;
}

.studio-workspace__sidebar {
  overflow: hidden;
}

.studio-workspace__preview {
  overflow-y: auto;
}

/* Toast */
.studio-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  z-index: 9999;
  pointer-events: none;
  white-space: nowrap;
}

.studio-toast--success {
  background: #1a2636;
  color: #d1fae5;
}

.studio-toast--error {
  background: #1a2636;
  color: #fecaca;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>
