<script setup lang="ts">
import { ref } from 'vue'
import type { ProfileCustomLink } from '@/types/profile-card'

const props = defineProps<{
  modelValue: ProfileCustomLink[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProfileCustomLink[]]
}>()

const newLink = ref<Omit<ProfileCustomLink, 'id'>>({
  label: '',
  url: '',
  icon: '',
  description: '',
})

function addLink() {
  if (!newLink.value.label.trim() || !newLink.value.url.trim()) return
  if (props.modelValue.length >= 8) return
  const link: ProfileCustomLink = {
    id: `link-${Date.now()}`,
    label: newLink.value.label.trim(),
    url: newLink.value.url.trim(),
    icon: newLink.value.icon?.trim() || undefined,
    description: newLink.value.description?.trim() || undefined,
  }
  emit('update:modelValue', [...props.modelValue, link])
  newLink.value = { label: '', url: '', icon: '', description: '' }
}

function removeLink(id: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((l) => l.id !== id),
  )
}

function updateLink(id: string, key: keyof ProfileCustomLink, value: string) {
  emit(
    'update:modelValue',
    props.modelValue.map((l) => (l.id === id ? { ...l, [key]: value || undefined } : l)),
  )
}
</script>

<template>
  <div class="form-section">
    <p class="form-desc">添加自定义链接：作品集、Newsletter、课程主页、赞助链接等（最多 8 个）。</p>

    <!-- Existing links -->
    <div v-for="link in modelValue" :key="link.id" class="link-card">
      <div class="link-card__row">
        <input
          class="form-input"
          type="text"
          :value="link.icon ?? ''"
          placeholder="图标（emoji）"
          style="width: 60px; flex-shrink: 0"
          @input="updateLink(link.id, 'icon', ($event.target as HTMLInputElement).value)"
        />
        <input
          class="form-input"
          type="text"
          :value="link.label"
          placeholder="标签名"
          @input="updateLink(link.id, 'label', ($event.target as HTMLInputElement).value)"
        />
        <button class="link-card__remove" @click="removeLink(link.id)">×</button>
      </div>
      <input
        class="form-input"
        type="url"
        :value="link.url"
        placeholder="https://..."
        @input="updateLink(link.id, 'url', ($event.target as HTMLInputElement).value)"
      />
      <input
        class="form-input"
        type="text"
        :value="link.description ?? ''"
        placeholder="描述（可选）"
        @input="updateLink(link.id, 'description', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- Add new link -->
    <div v-if="modelValue.length < 8" class="add-link">
      <h4 class="add-link__title">添加新链接</h4>
      <div class="link-card__row">
        <input
          v-model="newLink.icon"
          class="form-input"
          type="text"
          placeholder="🎨"
          style="width: 60px; flex-shrink: 0"
        />
        <input
          v-model="newLink.label"
          class="form-input"
          type="text"
          placeholder="标签名（必填）"
        />
      </div>
      <input v-model="newLink.url" class="form-input" type="url" placeholder="URL（必填）" />
      <input
        v-model="newLink.description"
        class="form-input"
        type="text"
        placeholder="描述（可选）"
      />
      <button
        class="add-link__btn"
        :disabled="!newLink.label.trim() || !newLink.url.trim()"
        @click="addLink"
      >
        + 添加
      </button>
    </div>

    <p v-else class="form-hint">已达到最多 8 个自定义链接</p>
  </div>
</template>

<style scoped>
@import '../styles/form-shared.css';

.form-desc {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}

.link-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.link-card__row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.link-card__remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #94a3b8;
  padding: 0 4px;
  flex-shrink: 0;
}

.link-card__remove:hover {
  color: #ef4444;
}

.add-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
}

.add-link__title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.add-link__btn {
  align-self: flex-start;
  padding: 6px 16px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.add-link__btn:hover:not(:disabled) {
  background: #2563eb;
}

.add-link__btn:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}
</style>
