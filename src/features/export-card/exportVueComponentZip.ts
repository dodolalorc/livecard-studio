/**
 * exportVueComponentZip.ts
 * 导出当前卡片为可复用 Vue Component zip 包。
 */

import JSZip from 'jszip'
import type { ProfileCardData } from '@/types/profile-card'
import { format } from './exportUtils'

export async function exportVueComponentZip(data: ProfileCardData): Promise<void> {
    const zip = new JSZip()
    const folder = zip.folder('livecard-vue-component')!

    folder.file('README.md', buildReadme())
    folder.file('profile-card.types.ts', buildTypes())
    folder.file('sample-data.ts', buildSampleData(data))
    folder.file('ProfileCard.vue', buildProfileCardVue())
    folder.file('usage-example.vue', buildUsageExample())

    const blob = await zip.generateAsync({ type: 'blob' })
    downloadBlob(blob, `livecard-vue-${data.basic.nickname}-${format(new Date())}.zip`)
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

function buildReadme(): string {
    return `# LiveCard Vue Component

## 安装

将 \`livecard-vue-component/\` 目录复制到你的 Vue 项目中。

## 使用

\`\`\`vue
<script setup lang="ts">
import ProfileCard from './ProfileCard.vue'
import { sampleData } from './sample-data'
</script>

<template>
  <ProfileCard :data="sampleData" />
</template>
\`\`\`

## Props

| Prop | 类型 | 描述 |
|------|------|------|
| data | ProfileCardData | 个人介绍数据（见 profile-card.types.ts） |
| exportMode | boolean? | 导出模式（隐藏交互态辅助 UI） |

## 注意事项

- 组件内联了样式，无需额外 CSS 依赖。
- 修改数据后组件会自动更新。
- 空字段不会显示对应区域。
`
}

function buildTypes(): string {
    return `// profile-card.types.ts — 由 LiveCard Studio 导出

export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | 'custom'

export interface ProfileCardData {
  id: string
  basic: ProfileBasicInfo
  avatar: ProfileAvatar
  intro: ProfileIntro
  contacts: ProfileContacts
  socials: ProfileSocials
  tech: ProfileTech
  links: ProfileCustomLink[]
  preferences: ProfileCardPreferences
}

export interface ProfileBasicInfo {
  nickname: string
  realName?: string
  gender?: Gender
  customGender?: string
  age?: number
  title?: string
  location?: string
  company?: string
  school?: string
  yearsOfExperience?: number
  openToWork?: boolean
}

export interface ProfileAvatar {
  url?: string
  alt?: string
  shape?: 'circle' | 'rounded' | 'square'
}

export interface ProfileIntro {
  shortIntro: string
  longIntro?: string
  motto?: string
}

export interface ProfileContacts {
  email?: string
  phone?: string
  wechat?: string
  telegram?: string
}

export interface ProfileSocials {
  github?: string
  twitter?: string
  blog?: string
  bilibili?: string
  xiaohongshu?: string
  zhihu?: string
  juejin?: string
  linkedin?: string
  website?: string
}

export interface ProfileTech {
  stacks: string[]
  focusAreas: string[]
  tags: string[]
}

export interface ProfileCustomLink {
  id: string
  label: string
  url: string
  icon?: string
  description?: string
}

export interface ProfileCardPreferences {
  themeId: string
  accentColor?: string
  canvasSize: 'square' | 'portrait' | 'landscape' | 'auto'
  exportScale: number
}
`
}

function buildSampleData(data: ProfileCardData): string {
    return `// sample-data.ts — 由 LiveCard Studio 导出，包含你当前的卡片数据

import type { ProfileCardData } from './profile-card.types'

export const sampleData: ProfileCardData = ${JSON.stringify(data, null, 2)}
`
}

function buildProfileCardVue(): string {
    return `<script setup lang="ts">
import type { ProfileCardData } from './profile-card.types'

defineProps<{
  data: ProfileCardData
  exportMode?: boolean
}>()

const socialLinks = [
  { key: 'github', label: 'GitHub' },
  { key: 'twitter', label: 'Twitter' },
  { key: 'blog', label: 'Blog' },
  { key: 'bilibili', label: 'Bilibili' },
  { key: 'zhihu', label: '知乎' },
  { key: 'juejin', label: '掘金' },
  { key: 'xiaohongshu', label: '小红书' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'website', label: '网站' },
] as const

function initials(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?'
}
<\/script>

<template>
  <article style="display:flex;flex-direction:column;gap:16px;padding:28px 24px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;color:#172033;font-family:-apple-system,'Inter','PingFang SC',sans-serif;font-size:14px;box-shadow:0 4px 24px rgba(59,130,246,0.06);">
    <header style="display:flex;align-items:center;gap:16px;">
      <img v-if="data.avatar.url" :src="data.avatar.url" :alt="data.avatar.alt || data.basic.nickname" style="width:68px;height:68px;border-radius:50%;object-fit:cover;" />
      <div v-else style="width:68px;height:68px;border-radius:50%;background:#eff6ff;color:#3b82f6;font-size:28px;font-weight:700;display:flex;align-items:center;justify-content:center;">{{ initials(data.basic.nickname) }}</div>
      <div>
        <h1 style="margin:0;font-size:22px;font-weight:700;">{{ data.basic.nickname }}</h1>
        <p v-if="data.basic.title" style="margin:4px 0 0;font-size:13px;color:#64748b;">{{ data.basic.title }}</p>
        <div style="display:flex;gap:8px;margin-top:6px;font-size:12px;color:#64748b;flex-wrap:wrap;">
          <span v-if="data.basic.location">📍 {{ data.basic.location }}</span>
          <span v-if="data.basic.openToWork" style="background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:100px;font-weight:600;">Open to Work</span>
        </div>
      </div>
    </header>

    <p v-if="data.intro.shortIntro" style="margin:0;color:#334155;border-left:3px solid #3b82f6;padding-left:12px;">{{ data.intro.shortIntro }}</p>

    <nav v-if="Object.values(data.socials).some(Boolean)" style="display:flex;flex-wrap:wrap;gap:8px;">
      <template v-for="s in socialLinks" :key="s.key">
        <a v-if="data.socials[s.key]" :href="data.socials[s.key]" target="_blank" rel="noreferrer" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#f1f5f9;border-radius:100px;color:#334155;text-decoration:none;font-size:12px;font-weight:500;">{{ s.label }}</a>
      </template>
    </nav>

    <div v-if="data.tech.stacks.length" style="display:flex;flex-wrap:wrap;gap:6px;">
      <span v-for="stack in data.tech.stacks" :key="stack" style="padding:3px 10px;background:#eff6ff;color:#3b82f6;border-radius:100px;font-size:12px;font-weight:500;">{{ stack }}</span>
    </div>

    <p v-if="data.intro.motto" style="font-size:12px;color:#94a3b8;font-style:italic;border-top:1px solid #e2e8f0;padding-top:12px;margin:0;">{{ data.intro.motto }}</p>
  </article>
</template>
`
}

function buildUsageExample(): string {
    return `<script setup lang="ts">
import ProfileCard from './ProfileCard.vue'
import { sampleData } from './sample-data'
<\/script>

<template>
  <div style="padding: 40px; background: #f1f5f9; min-height: 100vh; display: flex; justify-content: center;">
    <div style="width: 100%; max-width: 480px;">
      <ProfileCard :data="sampleData" />
    </div>
  </div>
</template>
`
}
