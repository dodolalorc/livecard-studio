<script setup lang="ts">
import type { ProfileCardPreferences, ProfileCardBackgroundCoverage } from '@/types/profile-card'

const props = defineProps<{
  modelValue: ProfileCardPreferences
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProfileCardPreferences]
}>()

function updateBackground(
  key: keyof ProfileCardPreferences['backgroundImage'],
  value: ProfileCardPreferences['backgroundImage'][typeof key],
) {
  emit('update:modelValue', {
    ...props.modelValue,
    backgroundImage: {
      ...props.modelValue.backgroundImage,
      [key]: value,
    },
  })
}

function updateCoverage(coverage: ProfileCardBackgroundCoverage) {
  updateBackground('coverage', coverage)
}
</script>

<template>
  <div class="form-section bg-settings">
    <div class="form-group form-group--checkbox">
      <label class="form-label-check">
        <input
          type="checkbox"
          :checked="modelValue.backgroundImage.enabled"
          @change="updateBackground('enabled', ($event.target as HTMLInputElement).checked)"
        />
        <span>启用背景图片</span>
      </label>
    </div>

    <template v-if="modelValue.backgroundImage.enabled">
      <div class="form-group">
        <label class="form-label">背景图 URL</label>
        <input
          class="form-input"
          type="url"
          :value="modelValue.backgroundImage.url ?? ''"
          placeholder="https://images.unsplash.com/..."
          @input="updateBackground('url', ($event.target as HTMLInputElement).value || '')"
        />
        <span class="form-hint form-hint--left">建议使用高分辨率横图，主题会自动叠加景深遮罩</span>
      </div>

      <div class="form-group">
        <label class="form-label">覆盖范围</label>
        <div class="form-radio-group">
          <label class="form-radio">
            <input
              type="radio"
              value="header"
              :checked="modelValue.backgroundImage.coverage === 'header'"
              @change="updateCoverage('header')"
            />
            <span>仅信息栏背后</span>
          </label>
          <label class="form-radio">
            <input
              type="radio"
              value="card"
              :checked="modelValue.backgroundImage.coverage === 'card'"
              @change="updateCoverage('card')"
            />
            <span>整张卡片背景</span>
          </label>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import '../styles/form-shared.css';

.bg-settings {
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px dashed #d9e3f0;
}

.form-radio-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-radio {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
}

.form-radio input {
  accent-color: #3b82f6;
}

.form-hint--left {
  text-align: left;
}
</style>
