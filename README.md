# livecard-studio

LiveCard Studio 是一个面向程序员的自我介绍卡片工作台。

你可以在左侧通过结构化表单录入个人资料，右侧实时预览主题卡片效果，并导出为 HTML、PNG 或 Vue Component 打包文件。

## 核心能力

- 表单驱动生成：无需写代码，3-5 分钟产出可分享个人卡片
- 统一数据模型：所有主题组件共用一份 `ProfileCardData` 类型
- 主题组件化：主题通过独立 Vue 组件贡献，不使用同 DOM 的纯 CSS 换肤
- 多格式导出：
  - HTML：可离线打开
  - PNG：用于社交平台或海报
  - Vue Component 包：包含主题源码、类型定义、示例数据

## 当前内置主题

- Minimal：简约、可读性优先，适合个人主页 About 区块
- DevFolio：技术感较强，信息密度更高

## 项目结构（核心）

```txt
src/
  App.vue
  data/
    defaultProfileCard.ts
  types/
    profile-card.ts
  themes/
    core/
      theme-types.ts
      theme-registry.ts
    minimal/
      MinimalThemeCard.vue
      manifest.ts
    devfolio/
      DevFolioThemeCard.vue
      manifest.ts
    template/
      ThemeCard.template.vue
      manifest.template.ts
  components/
    PreviewPane.vue
  utils/
    exporters.ts
    profile.ts
```

## 本地启动

```sh
pnpm install
pnpm dev
```

默认地址：

```txt
http://localhost:5173
```

## 构建与校验

```sh
pnpm type-check
pnpm build
pnpm lint
```

## 使用流程

1. 在左侧填写昵称、简介、社交链接、技术栈等信息。
2. 选择主题（Minimal / DevFolio）和预览比例（1:1 / 4:5 / 16:9）。
3. 在右侧查看实时预览。
4. 根据场景导出 HTML、PNG 或 Vue Component 包。

## 导出说明

- HTML 导出：生成单文件页面，内嵌数据快照。
- PNG 导出：对预览画布进行高清截图。
- Vue Component 导出（zip）：
  - `ThemeCard.vue`
  - `profile-card.ts`
  - `sample-profile.json`
  - `README.txt`

## 新增主题方式

1. 复制 `src/themes/template` 下模板。
2. 修改组件结构与视觉样式。
3. 在 manifest 中声明 `supportedFields` 与 `renderHtml`。
4. 在 `src/themes/core/theme-registry.ts` 注册新主题。

## 注意事项

- URL 字段支持自动补全协议（`https://`）。
- 建议先点击“规范化链接”再导出，避免无协议链接失效。
- 不同主题会按自身布局使用字段，空字段会自动降级隐藏。
