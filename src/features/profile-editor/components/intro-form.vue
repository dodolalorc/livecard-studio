<script setup lang="ts">
import type { ProfileIntro } from '@/types/profile-card'

const props = defineProps<{
  modelValue: ProfileIntro
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProfileIntro]
}>()

function update<K extends keyof ProfileIntro>(key: K, value: ProfileIntro[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label">一句话介绍</label>
      <textarea
        class="form-input form-textarea"
        :value="modelValue.shortIntro"
        placeholder="用一句话介绍你自己，让别人快速记住你"
        maxlength="80"
        rows="2"
        @input="update('shortIntro', ($event.target as HTMLTextAreaElement).value)"
      />
      <span class="form-hint">{{ modelValue.shortIntro.length }}/80</span>
    </div>

    <div class="form-group">
      <label class="form-label">长介绍</label>
      <textarea
        class="form-input form-textarea"
        :value="modelValue.longIntro ?? ''"
        placeholder="可选，详细介绍你的经历和方向（240字以内）"
        maxlength="240"
        rows="4"
        @input="update('longIntro', ($event.target as HTMLTextAreaElement).value || undefined)"
      />
      <span class="form-hint">{{ (modelValue.longIntro ?? '').length }}/240</span>
    </div>

    <div class="form-group">
      <label class="form-label">个人 Motto</label>
      <input
        class="form-input"
        type="text"
        :value="modelValue.motto ?? ''"
        placeholder="可选，例：Code with clarity, ship with confidence."
        @input="update('motto', ($event.target as HTMLInputElement).value || undefined)"
      />
    </div>
  </div>
</template>

<style scoped>
@import '../styles/form-shared.css';
</style>
