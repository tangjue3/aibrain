<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSkillLabStore, type SkillCase } from '@/stores/skillLab'
import SkillCanvas from '@/components/graph/SkillCanvas.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import type { CoTStep } from '@/api/types'

const store = useSkillLabStore()
const isLoading = ref(true)
const selectedCase = ref<SkillCase | null>(null)
const isExecuting = ref(false)

// Demo cases
onMounted(() => {
  setTimeout(() => {
    const demos: SkillCase[] = [
      {
        id: '1',
        title: '代码自动纠错',
        description: '使用 LLM 分析代码错误并提供修复建议，自动定位 bug 行并生成修复代码。',
        tags: ['LLM', 'Code', 'Debug'],
        steps: ['输入错误代码', 'LLM 分析错误', '生成修复建议', '输出修复代码'],
        presetCode: '# 错误代码示例\ndef add(a, b):\n    return a - b  # bug here'
      },
      {
        id: '2',
        title: '知识问答 Agent',
        description: '结合网络搜索和 LLM，构建可回答最新技术问题的问答智能体。',
        tags: ['LLM', 'WebSearch', 'RAG'],
        steps: ['接收用户问题', '搜索相关资料', 'LLM 整合信息', '返回答案']
      },
      {
        id: '3',
        title: '代码自动生成与测试',
        description: '根据需求描述生成代码，自动运行测试用例，输出通过率报告。',
        tags: ['CodeExec', 'LLM', 'Testing'],
        steps: ['理解需求描述', '生成代码', '运行测试', '输出通过率']
      },
      {
        id: '4',
        title: '学习报告生成器',
        description: '分析学习数据，自动生成个性化学习报告和改进建议。',
        tags: ['LLM', 'Report', 'Analytics'],
        steps: ['收集学习数据', '分析薄弱点', '生成报告', '输出PDF']
      }
    ]
    store.setCases(demos)
    isLoading.value = false
  }, 500)
})

const selectCase = (c: SkillCase) => {
  selectedCase.value = c
}

const cloneCase = (c: SkillCase) => {
  selectedCase.value = c
  // Simulate loading canvas
  store.clearCanvas()
  // Add nodes based on steps
  c.steps.forEach((step, i) => {
    const types = ['Input', 'LLM_Chat', 'WebSearch', 'CodeExec', 'Output'] as const
    store.addNode({
      id: `clone_${i}_${Date.now()}`,
      type: types[Math.min(i, types.length - 1)],
      x: 100 + i * 150,
      y: 200,
      config: { label: step }
    })
  })
}

const executeSkill = async () => {
  if (store.canvasNodes.length === 0) return
  store.isExecuting = true
  isExecuting.value = true

  // Simulate CoT execution
  const steps: CoTStep[] = [
    { step: 1, thought: '开始执行 Skill 流程...', action: '初始化节点' },
    { step: 2, thought: '正在加载输入数据，检查数据格式...', action: 'Input 节点处理', observation: '输入格式正确' },
    { step: 3, thought: '将处理后的数据送入 LLM 分析...', action: 'LLM_Chat 节点分析', observation: '分析完成，生成摘要' },
    { step: 4, thought: '执行代码生成逻辑，编译检查...', action: 'CodeExec 节点执行', observation: '代码执行成功' },
    { step: 5, thought: '整合所有输出，格式化最终结果', action: 'Output 节点输出' }
  ]

  store.cotSteps = []
  for (const step of steps) {
    await new Promise((r) => setTimeout(r, 800))
    store.addCoTStep(step)
  }

  store.isExecuting = false
  isExecuting.value = false
}
</script>

<template>
  <div class="skill-lab-page">
    <h2 class="page-title">🔧 AI 实操与 Skill 工坊</h2>

    <!-- Case Library -->
    <div class="section">
      <div class="section-header">
        <h3>📚 案例库</h3>
      </div>
      <div class="case-grid">
        <SkeletonCard v-if="isLoading" v-for="i in 4" :key="i" :rows="3" />
        <div
          v-for="c in store.cases"
          :key="c.id"
          class="case-card"
          :class="{ selected: selectedCase?.id === c.id }"
          @click="selectCase(c)"
        >
          <h4>{{ c.title }}</h4>
          <p>{{ c.description }}</p>
          <div class="case-tags">
            <span v-for="tag in c.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="case-actions">
            <button class="clone-btn" @click.stop="cloneCase(c)">📥 克隆到工作台</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Skill Canvas -->
    <div class="section">
      <div class="section-header">
        <h3>🎨 Skill 组装台</h3>
        <div class="header-actions">
          <button
            class="execute-btn"
            :disabled="store.isExecuting || store.canvasNodes.length === 0"
            @click="executeSkill"
          >
            {{ store.isExecuting ? '⏳ 执行中...' : '▶ 运行 Skill' }}
          </button>
          <button class="save-btn" @click="console.log('Saved:', store.serializeCanvas())">
            💾 保存
          </button>
        </div>
      </div>
      <SkillCanvas />
    </div>

    <!-- CoT Viewer -->
    <div v-if="store.cotSteps.length > 0" class="section">
      <div class="section-header">
        <h3>🧠 思考链 (Chain of Thought)</h3>
      </div>
      <div class="cot-timeline">
        <div
          v-for="step in store.cotSteps"
          :key="step.step"
          class="cot-step"
          :class="{ 'step-active': step === store.cotSteps[store.cotSteps.length - 1] }"
        >
          <div class="step-indicator">
            <span class="step-num">{{ step.step }}</span>
          </div>
          <div class="step-content">
            <p class="step-thought">💭 {{ step.thought }}</p>
            <p v-if="step.action" class="step-action">🔧 {{ step.action }}</p>
            <p v-if="step.observation" class="step-obs">👁 {{ step.observation }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-lab-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.section {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.section-header h3 {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--spacing-md);
}

.case-card {
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.case-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.case-card.selected {
  border-color: var(--color-primary);
  background: var(--bg-hover);
}

.case-card h4 {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.case-card p {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.case-tags {
  display: flex;
  gap: 4px;
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap;
}

.tag {
  padding: 2px 8px;
  background: var(--bg-hover);
  border-radius: 10px;
  font-size: 11px;
  color: var(--text-secondary);
}

.case-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.clone-btn {
  padding: 4px 12px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  cursor: pointer;
}

.execute-btn {
  padding: 8px 20px;
  background: var(--color-success);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.execute-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-btn {
  padding: 8px 16px;
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  color: var(--text-regular);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

/* CoT Timeline */
.cot-timeline {
  position: relative;
  padding-left: 30px;
}

.cot-timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.cot-step {
  position: relative;
  margin-bottom: var(--spacing-md);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.cot-step.step-active {
  opacity: 1;
}

.step-indicator {
  position: absolute;
  left: -23px;
  top: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.step-num {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.step-content {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-hover);
  border-radius: var(--border-radius-sm);
}

.step-thought, .step-action, .step-obs {
  font-size: var(--font-size-sm);
  margin-bottom: 4px;
  color: var(--text-regular);
}

.step-thought { color: var(--text-primary); font-weight: 500; }
.step-action { color: var(--color-primary); }
.step-obs { color: var(--color-success); }
</style>
