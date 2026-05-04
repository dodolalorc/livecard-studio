<script setup lang="ts">
import { ref, computed } from 'vue'
import ThemePicker from './theme-picker.vue'
import ThemeRenderer from '@/themes/core/theme-renderer.vue'
import { profileCardThemes } from '@/themes/core/theme-registry'
import type { ProfileCardData, ProfileCardCanvasSize } from '@/types/profile-card'

const props = defineProps<{
  data: ProfileCardData
  themeId: string
}>()

const emit = defineEmits<{
  'update:themeId': [value: string]
}>()

const previewRootRef = ref<HTMLElement | null>(null)
const themeSearch = ref('')

const filteredThemes = computed(() => {
  const keyword = themeSearch.value.trim().toLowerCase()
  if (!keyword) return profileCardThemes
  return profileCardThemes.filter((theme) => {
    const inName = theme.name.toLowerCase().includes(keyword)
    const inDesc = theme.description.toLowerCase().includes(keyword)
    const inTags = theme.tags.some((tag) => tag.toLowerCase().includes(keyword))
    return inName || inDesc || inTags
  })
})

const canvasSizeClass = computed(() => {
  const size: ProfileCardCanvasSize = props.data.preferences.canvasSize
  if (size === 'square') return 'studio-preview__size--square'
  if (size === 'landscape') return 'studio-preview__size--landscape'
  return 'studio-preview__size--portrait'
})

function getExportRoot(): HTMLElement | null {
  return previewRootRef.value
}

function selectTheme(themeId: string) {
  emit('update:themeId', themeId)
}

function handleThemePickerUpdate(value: ProfileCardData['preferences']) {
  emit('update:themeId', value.themeId)
}

defineExpose({ getExportRoot })
</script>

<template>
  <section class="studio-preview">
    <div class="studio-preview__canvas-scroll">
      <div class="studio-preview__canvas">
        <div
          ref="previewRootRef"
          class="studio-preview__frame"
          :class="canvasSizeClass"
          data-export-root="profile-card"
        >
          <ThemeRenderer :data="data" :theme-id="themeId" />
        </div>
      </div>
    </div>

    <section class="studio-preview__theme-strip">
      <header class="studio-preview__theme-strip-head">
        <label class="studio-preview__search-wrap">
          <input
            v-model="themeSearch"
            type="search"
            class="studio-preview__search"
            placeholder="按主题名/标签搜索"
            aria-label="搜索主题"
          />
        </label>

        <ThemePicker
          :model-value="data.preferences"
          @update:model-value="handleThemePickerUpdate"
        />
      </header>

      <div class="studio-preview__theme-grid" role="list" aria-label="主题预览列表">
        <button
          v-for="theme in filteredThemes"
          :key="theme.id"
          class="studio-preview__theme-card"
          :class="{ 'studio-preview__theme-card--active': theme.id === themeId }"
          type="button"
          role="listitem"
          @click="selectTheme(theme.id)"
        >
          <div class="studio-preview__theme-thumb" :class="canvasSizeClass">
            <div class="studio-preview__theme-thumb-inner" :class="canvasSizeClass">
              <ThemeRenderer :data="data" :theme-id="theme.id" />
            </div>
          </div>
          <div class="studio-preview__theme-meta">
            <strong class="studio-preview__theme-name">{{ theme.name }}</strong>
            <span class="studio-preview__theme-desc">{{ theme.description }}</span>
          </div>
        </button>

        <p v-if="filteredThemes.length === 0" class="studio-preview__empty">没有匹配的主题</p>
      </div>
    </section>
  </section>
</template>

<style scoped>
.studio-preview {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  background: #f1f5f9;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.studio-preview__canvas-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 32px 24px 16px;
}

.studio-preview__canvas {
  width: 100%;
  display: flex;
  justify-content: center;
}

.studio-preview__frame {
  width: 520px;
  max-width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 8px 48px rgba(59, 130, 246, 0.1);
}

.studio-preview__frame.studio-preview__size--square {
  width: 520px;
}

.studio-preview__frame.studio-preview__size--portrait {
  width: 520px;
}

.studio-preview__frame.studio-preview__size--landscape {
  width: 560px;
}

.studio-preview__theme-strip {
  width: calc(100% - 48px);
  margin: 0 24px 20px;
  flex-shrink: 0;
  position: sticky;
  bottom: 12px;
  z-index: 8;
  background: #ffffff;
  border: 1px solid #dce7f5;
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.07);
}

.studio-preview__theme-strip-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.studio-preview__search-wrap {
  display: block;
  width: min(360px, 100%);
}

.studio-preview__search {
  width: 100%;
  border: 1px solid #cdd9ea;
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 13px;
  outline: none;
  color: #23314a;
  background: #f8fbff;
}

.studio-preview__search:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16);
}

.studio-preview__theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 188px);
  justify-content: center;
  gap: 12px;
}

.studio-preview__theme-card {
  width: 188px;
  height: 192px;
  border: 1px solid #dbe8f7;
  border-radius: 12px;
  background: #fbfdff;
  padding: 8px;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition:
    transform 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;
}

.studio-preview__theme-card:hover {
  transform: translateY(-2px);
  border-color: #aac5ee;
  box-shadow: 0 8px 22px rgba(37, 99, 235, 0.14);
}

.studio-preview__theme-card--active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  background: #eef6ff;
}

.studio-preview__theme-thumb {
  width: 160px;
  height: 104px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #dbe8f7;
  background: #f6f9ff;
}

.studio-preview__theme-thumb.studio-preview__size--square {
  width: 160px;
  height: 104px;
}

.studio-preview__theme-thumb.studio-preview__size--portrait {
  width: 160px;
  height: 104px;
}

.studio-preview__theme-thumb.studio-preview__size--landscape {
  width: 160px;
  height: 104px;
}

.studio-preview__theme-thumb-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 520px;
  height: 650px;
  transform: scale(0.3077);
  transform-origin: top left;
  will-change: transform;
  pointer-events: none;
  user-select: none;
}

.studio-preview__theme-thumb-inner.studio-preview__size--square {
  width: 520px;
  height: 520px;
  transform: scale(0.3077);
}

.studio-preview__theme-thumb-inner.studio-preview__size--portrait {
  width: 520px;
  height: 650px;
  transform: scale(0.3077);
}

.studio-preview__theme-thumb-inner.studio-preview__size--landscape {
  width: 560px;
  height: 315px;
  transform: scale(0.3302);
}

.studio-preview__theme-thumb-inner :deep(article) {
  margin: 0 !important;
}

.studio-preview__theme-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.studio-preview__theme-name {
  font-size: 12px;
  color: #13233c;
}

.studio-preview__theme-desc {
  font-size: 11px;
  color: #5d6f8a;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.studio-preview__empty {
  margin: 0;
  color: #70829e;
  font-size: 13px;
}

@media (max-width: 760px) {
  .studio-preview {
    gap: 0;
  }

  .studio-preview__canvas-scroll {
    padding: 20px 12px 12px;
  }

  .studio-preview__frame {
    width: min(100%, 520px) !important;
  }

  .studio-preview__theme-strip {
    width: calc(100% - 24px);
    margin: 0 12px 12px;
    bottom: 8px;
  }

  .studio-preview__theme-strip-head {
    flex-direction: column;
    align-items: stretch;
  }

  .studio-preview__search-wrap {
    width: 100%;
  }

  .studio-preview__theme-grid {
    grid-template-columns: repeat(2, 188px);
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 4px;
  }
}
</style>
