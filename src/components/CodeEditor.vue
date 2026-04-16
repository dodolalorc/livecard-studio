<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import definePropsSnippet from '@/templates/define-props-snippet.txt?raw'
import vueSfcScaffold from '@/templates/vue-sfc-scaffold.txt?raw'

const props = defineProps<{
  modelValue: string
  errorMessage?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const editorRef = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)
const modelRef = shallowRef<monaco.editor.ITextModel | null>(null)

const lineCount = computed(() => props.modelValue.split('\n').length)
const characterCount = computed(() => props.modelValue.length)

let isApplyingExternalValue = false
let vueLanguageRegistered = false

window.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }

    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }

    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }

    return new editorWorker()
  },
}

function registerVueLanguage() {
  if (vueLanguageRegistered) return

  vueLanguageRegistered = true
  monaco.languages.register({ id: 'vue-sfc' })
  monaco.languages.setMonarchTokensProvider('vue-sfc', {
    defaultToken: '',
    tokenPostfix: '.vue',
    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.square' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' },
    ],
    tokenizer: {
      root: [
        [/<!DOCTYPE/, 'metatag', '@doctype'],
        [/<!--/, 'comment', '@comment'],
        [/<\/?[A-Za-z][\w-]*/, 'tag'],
        [/[{}]/, 'delimiter.curly'],
        [/".*?"/, 'string'],
        [/'.*?'/, 'string'],
        [/\b(import|from|const|let|function|return|export|default|defineProps|defineEmits|ref|computed)\b/, 'keyword'],
        [/\b(template|script|style|setup|scoped|lang)\b/, 'attribute.name'],
        [/[=:]/, 'delimiter'],
        [/\b\d+\b/, 'number'],
      ],
      comment: [
        [/-->/, 'comment', '@pop'],
        [/[^-]+/, 'comment.content'],
        [/./, 'comment.content'],
      ],
      doctype: [
        [/>/, 'metatag', '@pop'],
        [/[^>]+/, 'metatag.content'],
      ],
    },
  })

  monaco.languages.registerCompletionItemProvider('vue-sfc', {
    provideCompletionItems(model: monaco.editor.ITextModel, position: monaco.Position) {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      return {
        suggestions: [
          {
            label: 'Vue SFC Scaffold',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: vueSfcScaffold,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: '快速插入一个 Vue 单文件组件模板。',
            range,
          },
          {
            label: 'defineProps',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: definePropsSnippet,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: '插入 `defineProps` 类型声明。',
            range,
          },
        ],
      }
    },
  })
}

onMounted(() => {
  if (!containerRef.value) return

  registerVueLanguage()

  modelRef.value = monaco.editor.createModel(
    props.modelValue,
    'vue-sfc',
    monaco.Uri.parse('file:///workspace/PlaygroundCard.vue'),
  )

  editorRef.value = monaco.editor.create(containerRef.value, {
    model: modelRef.value,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 22,
    fontFamily: '"JetBrains Mono", "SFMono-Regular", monospace',
    smoothScrolling: true,
    padding: { top: 18, bottom: 18 },
    tabSize: 2,
    theme: 'vs-dark',
    wordWrap: 'on',
    scrollBeyondLastLine: false,
    renderWhitespace: 'selection',
  })

  editorRef.value.onDidChangeModelContent(() => {
    if (!modelRef.value || isApplyingExternalValue) return
    emit('update:modelValue', modelRef.value.getValue())
  })
})

watch(
  () => props.modelValue,
  (value) => {
    if (!modelRef.value || value === modelRef.value.getValue()) return
    isApplyingExternalValue = true
    modelRef.value.pushEditOperations(
      [],
      [{ range: modelRef.value.getFullModelRange(), text: value }],
      () => null,
    )
    isApplyingExternalValue = false
  },
)

watch(
  () => props.errorMessage,
  (message) => {
    if (!modelRef.value) return
    monaco.editor.setModelMarkers(
      modelRef.value,
      'preview-compiler',
      message
        ? [
            {
              message,
              severity: monaco.MarkerSeverity.Error,
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 2,
            },
          ]
        : [],
    )
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  editorRef.value?.dispose()
  modelRef.value?.dispose()
})
</script>

<template>
  <div class="code-panel">
    <div ref="containerRef" class="code-panel__editor" />
    <footer class="code-panel__meta">
      <span>{{ lineCount }} 行</span>
      <span>{{ characterCount }} 字符</span>
      <span :class="{ 'code-panel__meta-error': errorMessage }">
        {{ errorMessage ? '存在编译错误' : '语法检查通过' }}
      </span>
    </footer>
  </div>
</template>

<style scoped>
.code-panel {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  height: 100%;
}

.code-panel__editor {
  min-height: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.code-panel__meta {
  display: flex;
  gap: 14px;
  padding-top: 12px;
  color: #94a69c;
  font-size: 12px;
}

.code-panel__meta-error {
  color: #d06a57;
}
</style>
