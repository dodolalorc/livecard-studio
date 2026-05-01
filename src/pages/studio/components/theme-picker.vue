<script setup lang="ts">
import { ref } from 'vue'
import { profileCardThemes } from '@/themes/core/theme-registry'
import type { ProfileCardPreferences } from '@/types/profile-card'

const props = defineProps<{
  modelValue: ProfileCardPreferences
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProfileCardPreferences]
}>()

const open = ref(false)

function selectTheme(themeId: string) {
  emit('update:modelValue', { ...props.modelValue, themeId })
  open.value = false
}
</script>

<template>
  <div class="theme-picker">
    <button class="theme-picker__toggle" @click="open = !open">
      🎨 切换主题
      <span class="theme-picker__current">
        {{ profileCardThemes.find((t) => t.id === modelValue.themeId)?.name ?? modelValue.themeId }}
      </span>
    </button>

    <div v-if="open" class="theme-picker__panel">
      <button
        v-for="theme in profileCardThemes"
        :key="theme.id"
        class="theme-picker__option"
        :class="{ 'theme-picker__option--active': theme.id === modelValue.themeId }"
        @click="selectTheme(theme.id)"
      >
        <span class="theme-picker__name">{{ theme.name }}</span>
        <span class="theme-picker__desc">{{ theme.description }}</span>
        <div class="theme-picker__tags">
          <span v-for="tag in theme.tags" :key="tag" class="theme-picker__tag">{{ tag }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.theme-picker {
  position: relative;
}

.theme-picker__toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: background 0.15s;
}

.theme-picker__toggle:hover {
  background: #e2e8f0;
}

.theme-picker__current {
  color: #3b82f6;
}

.theme-picker__panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 100;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 280px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.theme-picker__option {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.12s;
}

.theme-picker__option:last-child {
  border-bottom: none;
}

.theme-picker__option:hover {
  background: #f8fafc;
}

.theme-picker__option--active {
  background: #eff6ff;
}

.theme-picker__name {
  font-size: 13px;
  font-weight: 700;
  color: #172033;
}

.theme-picker__desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
}

.theme-picker__tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.theme-picker__tag {
  padding: 1px 6px;
  background: #f1f5f9;
  border-radius: 100px;
  font-size: 10px;
  color: #64748b;
}
</style>
