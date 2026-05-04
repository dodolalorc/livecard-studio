## PNG 导出（Node + Playwright，高还原）

如果你追求更高还原度（避免浏览器端 html-to-image 的渲染差异），可以使用 Playwright 直接截图卡片根节点。

## 右上角按钮走 Playwright（本地桥接服务）

如果你希望页面内“导出 PNG”按钮也使用 Playwright，而不是浏览器端截图，需要先启动本地桥接服务。

### 1) 启动你的前端页面

开发模式默认是:

pnpm dev

服务地址通常是:

http://127.0.0.1:5173

### 2) 启动导出桥接服务

pnpm export:bridge

默认桥接地址:

http://127.0.0.1:3210/api/export/png

### 3) 可选环境变量

你可以通过环境变量覆盖桥接服务配置:

- LIVECARD_EXPORT_BRIDGE_PORT: 桥接服务监听端口（默认 3210）
- LIVECARD_EXPORT_TARGET_URL: Playwright 打开的前端页面 URL（默认 http://127.0.0.1:5173）

前端可通过 Vite 环境变量覆盖请求地址:

- VITE_EXPORT_BRIDGE_URL: 默认 http://127.0.0.1:3210/api/export/png

启动后，右上角“导出 PNG”按钮会直接调用本地 Playwright 服务生成截图。

### 常见失败原因与排查

1. 本地桥接服务没启动

- 现象: 页面提示“本地导出服务未启动”
- 处理: 运行 `pnpm export:bridge`

2. 前端页面地址不匹配

- 现象: 服务返回“目标页面不可访问”
- 原因: 你可能在 4173 或 localhost 启动，而桥接默认去 5173
- 处理: 设置 `LIVECARD_EXPORT_TARGET_URL` 指向实际地址，或直接访问 `http://127.0.0.1:3210/health` 查看服务探测到的目标

3. 导出超时

- 现象: 返回“导出超时”
- 原因: 背景图/头像外链响应慢，或本机负载高
- 处理: 优先使用可访问且稳定的图片地址；必要时提升 `LIVECARD_EXPORT_TIMEOUT_MS`（默认 45000）

4. 并发导出冲突

- 现象: 连续点击按钮偶发失败
- 处理: 桥接服务已改为串行队列处理；等待前一个导出完成再点击更稳

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
