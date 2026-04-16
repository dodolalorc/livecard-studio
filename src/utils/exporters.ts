import JSZip from 'jszip'

import usageExample from '@/templates/usage-example.txt?raw'
import type { StyleControls } from '@/utils/defaultCard'

function extractFunctionNames(code: string) {
  const matches = code.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)
  return [...matches].map((match) => match[1])
}

function inferPropsSection(code: string) {
  const definePropsMatch = code.match(/defineProps<([\s\S]*?)>\(\)/)
  if (definePropsMatch?.[1]) {
    return definePropsMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n')
  }

  const runtimePropsMatch = code.match(/props:\s*\{([\s\S]*?)\n\s*\}/)
  return runtimePropsMatch?.[1]?.trim() ?? '未检测到显式 props。'
}

function buildUsageDoc(code: string, controls: StyleControls) {
  const propsText = inferPropsSection(code)
  const functionNames = extractFunctionNames(code)
  const methodsText = functionNames.length
    ? functionNames.map((name) => ['- ', name, '()'].join('')).join('\n')
    : '- 未检测到具名函数。'

  return [
    'Vue Card Editor 导出文档',
    '',
    '1. 文件说明',
    '- Component.vue: 当前编辑器中的组件源码。',
    '- style-tokens.json: 从样式面板同步出的核心视觉参数。',
    '- USAGE.txt: 当前这份说明。',
    '',
    '2. 推断出的 Props',
    propsText,
    '',
    '3. 推断出的 Methods / Handlers',
    methodsText,
    '',
    '4. 默认使用方式',
    usageExample,
    '',
    '5. 样式面板快照',
    JSON.stringify(controls, null, 2),
    '',
    '6. 说明',
    '- 若组件中包含远程图片，请保证部署环境能够访问对应地址。',
    '- 当前导出文档基于源码静态推断生成，复杂逻辑请结合实际代码阅读。',
  ].join('\n')
}

export async function buildComponentZip(code: string, controls: StyleControls) {
  const zip = new JSZip()
  zip.file('Component.vue', code)
  zip.file('style-tokens.json', JSON.stringify(controls, null, 2))
  zip.file('USAGE.txt', buildUsageDoc(code, controls))
  return zip.generateAsync({ type: 'blob' })
}
