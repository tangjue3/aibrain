<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import loader from '@monaco-editor/loader'
import { useDarkMode } from '@/composables/useDarkMode'

const props = withDefaults(defineProps<{
  language?: string
  code?: string
  readOnly?: boolean
}>(), {
  language: 'python',
  code: '',
  readOnly: false
})

const emit = defineEmits<{ 'update:code': [value: string] }>()

const editorContainer = ref<HTMLElement>()
const { isDark } = useDarkMode()
let editor: any = null
let isLoaded = ref(false)

onMounted(async () => {
  if (!editorContainer.value) return
  const monaco = await loader.init()
  editor = monaco.editor.create(editorContainer.value, {
    value: props.code,
    language: props.language,
    theme: isDark.value ? 'vs-dark' : 'vs',
    fontSize: 14,
    minimap: { enabled: false },
    readOnly: props.readOnly,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 2,
    lineNumbers: 'on',
    renderLineHighlight: 'line'
  })

  editor.onDidChangeModelContent(() => {
    emit('update:code', editor.getValue())
  })

  isLoaded.value = true
})

watch(() => props.code, (val) => {
  if (editor && val !== editor.getValue()) {
    editor.setValue(val)
  }
})

watch(() => props.language, (lang) => {
  if (editor) {
    const monaco = (window as any).monaco
    if (monaco) {
      monaco.editor.setModelLanguage(editor.getModel(), lang)
    }
  }
})

watch(isDark, (dark) => {
  if (editor) {
    editor.updateOptions({ theme: dark ? 'vs-dark' : 'vs' })
  }
})

onUnmounted(() => {
  editor?.dispose()
})
</script>

<template>
  <div class="code-editor-wrapper">
    <div v-if="!isLoaded" class="editor-skeleton">
      <div class="skeleton-line" />
      <div class="skeleton-line" style="width: 80%" />
      <div class="skeleton-line" style="width: 60%" />
      <div class="skeleton-line" style="width: 90%" />
      <div class="skeleton-line" style="width: 45%" />
    </div>
    <div ref="editorContainer" class="editor-container" :style="{ display: isLoaded ? 'block' : 'none' }" />
  </div>
</template>

<style scoped>
.code-editor-wrapper {
  position: relative;
  height: 100%;
  min-height: 200px;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.editor-container {
  width: 100%;
  height: 100%;
}

.editor-skeleton {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.editor-skeleton .skeleton-line {
  height: 14px;
  background: var(--border-light);
  border-radius: 3px;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}
</style>
