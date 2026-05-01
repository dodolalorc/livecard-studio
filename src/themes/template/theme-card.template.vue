<script setup lang="ts">
// TemplateCard.vue — 复制此文件到新主题目录并重命名。
// 主题组件只接收 `data` 和 `exportMode` 两个 prop。
// 不要在主题组件内读取 localStorage、调用导出函数或修改数据。

import type { ProfileCardThemeProps } from '@/themes/core/theme-types'

defineProps<ProfileCardThemeProps>()
</script>

<template>
  <article class="theme-template">
    <!-- nickname 是必填字段，始终展示 -->
    <h1>{{ data.basic.nickname }}</h1>

    <!-- 可选字段：有值时才渲染 -->
    <p v-if="data.basic.title">{{ data.basic.title }}</p>
    <p v-if="data.intro.shortIntro">{{ data.intro.shortIntro }}</p>

    <!-- 社交链接：有值时才渲染 -->
    <nav v-if="data.socials.github">
      <a :href="data.socials.github" target="_blank" rel="noreferrer">GitHub</a>
    </nav>

    <!-- 技术栈：数组非空时才渲染 -->
    <div v-if="data.tech.stacks.length">
      <span v-for="stack in data.tech.stacks" :key="stack">{{ stack }}</span>
    </div>
  </article>
</template>

<style scoped>
/* 在这里添加你的主题样式 */
.theme-template {
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #d7dce3;
}
</style>
