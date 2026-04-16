import { DEFAULT_STYLE_CONTROLS, type StyleControls } from '@/utils/defaultCard'

const TOKEN_MAP = {
  backgroundColor: '--card-bg',
  textColor: '--card-fg',
  accentColor: '--card-accent',
  radius: '--card-radius',
  padding: '--card-padding',
  shadowAlpha: '--card-shadow-alpha',
} as const

function readCssVar(code: string, variable: string) {
  const match = code.match(new RegExp(`${variable}:\\s*([^;]+);`))
  return match?.[1]?.trim()
}

function writeCssVar(code: string, variable: string, value: string) {
  const pattern = new RegExp(`(${variable}:\\s*)([^;]+)(;)`)
  if (pattern.test(code)) {
    return code.replace(pattern, `$1${value}$3`)
  }

  const styleOpen = code.match(/<style[^>]*>/)
  if (!styleOpen) {
    return `${code}\n\n<style scoped>\n.card-shell {\n  ${variable}: ${value};\n}\n</style>\n`
  }

  const selectorPattern = /(\.card-shell\s*\{)([\s\S]*?)(\n\})/
  if (selectorPattern.test(code)) {
    return code.replace(selectorPattern, `$1$2\n  ${variable}: ${value};$3`)
  }

  return code.replace(styleOpen[0], `${styleOpen[0]}\n.card-shell {\n  ${variable}: ${value};\n}\n`)
}

function formatForToken(key: keyof StyleControls, value: StyleControls[keyof StyleControls]) {
  switch (key) {
    case 'radius':
    case 'padding':
      return `${value}px`
    case 'shadowAlpha':
      return String(value)
    default:
      return String(value)
  }
}

function parseNumber(value: string | undefined, fallback: number, suffix = '') {
  if (!value) return fallback
  const normalized = suffix ? value.replace(suffix, '') : value
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function extractStyleControls(code: string): StyleControls {
  return {
    backgroundColor: readCssVar(code, TOKEN_MAP.backgroundColor) ?? DEFAULT_STYLE_CONTROLS.backgroundColor,
    textColor: readCssVar(code, TOKEN_MAP.textColor) ?? DEFAULT_STYLE_CONTROLS.textColor,
    accentColor: readCssVar(code, TOKEN_MAP.accentColor) ?? DEFAULT_STYLE_CONTROLS.accentColor,
    radius: parseNumber(readCssVar(code, TOKEN_MAP.radius), DEFAULT_STYLE_CONTROLS.radius, 'px'),
    padding: parseNumber(readCssVar(code, TOKEN_MAP.padding), DEFAULT_STYLE_CONTROLS.padding, 'px'),
    shadowAlpha: parseNumber(
      readCssVar(code, TOKEN_MAP.shadowAlpha),
      DEFAULT_STYLE_CONTROLS.shadowAlpha,
    ),
  }
}

export function applyStyleControlsToCode(code: string, controls: StyleControls) {
  let nextCode = code
  ;(Object.keys(TOKEN_MAP) as (keyof StyleControls)[]).forEach((key) => {
    nextCode = writeCssVar(nextCode, TOKEN_MAP[key], formatForToken(key, controls[key]))
  })
  return nextCode
}

export function styleControlsEqual(left: StyleControls, right: StyleControls) {
  return JSON.stringify(left) === JSON.stringify(right)
}
