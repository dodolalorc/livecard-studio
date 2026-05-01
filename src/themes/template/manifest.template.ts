// manifest.template.ts — 复制此文件到新主题目录，重命名为 manifest.ts，
// 然后填写你的主题信息。
// 注册主题：在 src/themes/core/theme-registry.ts 中将你的 manifest 加入列表。

import TemplateCard from './theme-card.template.vue'
import type { ProfileCardThemeManifest } from '@/themes/core/theme-types'

const manifest: ProfileCardThemeManifest = {
    id: 'your-theme-id',          // 唯一 ID，使用 kebab-case
    name: 'Your Theme Name',       // 展示名称
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
