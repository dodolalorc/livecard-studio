<script setup lang="ts">
import { ref } from 'vue'
import type { ProfileTech, ProfileTechStackDisplayMode } from '@/types/profile-card'

const props = defineProps<{
  modelValue: ProfileTech
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProfileTech]
}>()

const stackInput = ref('')
const focusInput = ref('')
const tagInput = ref('')

function addToField(field: keyof ProfileTech, val: string, clearFn: () => void) {
  const trimmed = val.trim().slice(0, 24)
  if (!trimmed) return
  const current = props.modelValue[field] as string[]
  if (current.length >= 16) return
  if (!current.includes(trimmed)) {
    emit('update:modelValue', { ...props.modelValue, [field]: [...current, trimmed] })
  }
  clearFn()
}

function addStack() {
  addToField('stacks', stackInput.value, () => {
    stackInput.value = ''
  })
}
function addFocus() {
  addToField('focusAreas', focusInput.value, () => {
    focusInput.value = ''
  })
}
function addTag() {
  addToField('tags', tagInput.value, () => {
    tagInput.value = ''
  })
}

function removeFromField(field: keyof ProfileTech, tag: string) {
  const current = props.modelValue[field] as string[]
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: current.filter((t) => t !== tag),
  })
}

function onStackKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addStack()
  } else if (event.key === 'Backspace' && !stackInput.value) removeLastOf('stacks')
}
function onFocusKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addFocus()
  } else if (event.key === 'Backspace' && !focusInput.value) removeLastOf('focusAreas')
}
function onTagKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addTag()
  } else if (event.key === 'Backspace' && !tagInput.value) removeLastOf('tags')
}

function removeLastOf(field: keyof ProfileTech) {
  const current = props.modelValue[field] as string[]
  if (current.length > 0) {
    emit('update:modelValue', { ...props.modelValue, [field]: current.slice(0, -1) })
  }
}

function updateDisplayMode(mode: ProfileTechStackDisplayMode) {
  emit('update:modelValue', {
    ...props.modelValue,
    stackDisplayMode: mode,
  })
}
</script>

<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label">技术栈展示方式</label>
      <div class="display-mode-switch">
        <button
          type="button"
          class="display-mode-switch__btn"
          :class="{ 'display-mode-switch__btn--active': modelValue.stackDisplayMode !== 'icon' }"
          @click="updateDisplayMode('tag')"
        >
          Tag 模式
        </button>
        <button
          type="button"
          class="display-mode-switch__btn"
          :class="{ 'display-mode-switch__btn--active': modelValue.stackDisplayMode === 'icon' }"
          @click="updateDisplayMode('icon')"
        >
          Skill Icons 模式
        </button>
      </div>
      <span class="form-hint form-hint--left">
        图标模式会根据技术栈名称生成 skillicons.dev 图标
      </span>
    </div>

    <!-- Tech stacks -->
    <div class="form-group">
      <label class="form-label">技术栈</label>
      <div class="tag-input-wrapper" @click="($refs.stackField as HTMLInputElement)?.focus()">
        <span v-for="stack in modelValue.stacks" :key="stack" class="tag-pill">
          {{ stack }}
          <button class="tag-pill__remove" @click.stop="removeFromField('stacks', stack)">×</button>
        </span>
        <input
          ref="stackField"
          v-model="stackInput"
          class="tag-input-field"
          placeholder="回车添加，如 Vue"
          @keydown="onStackKeydown($event)"
        />
      </div>
      <span class="form-hint">{{ modelValue.stacks.length }}/16 · 回车或逗号确认</span>
    </div>

    <!-- Focus areas -->
    <div class="form-group">
      <label class="form-label">关注方向</label>
      <div class="tag-input-wrapper" @click="($refs.focusField as HTMLInputElement)?.focus()">
        <span v-for="area in modelValue.focusAreas" :key="area" class="tag-pill tag-pill--focus">
          {{ area }}
          <button class="tag-pill__remove" @click.stop="removeFromField('focusAreas', area)">
            ×
          </button>
        </span>
        <input
          ref="focusField"
          v-model="focusInput"
          class="tag-input-field"
          placeholder="如：前端工程化"
          @keydown="onFocusKeydown($event)"
        />
      </div>
      <span class="form-hint">{{ modelValue.focusAreas.length }}/16</span>
    </div>

    <!-- Tags -->
    <div class="form-group">
      <label class="form-label">个人标签</label>
      <div class="tag-input-wrapper" @click="($refs.tagField as HTMLInputElement)?.focus()">
        <span v-for="tag in modelValue.tags" :key="tag" class="tag-pill tag-pill--tag">
          {{ tag }}
          <button class="tag-pill__remove" @click.stop="removeFromField('tags', tag)">×</button>
        </span>
        <input
          ref="tagField"
          v-model="tagInput"
          class="tag-input-field"
          placeholder="如：独立开发者"
          @keydown="onTagKeydown($event)"
        />
      </div>
      <span class="form-hint">{{ modelValue.tags.length }}/16</span>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/form-shared.css';

.tag-pill--focus {
  background: #f0fdf4;
  color: #166534;
}

.tag-pill--tag {
  background: #f1f5f9;
  color: #64748b;
}

.display-mode-switch {
  display: inline-flex;
  border: 1px solid #dbe5f2;
  border-radius: 10px;
  overflow: hidden;
  background: #f8fbff;
  width: fit-content;
}

.display-mode-switch__btn {
  border: none;
  background: transparent;
  padding: 7px 12px;
  font-size: 12px;
  color: #51627d;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s;
}

.display-mode-switch__btn--active {
  background: #3b82f6;
  color: #ffffff;
}

.form-hint--left {
  text-align: left;
}
</style>
