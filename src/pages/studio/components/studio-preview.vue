<script setup lang="ts">
import { ref, computed } from 'vue'
import ThemeRenderer from '@/themes/core/theme-renderer.vue'
import type { ProfileCardData, ProfileCardCanvasSize } from '@/types/profile-card'

const props = defineProps<{
  data: ProfileCardData
  themeId: string
}>()

const previewRootRef = ref<HTMLElement | null>(null)

const canvasSizeStyle = computed<Partial<Record<string, string>>>(() => {
  const size: ProfileCardCanvasSize = props.data.preferences.canvasSize
  if (size === 'square') return { aspectRatio: '1 / 1' }
  if (size === 'portrait') return { aspectRatio: '4 / 5' }
  if (size === 'landscape') return { aspectRatio: '16 / 9' }
  return {}
})

function getExportRoot(): HTMLElement | null {
  return previewRootRef.value
}

defineExpose({ getExportRoot })
</script>

<template>
  <section class="studio-preview">
    <div class="studio-preview__canvas">
      <div
        ref="previewRootRef"
        class="studio-preview__frame"
        :style="canvasSizeStyle"
        data-export-root="profile-card"
      >
        <ThemeRenderer :data="data" :theme-id="themeId" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.studio-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 32px 24px;
  background: #f1f5f9;
  min-height: 100%;
  overflow-y: auto;
}

.studio-preview__canvas {
  width: 100%;
  max-width: 480px;
}

.studio-preview__frame {
  width: 100%;
  background: #f7fafc;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 48px rgba(59, 130, 246, 0.1);
}
</style>
