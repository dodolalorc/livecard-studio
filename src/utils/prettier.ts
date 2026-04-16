export async function formatVueSfc(code: string) {
  const prettier = await import('prettier/standalone')
  const pluginBabel = await import('prettier/plugins/babel')
  const pluginEstree = await import('prettier/plugins/estree')
  const pluginHtml = await import('prettier/plugins/html')
  const pluginPostcss = await import('prettier/plugins/postcss')

  return prettier.format(code, {
    parser: 'vue',
    plugins: [pluginBabel.default, pluginEstree.default, pluginHtml.default, pluginPostcss.default],
    singleQuote: true,
    semi: false,
  })
}
