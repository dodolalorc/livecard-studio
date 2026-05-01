import type { ProfileCardData } from '@/types/profile-card'

export const defaultProfileCardData: ProfileCardData = {
    id: 'livecard-default',
    basic: {
        nickname: 'Avery Chen',
        realName: 'Chen Avery',
        gender: 'prefer_not_to_say',
        age: 28,
        title: '前端开发工程师 / 独立开发者',
        location: 'Shanghai · Remote',
        company: 'Open Source',
        school: '',
        yearsOfExperience: 4,
        openToWork: true,
    },
    avatar: {
        url: 'https://avatars.githubusercontent.com/u/583231?v=4',
        alt: 'Avery Chen',
        shape: 'circle',
    },
    intro: {
        shortIntro: '用 Vue 和 TypeScript 构建清晰可靠的 Web 体验。',
        longIntro:
            '专注前端工程化和组件设计，热衷于开源和技术写作，同时也是独立开发者，探索 AI Coding 工作流。',
        motto: 'Code with clarity, ship with confidence.',
    },
    contacts: {
        email: 'avery@example.com',
        phone: '',
        wechat: '',
        telegram: '',
    },
    socials: {
        github: 'https://github.com/octocat',
        twitter: 'https://twitter.com/avery_example',
        blog: 'https://example.dev',
        bilibili: '',
        xiaohongshu: '',
        zhihu: '',
        juejin: '',
        linkedin: '',
        website: '',
    },
    tech: {
        stacks: ['Vue', 'TypeScript', 'Vite', 'Node.js', 'Tailwind CSS'],
        focusAreas: ['前端工程化', 'AI Coding', '开源'],
        tags: ['独立开发者', '技术博主', '开源贡献者'],
    },
    links: [
        {
            id: 'portfolio',
            label: '作品集',
            url: 'https://example.dev/portfolio',
            icon: '🎨',
            description: '我的开源项目和设计作品',
        },
    ],
    preferences: {
        themeId: 'minimal-clean',
        accentColor: '#3B82F6',
        canvasSize: 'auto',
        exportScale: 2,
    },
}
