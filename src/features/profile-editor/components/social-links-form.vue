<script setup lang="ts">
import type { ProfileSocials } from '@/types/profile-card'

const props = defineProps<{
  modelValue: ProfileSocials
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProfileSocials]
}>()

function update<K extends keyof ProfileSocials>(key: K, value: string) {
  emit('update:modelValue', { ...props.modelValue, [key]: value || undefined })
}

const fields: Array<{ key: keyof ProfileSocials; label: string; placeholder: string }> = [
  { key: 'github', label: 'GitHub', placeholder: 'username 或完整 URL' },
  { key: 'twitter', label: 'X / Twitter', placeholder: 'username 或完整 URL' },
  { key: 'blog', label: '博客', placeholder: 'https://your-blog.dev' },
  { key: 'bilibili', label: 'Bilibili', placeholder: 'UID 或完整主页 URL' },
  { key: 'zhihu', label: '知乎', placeholder: 'username 或完整 URL' },
  { key: 'juejin', label: '掘金', placeholder: 'userId 或完整 URL' },
  { key: 'xiaohongshu', label: '小红书', placeholder: '用户 ID 或完整 URL' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'username 或完整 URL' },
  { key: 'website', label: '个人网站', placeholder: 'https://your-site.com' },
]
</script>

<template>
  <div class="form-section">
    <p class="form-desc">可以填用户名，保存后自动转为完整链接。空字段不在卡片中显示。</p>
    <div v-for="field in fields" :key="field.key" class="form-group">
      <label class="form-label">{{ field.label }}</label>
      <input
        class="form-input"
        type="text"
        :value="modelValue[field.key] ?? ''"
        :placeholder="field.placeholder"
        @input="update(field.key, ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<style scoped>
@import '../styles/form-shared.css';

.form-desc {
  margin: 0 0 4px;
  font-size: 12px;
  color: #94a3b8;
}
</style>
