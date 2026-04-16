import * as VueRuntime from 'vue'
import {
  type BindingMetadata,
  compileScript,
  compileStyle,
  compileTemplate,
  parse,
} from '@vue/compiler-sfc'

function makeScopeId(source: string) {
  let hash = 0
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0
  }
  return `data-v-${hash.toString(16)}`
}

function replaceVueImports(code: string) {
  return code.replace(
    /import\s+\{([^}]+)\}\s+from\s+['"]vue['"];?/g,
    (_, specifiers: string) =>
      `const { ${specifiers
        .split(',')
        .map((item) => item.trim().replace(/\sas\s/g, ': '))
        .join(', ')} } = VueRuntime`,
  )
}

function assertNoUnsupportedImports(code: string) {
  const nonVueImport = code.match(/import\s+[\s\S]*?from\s+['"](?!vue['"])/)
  if (nonVueImport) {
    throw new Error('预览暂不支持从外部模块导入，请在单文件组件内直接编写逻辑。')
  }
}

export function compileVueSfc(source: string) {
  const filename = 'PlaygroundCard.vue'
  const scopeId = makeScopeId(source)
  const { descriptor, errors } = parse(source, { filename })

  if (errors.length > 0) {
    throw new Error(String(errors[0]))
  }

  const warnings: string[] = []
  const compiledStyles = descriptor.styles.map((style) => {
    const result = compileStyle({
      source: style.content,
      filename,
      id: scopeId,
      scoped: style.scoped,
    })

    if (result.errors.length > 0) {
      throw new Error(String(result.errors[0]))
    }

    return result.code
  })

  let scriptCode = 'const __sfc__ = {}'
  let bindings: BindingMetadata | undefined

  if (descriptor.script || descriptor.scriptSetup) {
    const script = compileScript(descriptor, {
      id: scopeId,
    })

    assertNoUnsupportedImports(script.content)
    bindings = script.bindings
    scriptCode = replaceVueImports(
      script.content.replace(/export\s+default/, 'const __sfc__ ='),
    )
  }

  const templateResult = descriptor.template
    ? compileTemplate({
        id: scopeId,
        filename,
        source: descriptor.template.content,
        scoped: descriptor.styles.some((style) => style.scoped),
        compilerOptions: {
          bindingMetadata: bindings,
        },
      })
    : {
        code: 'export function render() { return null }',
        errors: [],
        tips: [],
      }

  if (templateResult.errors.length > 0) {
    throw new Error(String(templateResult.errors[0]))
  }

  warnings.push(...templateResult.tips)
  const templateCode = replaceVueImports(templateResult.code).replace(
    /export\s+function\s+render/,
    'function render',
  )

  const componentFactory = new Function(
    'VueRuntime',
    `
${scriptCode}
${templateCode}
__sfc__.render = render
return __sfc__
`,
  ) as (runtime: typeof VueRuntime) => object

  return {
    component: componentFactory(VueRuntime),
    styles: compiledStyles,
    warnings,
  }
}
