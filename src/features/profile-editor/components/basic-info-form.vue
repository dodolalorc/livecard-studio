<script setup lang="ts">
import type { ProfileBasicInfo, Gender } from '@/types/profile-card'

const props = defineProps<{
  modelValue: ProfileBasicInfo
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProfileBasicInfo]
}>()

function update<K extends keyof ProfileBasicInfo>(key: K, value: ProfileBasicInfo[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '非二元', value: 'non_binary' },
  { label: '不公开', value: 'prefer_not_to_say' },
  { label: '自定义', value: 'custom' },
]
</script>

<template>
  <div class="form-section">
    <div class="form-group">
      <label class="form-label form-label--required">昵称</label>
      <input
        class="form-input"
        type="text"
        :value="modelValue.nickname"
        placeholder="例：Avery Chen"
        maxlength="24"
        @input="update('nickname', ($event.target as HTMLInputElement).value)"
      />
      <span class="form-hint">{{ modelValue.nickname.length }}/24</span>
    </div>

    <div class="form-group">
      <label class="form-label">真实姓名</label>
      <input
        class="form-input"
        type="text"
        :value="modelValue.realName ?? ''"
        placeholder="可选"
        @input="update('realName', ($event.target as HTMLInputElement).value || undefined)"
      />
    </div>

    <div class="form-group">
      <label class="form-label">职业标题</label>
      <input
        class="form-input"
        type="text"
        :value="modelValue.title ?? ''"
        placeholder="例：前端开发工程师 / 独立开发者"
        maxlength="40"
        @input="update('title', ($event.target as HTMLInputElement).value || undefined)"
      />
      <span class="form-hint">{{ (modelValue.title ?? '').length }}/40</span>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">所在地</label>
        <input
          class="form-input"
          type="text"
          :value="modelValue.location ?? ''"
          placeholder="例：上海 · 远程"
          @input="update('location', ($event.target as HTMLInputElement).value || undefined)"
        />
      </div>

      <div class="form-group">
        <label class="form-label">年龄</label>
        <input
          class="form-input"
          type="number"
          :value="modelValue.age ?? ''"
          placeholder="可选"
          min="1"
          max="120"
          @input="
            update(
              'age',
              ($event.target as HTMLInputElement).value
                ? Number(($event.target as HTMLInputElement).value)
                : undefined,
            )
          "
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">公司 / 组织</label>
        <input
          class="form-input"
          type="text"
          :value="modelValue.company ?? ''"
          placeholder="可选"
          @input="update('company', ($event.target as HTMLInputElement).value || undefined)"
        />
      </div>

      <div class="form-group">
        <label class="form-label">工作年限</label>
        <input
          class="form-input"
          type="number"
          :value="modelValue.yearsOfExperience ?? ''"
          placeholder="年"
          min="0"
          max="60"
          @input="
            update(
              'yearsOfExperience',
              ($event.target as HTMLInputElement).value
                ? Number(($event.target as HTMLInputElement).value)
                : undefined,
            )
          "
        />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">学校</label>
      <input
        class="form-input"
        type="text"
        :value="modelValue.school ?? ''"
        placeholder="可选"
        @input="update('school', ($event.target as HTMLInputElement).value || undefined)"
      />
    </div>

    <div class="form-group">
      <label class="form-label">性别</label>
      <select
        class="form-input"
        :value="modelValue.gender ?? ''"
        @change="
          update('gender', (($event.target as HTMLSelectElement).value as Gender) || undefined)
        "
      >
        <option value="">不填写</option>
        <option v-for="opt in genderOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div class="form-group form-group--checkbox">
      <label class="form-label-check">
        <input
          type="checkbox"
          :checked="modelValue.openToWork ?? false"
          @change="update('openToWork', ($event.target as HTMLInputElement).checked)"
        />
        <span>开放合作 / 求职中</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/form-shared.css';
</style>
