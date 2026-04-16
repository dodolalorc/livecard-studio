import defaultComponentCode from '@/templates/default-card.vue?raw'
import introCardCode from '@/templates/intro-card.vue?raw'

export interface StyleControls {
  backgroundColor: string
  textColor: string
  accentColor: string
  radius: number
  padding: number
  shadowAlpha: number
}

export type PanelId = 'toolbar' | 'editor' | 'style' | 'preview'
export type PanelMode = 'docked' | 'floating' | 'window'

export interface PanelState {
  id: PanelId
  title: string
  mode: PanelMode
  column: 'left' | 'right'
  x: number
  y: number
  width: number
  height: number
  z: number
}

export interface ExamplePreset {
  id: string
  name: string
  description: string
  code: string
}

const INTRO_CARD_PRESET: ExamplePreset = {
  id: 'intro-card',
  name: '介绍卡片',
  description: '双栏人物介绍卡片，适合作为个人主页或简介页模块。',
  code: introCardCode,
}

const ENGINEER_CARD_PRESET: ExamplePreset = {
  id: 'engineer-card',
  name: '工程师名片',
  description: '更偏作品展示风格的开发者信息卡。',
  code: defaultComponentCode,
}

export const DEFAULT_STYLE_CONTROLS: StyleControls = {
  backgroundColor: '#15253a',
  textColor: '#f4f7fb',
  accentColor: '#f9b36a',
  radius: 28,
  padding: 30,
  shadowAlpha: 0.26,
}

export const EXAMPLE_PRESETS: ExamplePreset[] = [
  INTRO_CARD_PRESET,
  ENGINEER_CARD_PRESET,
]

export const DEFAULT_COMPONENT_CODE = INTRO_CARD_PRESET.code
export const DEFAULT_PRESET_ID = INTRO_CARD_PRESET.id
