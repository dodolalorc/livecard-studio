# vue-card-studio

一个基于 Vue 3 + Vite 的在线组件编辑与调试工具，支持左侧分区编辑、样式面板可视化调参、右侧实时预览，以及代码复制、PNG 截图下载、ZIP 组件打包导出。

## 功能概览

- Monaco Editor 编辑 Vue 单文件组件代码
- 基于 `@vue/compiler-sfc` 的运行时动态编译与实时预览
- 内置两个默认示例，包含“介绍卡片”示例
- 样式调试面板，支持背景色、文字色、强调色、圆角、内边距、阴影透明度同步回写代码
- 工作区支持三条分割边界拖拽调整尺寸
- 支持一键格式化代码
- 支持复制代码、下载 PNG 截图、导出 ZIP 组件包

## 技术栈

- Vue 3
- Vite
- Monaco Editor
- `@vue/compiler-sfc`
- Prettier
- `html-to-image`
- `jszip`
- `file-saver`

## 本地启动

```sh
pnpm install
pnpm dev
```

默认开发地址：

```txt
http://localhost:5173
```

## 构建与校验

```sh
pnpm type-check
pnpm build
pnpm lint
```

## 使用说明

1. 左上功能区可切换默认示例，并执行复制、格式化、刷新、PNG、ZIP 操作。
2. 左上右侧样式面板可调整颜色、圆角、内边距和阴影，变更会同步回写源码中的 CSS 变量。
3. 左下代码编辑区直接编辑 `.vue` 单文件组件内容。
4. 右侧预览区默认占一半画面，负责实时渲染结果。
5. 三条分割线都支持拖拽：左右主分栏、左侧上下分栏、左上工具区与样式区分栏。

## 导出说明

- PNG 导出：对预览画布执行高清截图。
- ZIP 导出：包含 `Component.vue`、`style-tokens.json`、`USAGE.txt`。

## 当前实现限制

- 预览编译器暂不支持从外部模块 `import` 额外依赖，组件逻辑需写在当前单文件组件内部。
- 由于 Monaco 会打包多语言 worker，生产构建体积较大，当前版本优先保证功能完整性。
- 小屏场景下会自动退化为纵向堆叠布局，不保留桌面端拖拽分栏体验。
