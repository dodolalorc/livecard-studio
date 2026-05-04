<script setup lang="ts">
import type { ProfileAvatar } from '@/types/profile-card'

const props = defineProps<{
  modelValue: ProfileAvatar
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProfileAvatar]
}>()

function update<K extends keyof ProfileAvatar>(key: K, value: ProfileAvatar[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const shapeOptions = [
  { label: '圆形', value: 'circle' },
  { label: '圆角', value: 'rounded' },
  { label: '方形', value: 'square' },
] as const
</script>

<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label">头像 URL</label>
      <input
        class="form-input"
        type="url"
        :value="modelValue.url ?? ''"
        placeholder="https://avatars.githubusercontent.com/..."
        @input="update('url', ($event.target as HTMLInputElement).value || undefined)"
      />
      <span class="form-hint">输入公开图片链接（GitHub / Unsplash 等）</span>
      <span class="form-hint form-hint--left">留空则不显示头像</span>
    </div>

    <div v-if="modelValue.url" class="avatar-preview">
      <img
        :src="modelValue.url"
        :alt="modelValue.alt ?? '头像预览'"
        :class="`avatar-preview__img avatar-preview__img--${modelValue.shape ?? 'circle'}`"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
    </div>

    <div class="form-group">
      <label class="form-label">头像形状</label>
      <div class="form-radio-group">
        <label v-for="opt in shapeOptions" :key="opt.value" class="form-radio">
          <input
            type="radio"
            :value="opt.value"
            :checked="(modelValue.shape ?? 'circle') === opt.value"
            @change="update('shape', opt.value)"
          />
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">头像 alt 描述</label>
      <input
        class="form-input"
        type="text"
        :value="modelValue.alt ?? ''"
        placeholder="可选，用于无障碍访问"
        @input="update('alt', ($event.target as HTMLInputElement).value || undefined)"
      />
    </div>
  </div>
</template>

<style scoped>
@import '../styles/form-shared.css';

.avatar-preview {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.avatar-preview__img {
  width: 72px;
  height: 72px;
  object-fit: cover;
}

.avatar-preview__img--circle {
  border-radius: 50%;
}
.avatar-preview__img--rounded {
  border-radius: 12px;
}
.avatar-preview__img--square {
  border-radius: 4px;
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
