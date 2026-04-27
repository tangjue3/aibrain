<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Splitpanes, Pane } from 'splitpanes'
import { useMediaQuery } from '@vueuse/core'
import { BREAKPOINTS } from '@/utils/constants'
import { useWorkspaceStore } from '@/stores/workspace'
import { useAiTutorStore } from '@/stores/aiTutor'
import { useCodeExecution } from '@/composables/useCodeExecution'
import { useAITutor } from '@/composables/useAITutor'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import ProgressTracker from '@/components/common/ProgressTracker.vue'
import AIDisclaimer from '@/components/common/AIDisclaimer.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import * as echarts from 'echarts'
import DOMPurify from 'dompurify'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const nodeId = computed(() => route.query.nodeId as string || '')
const workspaceStore = useWorkspaceStore()
const tutorStore = useAiTutorStore()
const { running, run } = useCodeExecution()
const { askWithError } = useAITutor()

const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.MOBILE_MAX}px)`)
const isTablet = useMediaQuery(`(min-width: ${BREAKPOINTS.TABLET_MIN}px) and (max-width: ${BREAKPOINTS.TABLET_MAX}px)`)

const code = ref('# 在此编写代码\nprint("Hello, AIBrain!")')
const codeOutput = ref('')
const isError = ref(false)
const mindmapChartRef = ref<HTMLElement>()
let mindmapChart: echarts.ECharts | null = null

// Markdown renderer setup
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true
})

// For highlighting
const onTextSelect = () => {
  const selection = window.getSelection()
  const text = selection?.toString().trim()
  if (text && text.length > 0) {
    // Show floating "Ask AI" button at selection position
    console.log('[Workspace] Text selected:', text.substring(0, 50))
  }
}

// Load demo content
onMounted(() => {
  workspaceStore.currentNodeId = nodeId.value
  // Simulate streaming lecture
  simulateStreamLecture()

  // Simulate mindmap
  setTimeout(() => simulateMindmap(), 1500)
})

const simulateStreamLecture = () => {
  workspaceStore.isStreaming = true
  const demoContent = `# 数据结构：栈与队列\n\n## 1. 栈的基本概念\n\n栈（Stack）是一种**后进先出（LIFO）**的线性数据结构。\n\n- 只允许在一端进行插入和删除操作\n- 这一端称为**栈顶**（Top）\n- 另一端称为**栈底**（Bottom）\n\n### 基本操作\n\n| 操作 | 描述 | 时间复杂度 |\n|------|------|------------|\n| push | 入栈 | O(1) |\n| pop | 出栈 | O(1) |\n| peek | 查看栈顶 | O(1) |\n| isEmpty | 判空 | O(1) |\n\n## 2. 栈的应用场景\n\n1. **函数调用**：递归调用栈\n2. **表达式求值**：中缀转后缀\n3. **括号匹配**：编译器的语法检查\n4. **撤销操作**：编辑器中的 Undo\n\n\`\`\`python\ndef is_balanced(s):\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for ch in s:\n        if ch in '({[':\n            stack.append(ch)\n        elif ch in ')}]':\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return len(stack) == 0\n\`\`\`\n\n> 💡 **关键要点**：栈的特性决定了它适合处理"最近相关"的问题。`
  workspaceStore.rawMarkdown = demoContent
  workspaceStore.isStreaming = false
}

const simulateMindmap = () => {
  workspaceStore.mindmapData = {
    name: '栈与队列',
    children: [
      { name: '栈(Stack)', children: [
        { name: 'LIFO原则' },
        { name: 'push/pop/peek' },
        { name: '顺序栈' },
        { name: '链式栈' }
      ]},
      { name: '队列(Queue)', children: [
        { name: 'FIFO原则' },
        { name: 'enqueue/dequeue' },
        { name: '循环队列' },
        { name: '双端队列' }
      ]},
      { name: '应用', children: [
        { name: '括号匹配' },
        { name: '表达式求值' },
        { name: 'BFS遍历' },
        { name: '缓冲区' }
      ]}
    ]
  }
  renderMindmap()
}

const renderMindmap = () => {
  if (!mindmapChartRef.value || !workspaceStore.mindmapData) return
  mindmapChart = echarts.init(mindmapChartRef.value)

  const toTreeSeries = (node: any): any => ({
    name: node.name,
    children: node.children?.map(toTreeSeries)
  })

  mindmapChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'tree',
      data: [toTreeSeries(workspaceStore.mindmapData)],
      top: '5%',
      left: '8%',
      bottom: '5%',
      right: '20%',
      symbolSize: 8,
      label: { fontSize: 12 },
      leaves: { label: { fontSize: 11 } },
      expandAndCollapse: true,
      animationDuration: 500
    }]
  })
}

// Code execution simulation
const handleRun = async () => {
  codeOutput.value = ''
  isError.value = false

  try {
    // Simulate execution result
    await new Promise((r) => setTimeout(r, 500))
    if (code.value.includes('error') || code.value.includes('Error')) {
      codeOutput.value = 'Traceback (most recent call last):\n  File "<stdin>", line 3, in <module>\nNameError: name \'undefined_var\' is not defined'
      isError.value = true
    } else {
      codeOutput.value = 'Hello, AIBrain!\nExecution completed successfully.'
    }
  } catch (e: any) {
    codeOutput.value = e.message
    isError.value = true
  }
}

const handleSendToAI = () => {
  askWithError(code.value, codeOutput.value, nodeId.value)
  tutorStore.togglePanel()
}

// Sanitize markdown
const safeHtml = computed(() => {
  return DOMPurify.sanitize(md.render(workspaceStore.rawMarkdown || ''))
})

onUnmounted(() => {
  mindmapChart?.dispose()
})
</script>

<template>
  <div class="workspace" @mouseup="onTextSelect">
    <div class="workspace-header">
      <h2>💻 学习工坊</h2>
      <span class="node-badge">{{ nodeId || 'demo-node' }}</span>
    </div>

    <!-- 3-Panel layout -->
    <div class="panels-container">
      <Splitpanes v-if="!isMobile" class="default-theme">
        <!-- Left: Stream Lecture -->
        <Pane :min-size="20" :size="35">
          <div class="panel panel-lecture">
            <div class="panel-header">📖 流式讲义</div>
            <div class="panel-body lecture-content">
              <SkeletonCard v-if="workspaceStore.isStreaming" :rows="10" />
              <div v-else class="markdown-body" v-html="safeHtml" />
              <AIDisclaimer source="教学智能体" :verified="true" />
            </div>
          </div>
        </Pane>

        <!-- Center: Visualization -->
        <Pane :min-size="25" :size="30">
          <div class="panel panel-viz">
            <div class="panel-header">🧠 思维导图</div>
            <div class="panel-body">
              <div ref="mindmapChartRef" class="mindmap-container" />
              <div v-if="!workspaceStore.mindmapData" class="empty-state">
                <SkeletonCard :rows="6" />
              </div>
            </div>
          </div>
        </Pane>

        <!-- Right: Code Sandbox -->
        <Pane :min-size="25" :size="35">
          <div class="panel panel-code">
            <div class="panel-header">
              ⌨️ AI 代码沙箱
              <span class="lang-badge">Python</span>
            </div>
            <div class="panel-body code-panel">
              <div class="editor-area">
                <CodeEditor
                  v-model:code="code"
                  language="python"
                />
              </div>
              <div class="code-actions">
                <button
                  class="run-btn"
                  :disabled="running"
                  @click="handleRun"
                >
                  {{ running ? '⏳ 运行中...' : '▶ 运行' }}
                </button>
              </div>
              <div v-if="codeOutput" class="code-output" :class="{ error: isError }">
                <pre>{{ codeOutput }}</pre>
                <button
                  v-if="isError"
                  class="ask-ai-btn"
                  @click="handleSendToAI"
                >
                  🤖 抛给AI分析
                </button>
              </div>
            </div>
          </div>
        </Pane>
      </Splitpanes>

      <!-- Mobile: stacked layout -->
      <div v-else class="mobile-panels">
        <div class="panel">
          <div class="panel-header">📖 讲义</div>
          <div class="panel-body lecture-content">
            <div class="markdown-body" v-html="safeHtml" />
          </div>
        </div>
        <div class="panel">
          <div class="panel-header">⌨️ 代码</div>
          <div class="panel-body">
            <div class="editor-area" style="height:250px">
              <CodeEditor v-model:code="code" language="python" />
            </div>
            <div class="code-actions">
              <button class="run-btn" :disabled="running" @click="handleRun">
                {{ running ? '⏳ 运行中...' : '▶ 运行' }}
              </button>
            </div>
            <div v-if="codeOutput" class="code-output" :class="{ error: isError }">
              <pre>{{ codeOutput }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.workspace-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.workspace-header h2 {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

.node-badge {
  padding: 2px 10px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 12px;
  font-size: var(--font-size-xs);
}

.panels-container {
  flex: 1;
  overflow: hidden;
}

.panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.panel-header {
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  background: var(--bg-hover);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.lecture-content {
  line-height: 1.8;
}

/* Markdown styles */
.markdown-body :deep(h1) { font-size: 1.5em; margin: 16px 0 8px; }
.markdown-body :deep(h2) { font-size: 1.3em; margin: 14px 0 6px; border-bottom: 1px solid var(--border-color); padding-bottom: 4px; }
.markdown-body :deep(h3) { font-size: 1.1em; margin: 12px 0 4px; }
.markdown-body :deep(p) { margin: 8px 0; }
.markdown-body :deep(ul), .markdown-body :deep(ol) { padding-left: 20px; }
.markdown-body :deep(li) { margin: 4px 0; }
.markdown-body :deep(code) { background: var(--bg-hover); padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
.markdown-body :deep(pre) { background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 6px; overflow-x: auto; margin: 12px 0; }
.markdown-body :deep(blockquote) { border-left: 3px solid var(--color-primary); padding-left: 12px; color: var(--text-secondary); margin: 10px 0; }
.markdown-body :deep(table) { border-collapse: collapse; width: 100%; margin: 10px 0; }
.markdown-body :deep(th), .markdown-body :deep(td) { border: 1px solid var(--border-color); padding: 6px 10px; text-align: left; font-size: 13px; }
.markdown-body :deep(th) { background: var(--bg-hover); }

.mindmap-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.code-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.editor-area {
  flex: 1;
  min-height: 200px;
}

.code-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.run-btn {
  padding: 8px 20px;
  background: var(--color-success);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.run-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.code-output {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-family: 'Courier New', monospace;
  font-size: 13px;
  max-height: 200px;
  overflow-y: auto;
  flex-shrink: 0;
}

.code-output pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.code-output.error {
  border-left: 3px solid var(--color-danger);
}

.ask-ai-btn {
  margin-top: var(--spacing-sm);
  padding: 6px 16px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: var(--font-size-xs);
}

.lang-badge {
  font-weight: 400;
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  background: var(--bg-hover);
  border-radius: 10px;
}

.mobile-panels {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow-y: auto;
  flex: 1;
}

.mobile-panels .panel {
  min-height: 300px;
  max-height: 50vh;
}
</style>

<style>
/* Splitpanes theme */
.splitpanes.default-theme .splitpanes__pane {
  background: transparent;
}
.splitpanes.default-theme .splitpanes__splitter {
  background: var(--border-color);
  min-width: 4px;
  min-height: 4px;
}
</style>
