import type { ProfileCardThemeManifest } from './theme-types'

// Themes are imported lazily — add new manifests here to register them
const themeModules = import.meta.glob<{ default: ProfileCardThemeManifest }>(
    '@/themes/*/manifest.ts',
    { eager: true },
)

export const profileCardThemes: ProfileCardThemeManifest[] = Object.values(themeModules)
    .map((m) => m.default)
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))

export function getProfileCardTheme(themeId: string): ProfileCardThemeManifest {
    return profileCardThemes.find((t) => t.id === themeId) ?? profileCardThemes[0]!
}
