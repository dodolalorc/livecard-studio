import MinimalCleanCard from './minimal-clean-card.vue'
import type { ProfileCardThemeManifest } from '@/themes/core/theme-types'

const manifest: ProfileCardThemeManifest = {
  id: 'minimal-clean',
  name: 'Minimal Clean',
  description: '简约干净的卡片风格，适合程序员个人介绍，突出昵称和技术栈。',
  version: '1.0.0',
  component: MinimalCleanCard,
  tags: ['minimal', 'clean', 'default'],
  supportedFields: [
    'basic.nickname',
    'basic.title',
    'basic.location',
    'basic.openToWork',
    'avatar.url',
    'intro.shortIntro',
    'intro.motto',
    'socials.github',
    'socials.twitter',
    'socials.blog',
    'socials.bilibili',
    'socials.zhihu',
    'socials.juejin',
    'socials.xiaohongshu',
    'socials.linkedin',
    'socials.website',
    'tech.stacks',
    'tech.focusAreas',
    'tech.tags',
    'links',
  ],
  defaultCanvasSize: 'auto',
}

export default manifest
