# 贡献新主题指南

## 步骤

1. 复制 `src/themes/template/` 目录到 `src/themes/your-theme-id/`。
2. 将 `ThemeCard.template.vue` 重命名为你的主题组件名（如 `MyThemeCard.vue`）。
3. 将 `manifest.template.ts` 重命名为 `manifest.ts`，填写主题信息。
4. 在 `manifest.ts` 中将 `component` 指向你的新组件。
5. 主题注册中心通过 `import.meta.glob` 自动发现所有 `src/themes/*/manifest.ts`，无需手动注册。

## 规范

- **主题组件只能接收统一 `ProfileCardData`**，通过 `ProfileCardThemeProps` 类型约束。
- 主题组件**不要**直接读 localStorage、调用导出逻辑或修改数据。
- **空字段优雅降级**：使用 `v-if` 判断字段是否有值，不显示空标题或空模块。
- 主题组件之间**允许布局结构完全不同**，不需要通过同一套 DOM + CSS class 做换肤。

## Props 约束

```ts
import type { ProfileCardThemeProps } from '@/themes/core/theme-types'

defineProps<ProfileCardThemeProps>()
// => { data: ProfileCardData; exportMode?: boolean }
```

## 示例

```vue
<script setup lang="ts">
import type { ProfileCardThemeProps } from '@/themes/core/theme-types'
const { data } = defineProps<ProfileCardThemeProps>()
</script>

<template>
  <article>
    <h1>{{ data.basic.nickname }}</h1>
    <p v-if="data.basic.title">{{ data.basic.title }}</p>
    <p v-if="data.intro.shortIntro">{{ data.intro.shortIntro }}</p>
  </article>
</template>
```

## supportedFields

在 `manifest.ts` 中填写 `supportedFields`，告诉用户你的主题支持哪些字段，
未列出的字段即使用户填写了也不会在卡片中展示（但会保存在数据中）。
