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
