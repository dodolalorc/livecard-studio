<script setup lang="ts">
import type { ProfileCardThemeProps } from '@/themes/core/theme-types'

const props = defineProps<ProfileCardThemeProps>()

const { data } = props

function avatarInitials(nickname: string): string {
  return nickname.trim().charAt(0).toUpperCase() || '?'
}

const socialLinks = [
  { key: 'github', label: 'GitHub', icon: '⌥' },
  { key: 'twitter', label: 'X / Twitter', icon: '𝕏' },
  { key: 'blog', label: 'Blog', icon: '✏' },
  { key: 'bilibili', label: 'Bilibili', icon: '▶' },
  { key: 'zhihu', label: '知乎', icon: '知' },
  { key: 'juejin', label: '掘金', icon: '⛏' },
  { key: 'xiaohongshu', label: '小红书', icon: '📕' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { key: 'website', label: '网站', icon: '🌐' },
] as const
</script>

<template>
  <article class="mc-card">
    <!-- Header: avatar + name + title + location -->
    <header class="mc-header">
      <div class="mc-avatar">
        <img
          v-if="data.avatar.url"
          :src="data.avatar.url"
          :alt="data.avatar.alt || data.basic.nickname"
          :class="`mc-avatar__img mc-avatar__img--${data.avatar.shape ?? 'circle'}`"
        />
        <div v-else class="mc-avatar__placeholder">
          {{ avatarInitials(data.basic.nickname) }}
        </div>
      </div>

      <div class="mc-identity">
        <h1 class="mc-identity__name">{{ data.basic.nickname }}</h1>
        <p v-if="data.basic.title" class="mc-identity__title">{{ data.basic.title }}</p>
        <div class="mc-identity__meta">
          <span v-if="data.basic.location">📍 {{ data.basic.location }}</span>
          <span v-if="data.basic.openToWork" class="mc-badge mc-badge--open">Open to Work</span>
        </div>
      </div>
    </header>

    <!-- Short intro -->
    <p v-if="data.intro.shortIntro" class="mc-intro">{{ data.intro.shortIntro }}</p>

    <!-- Social links -->
    <nav v-if="Object.values(data.socials).some(Boolean)" class="mc-socials">
      <template v-for="social in socialLinks" :key="social.key">
        <a
          v-if="data.socials[social.key]"
          :href="data.socials[social.key]"
          target="_blank"
          rel="noreferrer noopener"
          class="mc-socials__link"
          :title="social.label"
        >
          <span class="mc-socials__icon">{{ social.icon }}</span>
          <span>{{ social.label }}</span>
        </a>
      </template>
    </nav>

    <!-- Custom links -->
    <nav v-if="data.links.length" class="mc-custom-links">
      <a
        v-for="link in data.links"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noreferrer noopener"
        class="mc-socials__link"
        :title="link.description"
      >
        <span v-if="link.icon" class="mc-socials__icon">{{ link.icon }}</span>
        <span>{{ link.label }}</span>
      </a>
    </nav>

    <!-- Tech stacks -->
    <section v-if="data.tech.stacks.length" class="mc-tech">
      <div class="mc-tech__pills">
        <span v-for="stack in data.tech.stacks" :key="stack" class="mc-pill mc-pill--tech">
          {{ stack }}
        </span>
      </div>
    </section>

    <!-- Tags -->
    <section v-if="data.tech.tags.length || data.tech.focusAreas.length" class="mc-tags">
      <span
        v-for="tag in [...data.tech.focusAreas, ...data.tech.tags]"
        :key="tag"
        class="mc-pill mc-pill--tag"
      >
        {{ tag }}
      </span>
    </section>

    <!-- Motto -->
    <footer v-if="data.intro.motto" class="mc-motto">
      <q>{{ data.intro.motto }}</q>
    </footer>
  </article>
</template>

<style scoped>
.mc-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  color: #172033;
  font-family: -apple-system, 'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 4px 24px rgba(59, 130, 246, 0.06);
  width: 100%;
  box-sizing: border-box;
}

/* Header */
.mc-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mc-avatar {
  flex-shrink: 0;
}

.mc-avatar__img {
  width: 68px;
  height: 68px;
  object-fit: cover;
  display: block;
}

.mc-avatar__img--circle {
  border-radius: 50%;
}
.mc-avatar__img--rounded {
  border-radius: 12px;
}
.mc-avatar__img--square {
  border-radius: 4px;
}

.mc-avatar__placeholder {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #eff6ff;
  color: #3b82f6;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mc-identity__name {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #172033;
  line-height: 1.2;
}

.mc-identity__title {
  margin: 4px 0 0;
  font-size: 13px;
  color: #64748b;
}

.mc-identity__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
  flex-wrap: wrap;
}

.mc-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
}

.mc-badge--open {
  background: #d1fae5;
  color: #065f46;
}

/* Intro */
.mc-intro {
  margin: 0;
  color: #334155;
  font-size: 14px;
  border-left: 3px solid #3b82f6;
  padding-left: 12px;
}

/* Socials */
.mc-socials,
.mc-custom-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mc-socials__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 100px;
  color: #334155;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.15s;
}

.mc-socials__link:hover {
  background: #eff6ff;
  color: #3b82f6;
}

.mc-socials__icon {
  font-size: 12px;
  line-height: 1;
}

/* Tech & Tags */
.mc-tech,
.mc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mc-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.mc-pill--tech {
  background: #eff6ff;
  color: #3b82f6;
}

.mc-pill--tag {
  background: #f1f5f9;
  color: #64748b;
}

/* Motto */
.mc-motto {
  font-size: 12px;
  color: #94a3b8;
  font-style: italic;
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
}

.mc-motto q {
  quotes: none;
}
</style>
