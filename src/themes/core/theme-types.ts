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
