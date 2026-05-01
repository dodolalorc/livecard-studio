/**
 * exportUtils.ts
 * 公共工具函数。
 */

/** 格式化日期为 yyyyMMdd */
export function format(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}${m}${d}`
}
