# LiveCard Studio 重定位开发计划（AI Coding 执行版）

> 目标：将项目从“偏代码编辑/简历展示”的工具，重构为一个面向程序员的「自我介绍卡片工作台」。用户通过左侧结构化表单录入信息，在右侧实时预览卡片效果，并可导出为 HTML、PNG 或 Vue Component 包。

---

## 0. 一句话定位

LiveCard Studio 是一个帮助程序员快速生成个人介绍卡片的轻量工作台。

它不是传统简历生成器，也不是在线代码编辑器，而是一个更偏「个人主页组件 / 社交平台展示图 / 开源作者介绍卡 / 技术博主名片」的生成工具。

---

## 1. 产品目标

### 1.1 核心目标

用户无需写代码，只需要填写结构化信息，即可在 3-5 分钟内生成一张好看的程序员个人介绍卡片。

### 1.2 关键体验

- 左侧：轻量表单，只填写必要信息。
- 右侧：实时预览卡片效果。
- 底部或侧边：主题选择与导出设置。
- 导出：支持 HTML、PNG、Vue Component 包。
- 主题：通过 Vue 组件贡献主题，而不是通过同一套 DOM 改 CSS。

### 1.3 MVP 必须做到

- 支持填写基础个人信息。
- 支持填写程序员常用链接：GitHub、Blog、Twitter/X、B 站、小红书、知乎、掘金等。
- 支持填写 intro、自定义链接、技术栈、头像。
- 支持右侧实时预览。
- 至少内置 2 个主题，其中一个为默认简约主题。
- 支持导出 HTML。
- 支持导出 PNG。
- 支持导出 Vue Component 包。

---

## 2. 本次重构原则

### 2.1 产品原则

1. 不再优先服务“完整简历”场景。
2. 不要求用户理解 Vue、CSS、组件结构。
3. 先完成「填写信息 -> 选择主题 -> 预览 -> 导出」的闭环。
4. 主题之间允许结构完全不同。
5. 空字段不展示，不出现无意义占位。

### 2.2 工程原则

1. 所有主题组件必须接收同一个统一数据类型。
2. 主题组件只负责展示，不负责修改数据。
3. 表单只负责编辑数据，不直接关心主题内部结构。
4. 导出逻辑只依赖统一的 Preview 渲染结果。
5. 主题新增应当像新增插件一样简单。

---

## 3. 推荐目录结构

建议新增或重构为以下结构：

```txt
src/
  app/
    AppShell.vue

  pages/
    studio/
      StudioPage.vue
      components/
        StudioHeader.vue
        StudioSidebar.vue
        StudioPreview.vue
        ExportPanel.vue
        ThemePicker.vue

  features/
    profile-editor/
      components/
        BasicInfoForm.vue
        SocialLinksForm.vue
        TechStackForm.vue
        IntroForm.vue
        AvatarForm.vue
        CustomLinksForm.vue
      composables/
        useProfileCardForm.ts
      utils/
        normalizeProfileCardData.ts
        validateProfileCardData.ts

    export-card/
      exportHtml.ts
      exportPng.ts
      exportVueComponentZip.ts
      exportTypes.ts

  themes/
    core/
      theme-types.ts
      theme-registry.ts
      ThemeRenderer.vue
      theme-field-utils.ts

    minimal-clean/
      MinimalCleanCard.vue
      manifest.ts
      sample.ts

    devfolio-soft/
      DevfolioSoftCard.vue
      manifest.ts
      sample.ts

    template/
      TemplateCard.vue
      manifest.template.ts
      README.md

  types/
    profile-card.ts

  data/
    default-profile-card.ts
    default-themes.ts
```

如果当前项目已有相近目录，可以不要完全照搬，但最终应保持这几个边界：

- `types/`：统一数据类型。
- `features/profile-editor/`：左侧编辑表单。
- `themes/`：主题组件与注册中心。
- `features/export-card/`：导出能力。
- `pages/studio/`：工作台页面组合。

---

## 4. 统一数据模型

新增文件：

```txt
src/types/profile-card.ts
```

建议实现：

```ts
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
  canvasSize: ProfileCardCanvasSize
  exportScale: number
}

export type ProfileCardCanvasSize = 'square' | 'portrait' | 'landscape' | 'auto'
```

### 4.1 默认数据

新增：

```txt
src/data/default-profile-card.ts
```

要求：

- 提供一份完整但不过度复杂的程序员示例数据。
- 默认主题使用 `minimal-clean`。
- 默认技术栈建议包含：`Vue`、`TypeScript`、`Vite`、`Node.js`、`Tailwind CSS`。
- 默认链接不要写真实隐私信息，使用示例链接即可。

---

## 5. 左侧表单设计

左侧表单不是简历编辑器，而是「个人介绍卡片信息面板」。

### 5.1 表单分组

左侧建议分为以下 Tab 或折叠区：

1. 基础信息
2. 头像与简介
3. 社交链接
4. 技术栈与标签
5. 自定义链接
6. 主题与导出

### 5.2 基础信息字段

组件：

```txt
src/features/profile-editor/components/BasicInfoForm.vue
```

字段：

- 昵称 `nickname`，必填。
- 真实姓名 `realName`，可选。
- 性别 `gender`，可选。
- 年龄 `age`，可选。
- 职业标题 `title`，例如：前端开发工程师、独立开发者、全栈工程师。
- 所在地 `location`。
- 公司 `company`。
- 学校 `school`。
- 工作年限 `yearsOfExperience`。
- 是否开放合作/求职 `openToWork`。

### 5.3 头像与简介字段

组件：

```txt
src/features/profile-editor/components/AvatarForm.vue
src/features/profile-editor/components/IntroForm.vue
```

字段：

- 头像 URL。
- 头像形状：圆形、圆角、方形。
- 一句话介绍 `shortIntro`，建议限制 80 字以内。
- 长介绍 `longIntro`，建议限制 240 字以内。
- Motto `motto`，可选。

### 5.4 社交链接字段

组件：

```txt
src/features/profile-editor/components/SocialLinksForm.vue
```

字段：

- GitHub
- Blog
- Twitter/X
- Bilibili
- 小红书
- 知乎
- 掘金
- LinkedIn
- 个人网站

要求：

- 用户可以只填写用户名或完整 URL。
- 保存前统一规范化为完整 URL。
- 为空的社交链接不在卡片中渲染。

### 5.5 技术栈与标签字段

组件：

```txt
src/features/profile-editor/components/TechStackForm.vue
```

字段：

- 技术栈：Vue、React、TypeScript、Node.js 等。
- 关注方向：前端工程化、AI Coding、开源、博客写作等。
- 标签：独立开发者、技术博主、开源贡献者等。

要求：

- 使用 tag input 交互。
- 支持回车添加。
- 支持删除。
- 限制单个标签长度。

### 5.6 自定义链接字段

组件：

```txt
src/features/profile-editor/components/CustomLinksForm.vue
```

字段：

- label
- url
- icon
- description

使用场景：

- 作品集
- Newsletter
- 课程主页
- 开源项目
- 赞助链接
- 简历链接

---

## 6. 右侧预览工作台

页面主体：

```txt
src/pages/studio/StudioPage.vue
```

核心布局：

```txt
┌─────────────────────────────────────────────┐
│ Header：项目名 / 主题 / 导出入口             │
├───────────────┬─────────────────────────────┤
│ 左侧表单       │ 右侧实时预览                 │
│ Profile Form  │ Card Preview Canvas          │
└───────────────┴─────────────────────────────┘
```

### 6.1 预览组件

新增：

```txt
src/pages/studio/components/StudioPreview.vue
```

职责：

- 接收 `ProfileCardData`。
- 接收当前主题 ID。
- 渲染 `ThemeRenderer`。
- 控制画布尺寸和背景。
- 给导出 PNG/HTML 提供稳定 DOM 节点。

要求：

- 预览区域必须有固定 `data-export-root="profile-card"` 标记。
- PNG 和 HTML 导出都从同一个预览根节点读取，避免导出效果与预览不一致。

---

## 7. 主题系统设计

当前 plan 最大的问题是“主题系统说了原则，但没有说 AI Coding 该怎么落地”。这里要明确实现路径。

### 7.1 主题不是 CSS 皮肤

本项目的主题定义为：

> 一个主题 = 一个 Vue 展示组件 + 一个 manifest 元数据文件 + 一份可选示例数据。

主题之间可以有完全不同的布局，例如：

- 极简名片式。
- GitHub README 风。
- 终端命令行风。
- 玻璃拟态社交卡。
- 海报横幅风。

### 7.2 主题统一 Props

新增：

```txt
src/themes/core/theme-types.ts
```

建议实现：

```ts
import type { Component } from 'vue'
import type { ProfileCardData } from '@/types/profile-card'

export interface ProfileCardThemeProps {
  data: ProfileCardData
  exportMode?: boolean
}

export interface ProfileCardThemeManifest {
  id: string
  name: string
  description: string
  author?: string
  version: string
  component: Component
  previewImage?: string
  tags: string[]
  supportedFields: ProfileCardSupportedField[]
  defaultCanvasSize: 'square' | 'portrait' | 'landscape' | 'auto'
}

export type ProfileCardSupportedField =
  | 'basic.nickname'
  | 'basic.realName'
  | 'basic.gender'
  | 'basic.age'
  | 'basic.title'
  | 'basic.location'
  | 'basic.company'
  | 'basic.school'
  | 'basic.yearsOfExperience'
  | 'basic.openToWork'
  | 'avatar.url'
  | 'intro.shortIntro'
  | 'intro.longIntro'
  | 'intro.motto'
  | 'contacts.email'
  | 'contacts.phone'
  | 'contacts.wechat'
  | 'contacts.telegram'
  | 'socials.github'
  | 'socials.twitter'
  | 'socials.blog'
  | 'socials.bilibili'
  | 'socials.xiaohongshu'
  | 'socials.zhihu'
  | 'socials.juejin'
  | 'socials.linkedin'
  | 'socials.website'
  | 'tech.stacks'
  | 'tech.focusAreas'
  | 'tech.tags'
  | 'links'
```

### 7.3 主题注册中心

新增：

```txt
src/themes/core/theme-registry.ts
```

建议实现：

```ts
import minimalClean from '@/themes/minimal-clean/manifest'
import devfolioSoft from '@/themes/devfolio-soft/manifest'
import type { ProfileCardThemeManifest } from './theme-types'

export const profileCardThemes: ProfileCardThemeManifest[] = [
  minimalClean,
  devfolioSoft,
]

export function getProfileCardTheme(themeId: string): ProfileCardThemeManifest {
  return profileCardThemes.find((theme) => theme.id === themeId) ?? profileCardThemes[0]
}
```

### 7.4 主题渲染器

新增：

```txt
src/themes/core/ThemeRenderer.vue
```

职责：

- 根据 `themeId` 找到 manifest。
- 动态渲染 manifest.component。
- 把统一的 `ProfileCardData` 传给主题组件。

示例：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { ProfileCardData } from '@/types/profile-card'
import { getProfileCardTheme } from './theme-registry'

const props = defineProps<{
  data: ProfileCardData
  themeId: string
  exportMode?: boolean
}>()

const theme = computed(() => getProfileCardTheme(props.themeId))
</script>

<template>
  <component
    :is="theme.component"
    :data="data"
    :export-mode="exportMode"
  />
</template>
```

---

## 8. 内置主题 1：Minimal Clean

这是默认主题，要符合你想要的“简约、颜色和谐、轻量、像在写个人介绍卡片”的感觉。

### 8.1 文件

```txt
src/themes/minimal-clean/MinimalCleanCard.vue
src/themes/minimal-clean/manifest.ts
src/themes/minimal-clean/sample.ts
```

### 8.2 视觉方向

关键词：

- 简约
- 干净
- 柔和
- 卡片感
- 适合程序员
- 不像传统简历
- 不要过度企业化

推荐色彩：

```txt
背景：#F7FAFC
卡片：#FFFFFF
主文字：#172033
次文字：#64748B
强调色：#3B82F6
浅强调背景：#EFF6FF
边框：#E2E8F0
标签背景：#F1F5F9
```

### 8.3 布局

```txt
┌────────────────────────────────────┐
│ 头像  昵称 / title                  │
│       location / openToWork         │
│                                    │
│ 一句话介绍                          │
│                                    │
│ GitHub Blog Twitter Zhihu ...      │
│                                    │
│ Tech Stack 标签                     │
└────────────────────────────────────┘
```

### 8.4 组件要求

- 头像为空时显示昵称首字母占位。
- `nickname` 必须突出。
- `shortIntro` 是卡片核心文案。
- 链接使用小图标或短标签，不显示超长 URL。
- 技术栈以 pill badge 形式展示。
- 空字段不展示对应模块。
- 不写复杂动画，确保 PNG 导出稳定。

---

## 9. 内置主题 2：Devfolio Soft

第二个主题用于证明“主题不是 CSS 换肤，而是组件结构可以变化”。

### 9.1 文件

```txt
src/themes/devfolio-soft/DevfolioSoftCard.vue
src/themes/devfolio-soft/manifest.ts
src/themes/devfolio-soft/sample.ts
```

### 9.2 视觉方向

关键词：

- 程序员作品集
- 柔和渐变
- 社交入口明显
- 更适合发社交媒体

### 9.3 布局

```txt
┌────────────────────────────────────┐
│ 渐变背景区域                         │
│ 头像 / 昵称 / title                  │
├────────────────────────────────────┤
│ intro                               │
│ focus areas                         │
│ GitHub / Blog / B站 / 小红书         │
└────────────────────────────────────┘
```

要求：

- 与 Minimal Clean 的 DOM 结构明显不同。
- 使用同一份 `ProfileCardData`。
- 支持横向卡片和竖向卡片。

---

## 10. 主题模板机制

目标：后续新增主题时，AI Coding 或贡献者只需要复制模板目录。

新增：

```txt
src/themes/template/TemplateCard.vue
src/themes/template/manifest.template.ts
src/themes/template/README.md
```

### 10.1 TemplateCard.vue 要求

- 内置 `defineProps<ProfileCardThemeProps>()`。
- 展示如何读取 data.basic、data.socials、data.tech。
- 展示空字段判断。
- 不包含业务编辑逻辑。

### 10.2 manifest.template.ts 要求

包含完整注释：

```ts
import TemplateCard from './TemplateCard.vue'
import type { ProfileCardThemeManifest } from '@/themes/core/theme-types'

const manifest: ProfileCardThemeManifest = {
  id: 'your-theme-id',
  name: 'Your Theme Name',
  description: 'Describe your theme.',
  version: '0.1.0',
  component: TemplateCard,
  tags: ['template'],
  supportedFields: [
    'basic.nickname',
    'basic.title',
    'intro.shortIntro',
    'socials.github',
    'tech.stacks',
  ],
  defaultCanvasSize: 'square',
}

export default manifest
```

### 10.3 README.md 内容

说明：

- 如何复制主题模板。
- 如何修改组件。
- 如何注册到 `theme-registry.ts`。
- 主题组件只能接收统一 `data`，不要自定义业务输入。
- 主题组件不要直接读 localStorage 或调用导出逻辑。

---

## 11. 导出功能设计

导出功能集中放到：

```txt
src/features/export-card/
```

### 11.1 HTML 导出

文件：

```txt
src/features/export-card/exportHtml.ts
```

目标：导出一个可以离线打开的 HTML 文件。

要求：

- 使用当前预览 DOM 作为导出源。
- 内联必要 CSS。
- 内联当前数据快照。
- 文件名格式：`livecard-{nickname}-{yyyyMMdd}.html`。
- 打开 HTML 后不依赖开发服务器。

实现建议：

- 获取 `data-export-root="profile-card"` 节点。
- 克隆节点 outerHTML。
- 收集当前页面与主题相关样式。
- 生成完整 HTML。
- 通过 Blob 下载。

### 11.2 PNG 导出

文件：

```txt
src/features/export-card/exportPng.ts
```

目标：导出当前卡片为 PNG 图片。

建议依赖：

- `html-to-image` 或同类库。

要求：

- 支持导出尺寸：1:1、4:5、16:9、auto。
- 支持导出倍率：1x、2x、3x。
- 默认 2x。
- 文件名格式：`livecard-{nickname}-{yyyyMMdd}.png`。
- 导出前隐藏编辑态辅助 UI。

### 11.3 Vue Component 包导出

文件：

```txt
src/features/export-card/exportVueComponentZip.ts
```

目标：导出一个 zip，方便用户放到自己的 Vue 项目中使用。

建议依赖：

- `jszip`
- `file-saver` 或浏览器 Blob 下载

zip 内容：

```txt
livecard-vue-component/
  README.md
  ProfileCard.vue
  profile-card.types.ts
  sample-data.ts
  usage-example.vue
```

要求：

- `ProfileCard.vue` 使用当前主题对应组件源码或生成后的独立组件。
- `profile-card.types.ts` 包含统一数据类型。
- `sample-data.ts` 包含用户当前数据快照。
- `usage-example.vue` 展示如何引入和使用。
- README 说明安装、Props、样式注意事项。

MVP 阶段可以先实现“导出当前主题组件 + 类型 + 示例数据”的 zip，不需要做 npm 包级别构建。

---

## 12. 工作台页面任务拆解

### 12.1 StudioPage.vue

职责：

- 持有 `ProfileCardData` 状态。
- 持有当前主题 ID。
- 组合左侧编辑器和右侧预览区。
- 管理导出入口。

伪代码：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { defaultProfileCardData } from '@/data/default-profile-card'

const cardData = ref(defaultProfileCardData)
</script>

<template>
  <main class="studio-page">
    <StudioSidebar v-model:data="cardData" />
    <StudioPreview :data="cardData" :theme-id="cardData.preferences.themeId" />
  </main>
</template>
```

### 12.2 StudioSidebar.vue

职责：

- 展示分组表单。
- 使用 `v-model:data` 修改统一数据。
- 不直接关心预览组件。

### 12.3 StudioPreview.vue

职责：

- 渲染导出画布。
- 内部使用 `ThemeRenderer`。
- 处理 canvas size 样式。

### 12.4 ThemePicker.vue

职责：

- 读取 `profileCardThemes`。
- 展示主题名称、描述、标签。
- 切换时只修改 `data.preferences.themeId`。

### 12.5 ExportPanel.vue

职责：

- 提供 HTML、PNG、Vue Component 三个导出按钮。
- 提供导出尺寸和倍率设置。
- 调用 `features/export-card` 中的方法。

---

## 13. 数据校验与规范化

新增：

```txt
src/features/profile-editor/utils/normalizeProfileCardData.ts
src/features/profile-editor/utils/validateProfileCardData.ts
```

### 13.1 URL 规范化

要求：

- `github` 可输入 `dodolalorc`，自动转为 `https://github.com/dodolalorc`。
- `twitter` 可输入 `echo_codes`，自动转为 `https://twitter.com/echo_codes`。
- `blog` 如果没有协议，自动补全 `https://`。
- 国内平台同理尽量规范化，但不要强制用户必须填写完整链接。

### 13.2 文本限制

建议：

- nickname：24 字以内。
- title：40 字以内。
- shortIntro：80 字以内。
- longIntro：240 字以内。
- tech tag：每个 24 字以内，最多 16 个。
- customLinks：最多 8 个。

### 13.3 错误展示

MVP 不需要复杂表单库，但需要：

- 必填字段提示。
- URL 明显错误提示。
- 超长提示。
- 不阻断预览，只在导出前给出提醒。

---

## 14. 状态持久化

MVP 建议只做 localStorage。

新增 composable：

```txt
src/features/profile-editor/composables/useProfileCardForm.ts
```

职责：

- 初始化默认数据。
- 从 localStorage 恢复。
- 数据变更后 debounce 保存。
- 提供 reset 方法。
- 提供 import/export JSON 方法。

localStorage key：

```txt
livecard-studio-profile-card-v1
```

注意：

- 数据结构后续变化时通过版本号迁移。
- 不要把头像文件本体存在 localStorage；只保存 URL 或 base64 压缩结果。

---

## 15. UI 风格建议

整体界面要和目标产品一致：轻、干净、有创作感。

### 15.1 工作台风格

- 背景：浅灰蓝或暖白。
- 左侧表单：白色卡片，弱边框。
- 右侧预览：画布区域略大，突出卡片。
- 顶部工具栏：主题选择 + 导出按钮。

### 15.2 默认主题视觉

默认主题不要像后台管理系统，也不要像传统简历。

推荐关键词：

- 纸张感
- 卡片感
- 柔和阴影
- 少量蓝色强调
- 技术标签 pill
- 图标轻量

---

## 16. 建议安装依赖

根据现有项目情况决定是否安装。

建议：

```bash
bun add html-to-image jszip file-saver
bun add -d @types/file-saver
```

用途：

- `html-to-image`：PNG 导出。
- `jszip`：Vue Component zip 导出。
- `file-saver`：下载文件。

如果不想增加 `file-saver`，也可以直接使用浏览器 Blob + a 标签下载。

---

## 17. 执行阶段与提交顺序

### Phase 1：建立新数据模型和默认数据

任务：

- 新建 `src/types/profile-card.ts`。
- 新建 `src/data/default-profile-card.ts`。
- 新建 normalize / validate 工具。
- 新建 `useProfileCardForm.ts`。

验收：

- TypeScript 无错误。
- 默认数据可以被页面读取。
- 修改数据后可以保存到 localStorage。

建议提交：

```txt
feat: add profile card data model and default data
```

---

### Phase 2：搭建主题系统

任务：

- 新建 `src/themes/core/theme-types.ts`。
- 新建 `src/themes/core/theme-registry.ts`。
- 新建 `src/themes/core/ThemeRenderer.vue`。
- 新建 `minimal-clean` 主题。
- 新建 `devfolio-soft` 主题。
- 新建 `template` 主题模板。

验收：

- 可以通过 themeId 切换主题。
- 两个主题结构明显不同。
- 两个主题都接收同一个 `ProfileCardData`。
- 空字段可以优雅隐藏。

建议提交：

```txt
feat: add component-based profile card theme system
```

---

### Phase 3：重构工作台页面

任务：

- 新建 `StudioPage.vue`。
- 新建 `StudioSidebar.vue`。
- 新建各表单组件。
- 新建 `StudioPreview.vue`。
- 新建 `ThemePicker.vue`。
- 路由首页指向新的 Studio 页面。

验收：

- 左侧表单修改后右侧实时更新。
- 主题切换后数据不丢失。
- 页面在桌面端可正常使用。
- 空字段不显示空模块。

建议提交：

```txt
feat: rebuild studio workspace for profile card editing
```

---

### Phase 4：实现导出能力

任务：

- 新建 `exportHtml.ts`。
- 新建 `exportPng.ts`。
- 新建 `exportVueComponentZip.ts`。
- 新建 `ExportPanel.vue`。
- 接入导出按钮。

验收：

- HTML 可以离线打开。
- PNG 清晰，不包含编辑 UI。
- Vue Component zip 包含 README、组件、类型、示例数据。

建议提交：

```txt
feat: add html png and vue component exports
```

---

### Phase 5：体验收口与文档

任务：

- 更新 README。
- 添加主题贡献说明。
- 添加示例截图。
- 优化移动端布局。
- 补充基础测试。

验收：

- 新用户能看 README 理解产品定位。
- 开发者能根据 template 新增主题。
- 主要流程无明显 UI 断裂。

建议提交：

```txt
docs: update livecard studio positioning and theme guide
```

---

## 18. 测试建议

### 18.1 单元测试

建议覆盖：

- URL normalize。
- 数据 validate。
- theme registry 获取默认主题。
- 空 themeId 回退默认主题。

### 18.2 组件测试

建议覆盖：

- MinimalCleanCard 渲染 nickname。
- 空 socials 不显示社交区。
- tech.stacks 为空时不显示技术栈标题。
- ThemeRenderer 能根据 themeId 渲染不同组件。

### 18.3 手动验收清单

- 填写昵称，预览更新。
- 修改头像 URL，预览更新。
- 添加 GitHub，卡片出现 GitHub 入口。
- 添加技术栈，卡片出现标签。
- 切换主题，数据保留。
- 导出 PNG，图片清晰。
- 导出 HTML，本地打开正常。
- 导出 Vue Component zip，内容完整。

---

## 19. 不建议在 MVP 做的事情

暂时不要做：

- 账号系统。
- 云端保存。
- 主题市场。
- 在线安装第三方主题。
- AI 自动生成介绍文案。
- 复杂拖拽布局。
- 所见即所得代码编辑器。
- 完整简历模块。

原因：

当前产品最需要先证明的是：

> 用户能不能低成本生成一张好看的程序员个人介绍卡片。

先把这个闭环做顺，再扩展高级能力。

---

## 20. AI Coding 执行提示词

可以直接把下面这段给 AI Coding 使用：

```txt
请根据 plan.md 重构项目。优先完成 MVP 闭环：统一 ProfileCardData 类型、左侧结构化表单、右侧实时预览、组件化主题系统、Minimal Clean 默认主题、Devfolio Soft 第二主题、HTML/PNG/Vue Component 三种导出。

重要约束：
1. 主题必须是独立 Vue 组件，不要通过同一个 DOM + CSS class 做换肤。
2. 所有主题组件统一接收 ProfileCardData。
3. 表单负责编辑数据，主题组件只负责展示。
4. 导出必须复用预览区域的同一个 DOM 根节点。
5. 空字段必须优雅降级，不显示空标题或空模块。
6. 先保证功能闭环，不要加入账号系统、云端保存、主题市场、复杂拖拽。

建议按 Phase 1 到 Phase 5 逐步提交，每个阶段完成后确保 TypeScript 和构建通过。
```

---

## 21. 最终验收标准

完成后项目应满足：

- 打开首页就是个人介绍卡片工作台。
- 用户不写代码即可填写信息并看到实时预览。
- 默认主题视觉简约、颜色和谐、适合程序员个人展示。
- 至少两个主题可切换，且结构明显不同。
- 导出 HTML、PNG、Vue Component 包均可使用。
- 新增主题有模板和说明。
- TypeScript 无明显类型错误。
- 构建命令通过。

---

## 22. 推荐优先级总结

最高优先级：

1. `ProfileCardData` 统一类型。
2. `ThemeRenderer` + `theme-registry`。
3. `MinimalCleanCard` 默认主题。
4. 左侧基础表单。
5. 右侧实时预览。
6. HTML / PNG 导出。
7. Vue Component zip 导出。
8. 主题模板文档。

只要这 8 件事完成，项目就从“想法”变成一个清晰可用的 MVP。
