<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { ProfileCardThemeProps } from '@/themes/core/theme-types'
import { buildSkillIconsUrl } from '@/themes/core/skill-icons'

const props = defineProps<ProfileCardThemeProps>()
const data = toRef(props, 'data')

const socialLinks = [
  { key: 'github', label: 'GitHub' },
  { key: 'blog', label: 'Blog' },
  { key: 'bilibili', label: 'Bilibili' },
  { key: 'xiaohongshu', label: '小红书' },
  { key: 'zhihu', label: '知乎' },
  { key: 'juejin', label: '掘金' },
  { key: 'twitter', label: 'Twitter' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'website', label: '网站' },
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
    '--df-bg-image': `url("${data.value.preferences.backgroundImage.url}")`,
  }
})

const heroStyle = computed(() => {
  if (!useHeaderBackground.value) return {}
  return {
    '--df-bg-image': `url("${data.value.preferences.backgroundImage.url}")`,
  }
})
</script>

<template>
  <article class="df-card" :class="{ 'df-card--bg': useCardBackground }" :style="cardStyle">
    <!-- Gradient hero -->
    <header
      class="df-hero"
      :class="{ 'df-hero--bg': useHeaderBackground, 'df-hero--no-avatar': !data.avatar.url }"
      :style="heroStyle"
    >
      <div v-if="data.avatar.url" class="df-hero__avatar">
        <img
          :src="data.avatar.url"
          :alt="data.avatar.alt || data.basic.nickname"
          :class="`df-avatar__img df-avatar__img--${data.avatar.shape ?? 'circle'}`"
        />
      </div>

      <div class="df-hero__info">
        <h1 class="df-hero__name">{{ data.basic.nickname }}</h1>
        <p v-if="data.basic.title" class="df-hero__title">{{ data.basic.title }}</p>
        <div class="df-hero__meta">
          <span v-if="data.basic.location">📍 {{ data.basic.location }}</span>
          <span v-if="data.basic.company">🏢 {{ data.basic.company }}</span>
          <span v-if="data.basic.yearsOfExperience">
            {{ data.basic.yearsOfExperience }}年经验
          </span>
        </div>
        <span v-if="data.basic.openToWork" class="df-badge">Open to Work</span>
      </div>
    </header>

    <!-- Body -->
    <div class="df-body">
      <!-- Intro -->
      <p v-if="data.intro.shortIntro" class="df-intro df-intro--short">
        {{ data.intro.shortIntro }}
      </p>
      <p v-if="data.intro.longIntro" class="df-intro df-intro--long">
        {{ data.intro.longIntro }}
      </p>

      <!-- Focus areas -->
      <div v-if="data.tech.focusAreas.length" class="df-section">
        <h2 class="df-section__title">关注方向</h2>
        <div class="df-pills">
          <span v-for="area in data.tech.focusAreas" :key="area" class="df-pill df-pill--focus">
            {{ area }}
          </span>
        </div>
      </div>

      <!-- Tech stacks -->
      <div v-if="data.tech.stacks.length" class="df-section">
        <h2 class="df-section__title">技术栈</h2>
        <div v-if="useSkillIcons" class="df-skill-icons">
          <img
            :src="skillIconsUrl!"
            alt="Skill Icons"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
        </div>
        <div v-else class="df-pills">
          <span v-for="stack in data.tech.stacks" :key="stack" class="df-pill df-pill--tech">
            {{ stack }}
          </span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="data.tech.tags.length" class="df-section">
        <div class="df-pills">
          <span v-for="tag in data.tech.tags" :key="tag" class="df-pill df-pill--tag">
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Social links -->
      <nav v-if="Object.values(data.socials).some(Boolean) || data.links.length" class="df-links">
        <template v-for="social in socialLinks" :key="social.key">
          <a
            v-if="data.socials[social.key]"
            :href="data.socials[social.key]"
            target="_blank"
            rel="noreferrer noopener"
            class="df-link"
          >
            {{ social.label }}
          </a>
        </template>
        <a
          v-for="link in data.links"
          :key="link.id"
          :href="link.url"
          target="_blank"
          rel="noreferrer noopener"
          class="df-link df-link--custom"
        >
          <span v-if="link.icon">{{ link.icon }}</span>
          {{ link.label }}
        </a>
      </nav>

      <!-- Motto -->
      <p v-if="data.intro.motto" class="df-motto">
        <q>{{ data.intro.motto }}</q>
      </p>
    </div>
  </article>
</template>

<style scoped>
.df-card {
  display: flex;
  flex-direction: column;
  font-family: -apple-system, 'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif;
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 6px 30px rgba(99, 102, 241, 0.12);
  width: 100%;
  box-sizing: border-box;
  color: #1e1b4b;
  position: relative;
  isolation: isolate;
}

.df-card > * {
  position: relative;
  z-index: 1;
}

.df-card--bg::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(180deg, rgba(16, 23, 43, 0.48), rgba(16, 23, 43, 0.28)), var(--df-bg-image);
  background-size: cover;
  background-position: center;
  filter: saturate(1.05);
}

.df-card--bg .df-body {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(1.5px);
}

/* Hero gradient section */
.df-hero {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 22px 18px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
  color: #ffffff;
}

.df-hero--no-avatar {
  gap: 0;
}

.df-hero--bg {
  background-image:
    linear-gradient(135deg, rgba(27, 38, 74, 0.62) 0%, rgba(71, 41, 111, 0.52) 100%),
    var(--df-bg-image);
  background-size: cover;
  background-position: center;
}

.df-hero__avatar {
  flex-shrink: 0;
}

.df-avatar__img {
  width: 68px;
  height: 68px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.6);
  display: block;
}

.df-avatar__img--circle {
  border-radius: 50%;
}
.df-avatar__img--rounded {
  border-radius: 14px;
}
.df-avatar__img--square {
  border-radius: 4px;
}

.df-hero__name {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.15;
  color: #ffffff;
}

.df-hero__title {
  margin: 3px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.df-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.df-badge {
  display: inline-block;
  margin-top: 8px;
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
}

/* Body */
.df-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px 18px;
}

.df-intro {
  margin: 0;
  line-height: 1.5;
}

.df-intro--short {
  font-size: 14px;
  font-weight: 500;
  color: #312e81;
}

.df-intro--long {
  font-size: 12px;
  color: #4c1d95;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.df-section__title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #7c3aed;
  margin: 0 0 6px;
}

.df-section {
  display: flex;
  flex-direction: column;
}

.df-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.df-pill {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 500;
}

.df-pill--tech {
  background: #ede9fe;
  color: #5b21b6;
}

.df-pill--focus {
  background: #f0fdf4;
  color: #166534;
}

.df-pill--tag {
  background: #f5f3ff;
  color: #7c3aed;
  font-weight: 600;
}

.df-skill-icons {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.df-skill-icons img {
  width: 100%;
  max-width: 320px;
  height: auto;
}

/* Links */
.df-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 4px;
  border-top: 1px solid #ede9fe;
}

.df-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #f5f3ff;
  border-radius: 7px;
  color: #5b21b6;
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
  transition: background 0.15s;
}

.df-link:hover {
  background: #ede9fe;
}

.df-link--custom {
  background: #faf5ff;
}

/* Motto */
.df-motto {
  font-size: 11px;
  color: #a78bfa;
  font-style: italic;
  text-align: left;
  margin: 0;
}

.df-motto q {
  quotes: none;
}
</style>
