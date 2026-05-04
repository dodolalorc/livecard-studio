<script setup lang="ts">
import { ref } from 'vue'
import type { ProfileCardData } from '@/types/profile-card'
import BasicInfoForm from '@/features/profile-editor/components/basic-info-form.vue'
import AvatarForm from '@/features/profile-editor/components/avatar-form.vue'
import BackgroundImageForm from '@/features/profile-editor/components/background-image-form.vue'
import IntroForm from '@/features/profile-editor/components/intro-form.vue'
import SocialLinksForm from '@/features/profile-editor/components/social-links-form.vue'
import TechStackForm from '@/features/profile-editor/components/tech-stack-form.vue'
import CustomLinksForm from '@/features/profile-editor/components/custom-links-form.vue'
import { normalizeSocials } from '@/features/profile-editor/utils/normalizeProfileCardData'

const props = defineProps<{
  modelValue: ProfileCardData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ProfileCardData]
}>()

const activeTab = ref<'basic' | 'avatar' | 'intro' | 'social' | 'tech' | 'links'>('basic')

const tabs = [
  { key: 'basic', label: '基础信息' },
  { key: 'avatar', label: '头像简介' },
  { key: 'intro', label: '介绍' },
  { key: 'social', label: '社交链接' },
  { key: 'tech', label: '技术栈' },
  { key: 'links', label: '自定义链接' },
] as const

function updateBasic(val: ProfileCardData['basic']) {
  emit('update:modelValue', { ...props.modelValue, basic: val })
}

function updateAvatar(val: ProfileCardData['avatar']) {
  emit('update:modelValue', { ...props.modelValue, avatar: val })
}

function updateIntro(val: ProfileCardData['intro']) {
  emit('update:modelValue', { ...props.modelValue, intro: val })
}

function updateSocials(val: ProfileCardData['socials']) {
  emit('update:modelValue', { ...props.modelValue, socials: normalizeSocials(val) })
}

function updateTech(val: ProfileCardData['tech']) {
  emit('update:modelValue', { ...props.modelValue, tech: val })
}

function updateLinks(val: ProfileCardData['links']) {
  emit('update:modelValue', { ...props.modelValue, links: val })
}

function updatePreferences(val: ProfileCardData['preferences']) {
  emit('update:modelValue', { ...props.modelValue, preferences: val })
}
</script>

<template>
  <aside class="studio-sidebar">
    <nav class="sidebar-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="sidebar-tab"
        :class="{ 'sidebar-tab--active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div class="sidebar-body">
      <BasicInfoForm
        v-if="activeTab === 'basic'"
        :model-value="modelValue.basic"
        @update:model-value="updateBasic"
      />
      <template v-else-if="activeTab === 'avatar'">
        <AvatarForm :model-value="modelValue.avatar" @update:model-value="updateAvatar" />
        <BackgroundImageForm
          :model-value="modelValue.preferences"
          @update:model-value="updatePreferences"
        />
        <IntroForm
          :model-value="modelValue.intro"
          @update:model-value="updateIntro"
          style="margin-top: 20px"
        />
      </template>
      <IntroForm
        v-else-if="activeTab === 'intro'"
        :model-value="modelValue.intro"
        @update:model-value="updateIntro"
      />
      <SocialLinksForm
        v-else-if="activeTab === 'social'"
        :model-value="modelValue.socials"
        @update:model-value="updateSocials"
      />
      <TechStackForm
        v-else-if="activeTab === 'tech'"
        :model-value="modelValue.tech"
        @update:model-value="updateTech"
      />
      <CustomLinksForm
        v-else-if="activeTab === 'links'"
        :model-value="modelValue.links"
        @update:model-value="updateLinks"
      />
    </div>
  </aside>
</template>

<style scoped>
.studio-sidebar {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  height: 100%;
  overflow: hidden;
}

.sidebar-tabs {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
  scrollbar-width: none;
}

.sidebar-tabs::-webkit-scrollbar {
  display: none;
}

.sidebar-tab {
  padding: 10px 14px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.12s;
}

.sidebar-tab:hover {
  color: #334155;
}

.sidebar-tab--active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
}
</style>
