import DevfolioSoftCard from './devfolio-soft-card.vue'
import type { ProfileCardThemeManifest } from '@/themes/core/theme-types'

const manifest: ProfileCardThemeManifest = {
    id: 'devfolio-soft',
    name: 'Devfolio Soft',
    description: '渐变背景的作品集风格卡片，社交入口突出，适合发社交媒体或个人主页。',
    version: '1.0.0',
    component: DevfolioSoftCard,
    tags: ['gradient', 'social', 'portfolio'],
    supportedFields: [
        'basic.nickname',
        'basic.title',
        'basic.location',
        'basic.company',
        'basic.yearsOfExperience',
        'basic.openToWork',
        'avatar.url',
        'intro.shortIntro',
        'intro.longIntro',
        'intro.motto',
        'socials.github',
        'socials.twitter',
        'socials.blog',
        'socials.bilibili',
        'socials.xiaohongshu',
        'socials.zhihu',
        'socials.juejin',
        'socials.linkedin',
        'socials.website',
        'tech.stacks',
        'tech.focusAreas',
        'tech.tags',
        'links',
    ],
    defaultCanvasSize: 'portrait',
}

export default manifest
