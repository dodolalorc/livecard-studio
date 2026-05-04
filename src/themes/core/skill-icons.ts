const SKILL_ICON_ALIASES: Record<string, string> = {
    js: 'js',
    javascript: 'js',
    ts: 'ts',
    typescript: 'ts',
    vue: 'vue',
    vuejs: 'vue',
    react: 'react',
    next: 'nextjs',
    nextjs: 'nextjs',
    nuxt: 'nuxtjs',
    nuxtjs: 'nuxtjs',
    vite: 'vite',
    node: 'nodejs',
    nodejs: 'nodejs',
    nodedotjs: 'nodejs',
    express: 'express',
    tailwind: 'tailwind',
    tailwindcss: 'tailwind',
    css: 'css',
    html: 'html',
    sass: 'sass',
    pnpm: 'pnpm',
    npm: 'npm',
    yarn: 'yarn',
    docker: 'docker',
    kubernetes: 'kubernetes',
    python: 'py',
    py: 'py',
    java: 'java',
    kotlin: 'kotlin',
    go: 'go',
    golang: 'go',
    rust: 'rust',
    cpp: 'cpp',
    csharp: 'cs',
    cs: 'cs',
    mysql: 'mysql',
    postgres: 'postgres',
    postgresql: 'postgres',
    mongodb: 'mongodb',
    redis: 'redis',
    linux: 'linux',
    aws: 'aws',
    gcp: 'gcp',
    azure: 'azure',
    git: 'git',
    github: 'github',
}

function toAliasKey(label: string): string {
    return label.trim().toLowerCase().replace(/\./g, '_dot_').replace(/[^a-z0-9]+/g, '')
}

function normalizeSkillIconKey(label: string): string | undefined {
    const aliasKey = toAliasKey(label)
    const fromAlias = SKILL_ICON_ALIASES[aliasKey]
    if (fromAlias) return fromAlias

    const fallback = label.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
    return fallback || undefined
}

export function buildSkillIconsUrl(stacks: string[]): string | null {
    const normalized = stacks
        .map((s) => normalizeSkillIconKey(s))
        .filter((s): s is string => Boolean(s))

    const unique = Array.from(new Set(normalized)).slice(0, 16)
    if (!unique.length) return null

    return `https://skillicons.dev/icons?i=${unique.join(',')}&theme=light`
}
