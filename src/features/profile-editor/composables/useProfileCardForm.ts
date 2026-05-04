import { ref, watch } from 'vue'
import { defaultProfileCardData } from '@/data/default-profile-card'
import type { ProfileCardData } from '@/types/profile-card'

const STORAGE_KEY = 'livecard-studio-profile-card-v1'

function loadFromStorage(): ProfileCardData | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        return JSON.parse(raw) as ProfileCardData
    } catch {
        return null
    }
}

function saveToStorage(data: ProfileCardData): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
        // localStorage unavailable (e.g. private browsing quota)
    }
}

function hydrateProfileCardData(partial: Partial<ProfileCardData>): ProfileCardData {
    return {
        ...defaultProfileCardData,
        ...partial,
        basic: { ...defaultProfileCardData.basic, ...partial.basic },
        avatar: { ...defaultProfileCardData.avatar, ...partial.avatar },
        intro: { ...defaultProfileCardData.intro, ...partial.intro },
        contacts: { ...defaultProfileCardData.contacts, ...partial.contacts },
        socials: { ...defaultProfileCardData.socials, ...partial.socials },
        tech: { ...defaultProfileCardData.tech, ...partial.tech },
        preferences: { ...defaultProfileCardData.preferences, ...partial.preferences },
        links: partial.links ?? defaultProfileCardData.links,
    }
}

export function useProfileCardForm() {
    const saved = loadFromStorage()
    const cardData = ref<ProfileCardData>(
        saved ? hydrateProfileCardData(saved) : structuredClone(defaultProfileCardData),
    )

    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    watch(
        cardData,
        (data) => {
            if (debounceTimer) clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => saveToStorage(data), 500)
        },
        { deep: true },
    )

    function resetToDefault() {
        cardData.value = structuredClone(defaultProfileCardData)
    }

    function exportJson(): string {
        return JSON.stringify(cardData.value, null, 2)
    }

    function importJson(json: string): boolean {
        try {
            const parsed = JSON.parse(json) as ProfileCardData
            if (!parsed || typeof parsed !== 'object' || !parsed.basic) return false
            cardData.value = hydrateProfileCardData(parsed)
            return true
        } catch {
            return false
        }
    }

    return {
        cardData,
        resetToDefault,
        exportJson,
        importJson,
    }
}
