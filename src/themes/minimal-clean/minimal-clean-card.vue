<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { ProfileCardThemeProps } from '@/themes/core/theme-types'
import { buildSkillIconsUrl } from '@/themes/core/skill-icons'

const props = defineProps<ProfileCardThemeProps>()
const data = toRef(props, 'data')

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

const skillIconsUrl = computed(() => buildSkillIconsUrl(data.value.tech.stacks))
const useSkillIcons = computed(
  () => data.value.tech.stackDisplayMode === 'icon' && Boolean(skillIconsUrl.value),
)

const hasBackgroundImage = computed(
  () =>
    data.value.preferences.backgroundImage.enabled &&
    Boolean(data.value.preferences.backgroundImage.url?.trim()),
)

const useCardBackground = computed(
  () => hasBackgroundImage.value && data.value.preferences.backgroundImage.coverage === 'card',
)

const useHeaderBackground = computed(
  () => hasBackgroundImage.value && data.value.preferences.backgroundImage.coverage === 'header',
)

const cardStyle = computed(() => {
  if (!useCardBackground.value) return {}
  return {
    '--mc-bg-image': `url("${data.value.preferences.backgroundImage.url}")`,
  }
})

const headerStyle = computed(() => {
  if (!useHeaderBackground.value) return {}
  return {
    '--mc-bg-image': `url("${data.value.preferences.backgroundImage.url}")`,
  }
})
</script>

<template>
  <article class="mc-card" :class="{ 'mc-card--bg': useCardBackground }" :style="cardStyle">
    <!-- Header: avatar + name + title + location -->
    <header
      class="mc-header"
      :class="{ 'mc-header--bg': useHeaderBackground, 'mc-header--no-avatar': !data.avatar.url }"
      :style="headerStyle"
    >
      <div v-if="data.avatar.url" class="mc-avatar">
        <img
          :src="data.avatar.url"
          :alt="data.avatar.alt || data.basic.nickname"
          :class="`mc-avatar__img mc-avatar__img--${data.avatar.shape ?? 'circle'}`"
        />
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
      <div v-if="useSkillIcons" class="mc-tech__icons">
        <img :src="skillIconsUrl!" alt="Skill Icons" loading="lazy" referrerpolicy="no-referrer" />
      </div>
      <div v-else class="mc-tech__pills">
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
  gap: 18px;
  padding: 34px 30px;
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
  position: relative;
  isolation: isolate;
}

.mc-card > * {
  position: relative;
  z-index: 1;
}

.mc-card--bg::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(180deg, rgba(16, 23, 42, 0.42), rgba(16, 23, 42, 0.2)), var(--mc-bg-image);
  background-size: cover;
  background-position: center;
}

.mc-card--bg {
  border-color: rgba(214, 224, 235, 0.8);
}

.mc-card--bg .mc-header,
.mc-card--bg .mc-intro,
.mc-card--bg .mc-socials,
.mc-card--bg .mc-custom-links,
.mc-card--bg .mc-tech,
.mc-card--bg .mc-tags,
.mc-card--bg .mc-motto {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 10px 12px;
}

/* Header */
.mc-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mc-header--no-avatar {
  gap: 0;
}

.mc-header--bg {
  background-image:
    linear-gradient(135deg, rgba(14, 28, 58, 0.58), rgba(14, 28, 58, 0.36)), var(--mc-bg-image);
  background-size: cover;
  background-position: center;
  color: #ffffff;
  border-radius: 12px;
  padding: 14px;
}

.mc-header--bg .mc-identity__name,
.mc-header--bg .mc-identity__title,
.mc-header--bg .mc-identity__meta {
  color: #ffffff;
}

.mc-avatar {
  flex-shrink: 0;
}

.mc-avatar__img {
  width: 78px;
  height: 78px;
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

.mc-identity__name {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #172033;
  line-height: 1.2;
}

.mc-identity__title {
  margin: 4px 0 0;
  font-size: 14px;
  color: #64748b;
}

.mc-identity__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  font-size: 13px;
  color: #64748b;
  flex-wrap: wrap;
}

.mc-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
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
  font-size: 15px;
  border-left: 3px solid #3b82f6;
  padding-left: 14px;
}

/* Socials */
.mc-socials,
.mc-custom-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mc-socials__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: #f1f5f9;
  border-radius: 100px;
  color: #334155;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.15s;
}

.mc-socials__link:hover {
  background: #eff6ff;
  color: #3b82f6;
}

.mc-socials__icon {
  font-size: 13px;
  line-height: 1;
}

/* Tech & Tags */
.mc-tech,
.mc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mc-pill {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 13px;
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

.mc-tech__icons {
  display: flex;
  align-items: center;
  width: 100%;
}

.mc-tech__icons img {
  width: 100%;
  max-width: 320px;
  height: auto;
}

/* Motto */
.mc-motto {
  font-size: 13px;
  color: #94a3b8;
  font-style: italic;
  border-top: 1px solid #e2e8f0;
  padding-top: 14px;
}

.mc-motto q {
  quotes: none;
}
</style>
