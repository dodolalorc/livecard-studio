import type { ProfileCardData, ProfileSocials } from '@/types/profile-card'

/** 将社交平台用户名/短链规范化为完整 URL */
function normalizeSocialUrl(
    handle: string | undefined,
    baseUrl: string,
): string | undefined {
    if (!handle) return undefined
    const trimmed = handle.trim()
    if (!trimmed) return undefined
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    return `${baseUrl}/${trimmed.replace(/^\//, '')}`
}

/** 确保 URL 有 https:// 前缀 */
function normalizeGenericUrl(url: string | undefined): string | undefined {
    if (!url) return undefined
    const trimmed = url.trim()
    if (!trimmed) return undefined
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    return `https://${trimmed}`
}

export function normalizeSocials(socials: ProfileSocials): ProfileSocials {
    return {
        github: normalizeSocialUrl(socials.github, 'https://github.com'),
        twitter: normalizeSocialUrl(socials.twitter, 'https://twitter.com'),
        blog: normalizeGenericUrl(socials.blog),
        bilibili: normalizeSocialUrl(socials.bilibili, 'https://space.bilibili.com'),
        xiaohongshu: normalizeSocialUrl(socials.xiaohongshu, 'https://www.xiaohongshu.com/user/profile'),
        zhihu: normalizeSocialUrl(socials.zhihu, 'https://www.zhihu.com/people'),
        juejin: normalizeSocialUrl(socials.juejin, 'https://juejin.cn/user'),
        linkedin: normalizeSocialUrl(socials.linkedin, 'https://www.linkedin.com/in'),
        website: normalizeGenericUrl(socials.website),
    }
}

export function normalizeProfileCardData(data: ProfileCardData): ProfileCardData {
    return {
        ...data,
        basic: {
            ...data.basic,
            nickname: data.basic.nickname.trim().slice(0, 24),
            title: data.basic.title?.trim().slice(0, 40),
            location: data.basic.location?.trim(),
            company: data.basic.company?.trim(),
            school: data.basic.school?.trim(),
        },
        intro: {
            ...data.intro,
            shortIntro: data.intro.shortIntro.trim().slice(0, 80),
            longIntro: data.intro.longIntro?.trim().slice(0, 240),
            motto: data.intro.motto?.trim(),
        },
        socials: normalizeSocials(data.socials),
        tech: {
            stacks: data.tech.stacks.map((s) => s.trim().slice(0, 24)).filter(Boolean).slice(0, 16),
            focusAreas: data.tech.focusAreas.map((s) => s.trim().slice(0, 24)).filter(Boolean).slice(0, 16),
            tags: data.tech.tags.map((s) => s.trim().slice(0, 24)).filter(Boolean).slice(0, 16),
        },
        links: data.links.slice(0, 8).map((link) => ({
            ...link,
            label: link.label.trim(),
            url: normalizeGenericUrl(link.url) ?? link.url,
        })),
    }
}
