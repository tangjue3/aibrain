<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserProfileStore } from '@/stores/userProfile'
import { useMediaQuery } from '@vueuse/core'
import { BREAKPOINTS } from '@/utils/constants'
import RadarChart from '@/components/charts/RadarChart.vue'

const store = useUserProfileStore()
const router = useRouter()
const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.MOBILE_MAX}px)`)

const currentStep = ref(0)
const isTransitioning = ref(false)
const isGenerating = ref(false)
const isGenerated = ref(false)

const steps = [
  { title: '基本信息', desc: '让我们认识你' },
  { title: '学习偏好', desc: '了解你的学习方式' },
  { title: '技术背景', desc: '评估你的技术能力' },
  { title: '画像生成', desc: '生成你的专属画像' }
]

const formData = ref({
  name: store.basicInfo.name || '',
  grade: store.basicInfo.grade || '',
  major: store.basicInfo.major || '',
  school: store.basicInfo.school || '',
  style: store.learningPreference.style || '',
  dailyHours: store.learningPreference.dailyHours || '',
  goal: store.learningPreference.goal || '',
  focusAreas: [...(store.learningPreference.focusAreas || [])],
  languages: [...(store.techBackground.languages || [])],
  frameworks: [...(store.techBackground.frameworks || [])],
  proficiency: store.techBackground.proficiency || '',
  projectExperience: store.techBackground.projectExperience || ''
})

const gradeOptions = ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '博士']
const styleOptions = [
  { value: 'visual', label: '视觉学习', desc: '偏好图表、视频、思维导图' },
  { value: 'reading', label: '阅读学习', desc: '偏好文档、教材、技术博客' },
  { value: 'hands-on', label: '实践学习', desc: '偏好动手编码、项目实战' },
  { value: 'social', label: '交流学习', desc: '偏好讨论、结对编程、社区' }
]
const hoursOptions = ['<1小时', '1-2小时', '2-4小时', '4-6小时', '6小时以上']
const goalOptions = [
  { value: 'exam', label: '应对考试' },
  { value: 'job', label: '求职准备' },
  { value: 'interest', label: '兴趣驱动' },
  { value: 'research', label: '科研需要' },
  { value: 'career', label: '职业提升' }
]
const focusAreaOptions = ['算法与数据结构', '系统设计', '前端开发', '后端开发', '人工智能', '网络安全', '数据库', '移动开发', '云计算', 'DevOps']
const languageOptions = ['C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'C#', 'PHP', 'Swift', 'Kotlin']
const frameworkOptions = ['React', 'Vue', 'Angular', 'Spring Boot', 'Django', 'Flask', 'Express', 'Next.js', 'Node.js', 'Flutter', 'PyTorch', 'TensorFlow']
const proficiencyOptions = [
  { value: 'beginner', label: '入门阶段', score: 20 },
  { value: 'elementary', label: '初级水平', score: 40 },
  { value: 'intermediate', label: '中级水平', score: 60 },
  { value: 'advanced', label: '高级水平', score: 80 },
  { value: 'expert', label: '专家水平', score: 95 }
]

const toggleArrayItem = (arr: string[], item: string) => {
  const idx = arr.indexOf(item)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(item)
}

const isFocusSelected = (item: string) => formData.value.focusAreas.includes(item)
const isLangSelected = (item: string) => formData.value.languages.includes(item)
const isFwSelected = (item: string) => formData.value.frameworks.includes(item)

const canNext = computed(() => {
  const d = formData.value
  switch (currentStep.value) {
    case 0: return d.name.trim() !== '' && d.grade !== '' && d.major.trim() !== ''
    case 1: return d.style !== '' && d.dailyHours !== '' && d.goal !== '' && d.focusAreas.length > 0
    case 2: return d.languages.length > 0 && d.proficiency !== ''
    default: return true
  }
})

const saveCurrentStep = () => {
  const d = formData.value
  switch (currentStep.value) {
    case 0:
      store.basicInfo = { name: d.name, grade: d.grade, major: d.major, school: d.school }
      store.userName = d.name
      break
    case 1:
      store.learningPreference = { style: d.style, dailyHours: d.dailyHours, goal: d.goal, focusAreas: [...d.focusAreas] }
      break
    case 2:
      store.techBackground = { languages: [...d.languages], frameworks: [...d.frameworks], proficiency: d.proficiency, projectExperience: d.projectExperience }
      break
  }
}

const goNext = () => {
  if (!canNext.value || isTransitioning.value) return
  saveCurrentStep()
  isTransitioning.value = true
  setTimeout(() => {
    currentStep.value++
    isTransitioning.value = false
    if (currentStep.value === 3) {
      generateProfile()
    }
  }, 300)
}

const goPrev = () => {
  if (currentStep.value <= 0 || isTransitioning.value) return
  isTransitioning.value = true
  setTimeout(() => {
    currentStep.value--
    isTransitioning.value = false
  }, 300)
}

const generateProfile = () => {
  isGenerating.value = true

  const d = formData.value
  const langCount = d.languages.length
  const fwCount = d.frameworks.length
  const profScore = proficiencyOptions.find(p => p.value === d.proficiency)?.score || 30
  const focusCount = d.focusAreas.length

  const styleMap: Record<string, number> = { visual: 70, reading: 55, 'hands-on': 85, social: 45 }
  const goalMap: Record<string, number> = { exam: 50, job: 75, interest: 80, research: 65, career: 70 }
  const hoursMap: Record<string, number> = { '<1小时': 25, '1-2小时': 40, '2-4小时': 60, '4-6小时': 80, '6小时以上': 95 }

  const knowledgeBase = Math.min(100, Math.round(profScore * 0.5 + langCount * 5 + fwCount * 3))
  const cognitiveStyle = styleMap[d.style] || 50
  const errorPreference = Math.min(100, Math.round(profScore * 0.6 + (d.projectExperience ? 15 : 0)))
  const logic = Math.min(100, Math.round(profScore * 0.7 + focusCount * 4))
  const progress = Math.min(100, Math.round(profScore * 0.4 + langCount * 6))
  const engagement = hoursMap[d.dailyHours] || 50

  const targets = { knowledgeBase, cognitiveStyle, errorPreference, logic, progress, engagement }
  const keys = Object.keys(targets) as (keyof typeof targets)[]
  let i = 0

  const interval = setInterval(() => {
    if (i >= keys.length) {
      clearInterval(interval)
      isGenerating.value = false
      isGenerated.value = true
      return
    }
    store.updateRadar(keys[i], targets[keys[i]])
    i++
  }, 400)
}

const startLearning = () => {
  store.completeOnboarding()
  router.push('/dashboard')
}
</script>

<template>
  <div class="onboarding-page">
    <div class="onboarding-container" :class="{ 'is-mobile': isMobile }">
      <div class="main-section">
        <div class="header">
          <h1 class="page-title">学习画像采集</h1>
          <p class="page-desc">完善你的个人信息，AI 将为你定制专属学习路径</p>
          
          <div class="progress-tracker">
            <div
              v-for="(step, idx) in steps"
              :key="idx"
              class="progress-item"
            >
              <div class="step-circle" :class="{ active: idx === currentStep, done: idx < currentStep }">
                <span v-if="idx < currentStep" class="check-icon">✓</span>
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <div v-if="idx < steps.length - 1" class="step-line" :class="{ active: idx < currentStep }" />
            </div>
          </div>
        </div>

        <div class="step-content" :class="{ 'fade-out': isTransitioning }">
          <div v-if="currentStep === 0" class="step-panel">
            <h2 class="step-title">基本信息</h2>
            <p class="step-subtitle">让我们认识一下你</p>

            <div class="form-group">
              <label class="form-label">姓名 <span class="required">*</span></label>
              <input v-model="formData.name" class="form-input" placeholder="请输入你的姓名" />
            </div>

            <div class="form-group">
              <label class="form-label">年级 <span class="required">*</span></label>
              <div class="grade-grid">
                <button
                  v-for="opt in gradeOptions"
                  :key="opt"
                  class="grade-btn"
                  :class="{ selected: formData.grade === opt }"
                  @click="formData.grade = opt"
                >
                  {{ opt }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">专业 <span class="required">*</span></label>
              <input v-model="formData.major" class="form-input" placeholder="如：计算机科学与技术" />
            </div>

            <div class="form-group">
              <label class="form-label">学校</label>
              <input v-model="formData.school" class="form-input" placeholder="请输入你的学校（选填）" />
            </div>
          </div>

          <div v-if="currentStep === 1" class="step-panel">
            <h2 class="step-title">学习偏好</h2>
            <p class="step-subtitle">了解你的学习方式，更好地为你推荐内容</p>

            <div class="form-group">
              <label class="form-label">学习风格 <span class="required">*</span></label>
              <div class="card-grid cols-2">
                <button
                  v-for="opt in styleOptions"
                  :key="opt.value"
                  class="card-btn"
                  :class="{ selected: formData.style === opt.value }"
                  @click="formData.style = opt.value"
                >
                  <span class="card-label">{{ opt.label }}</span>
                  <span class="card-desc">{{ opt.desc }}</span>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">每日学习时长 <span class="required">*</span></label>
              <div class="option-grid cols-5">
                <button
                  v-for="opt in hoursOptions"
                  :key="opt"
                  class="option-btn"
                  :class="{ selected: formData.dailyHours === opt }"
                  @click="formData.dailyHours = opt"
                >
                  {{ opt }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">学习目标 <span class="required">*</span></label>
              <div class="option-grid cols-3">
                <button
                  v-for="opt in goalOptions"
                  :key="opt.value"
                  class="option-btn"
                  :class="{ selected: formData.goal === opt.value }"
                  @click="formData.goal = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">关注方向 <span class="required">*</span></label>
              <div class="tag-grid">
                <button
                  v-for="opt in focusAreaOptions"
                  :key="opt"
                  class="tag-btn"
                  :class="{ selected: isFocusSelected(opt) }"
                  @click="toggleArrayItem(formData.focusAreas, opt)"
                >
                  {{ opt }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="currentStep === 2" class="step-panel">
            <h2 class="step-title">技术背景</h2>
            <p class="step-subtitle">评估你的技术能力，精准匹配学习内容</p>

            <div class="form-group">
              <label class="form-label">掌握的编程语言 <span class="required">*</span></label>
              <div class="tag-grid">
                <button
                  v-for="opt in languageOptions"
                  :key="opt"
                  class="tag-btn"
                  :class="{ selected: isLangSelected(opt) }"
                  @click="toggleArrayItem(formData.languages, opt)"
                >
                  {{ opt }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">熟悉的框架/工具</label>
              <div class="tag-grid">
                <button
                  v-for="opt in frameworkOptions"
                  :key="opt"
                  class="tag-btn"
                  :class="{ selected: isFwSelected(opt) }"
                  @click="toggleArrayItem(formData.frameworks, opt)"
                >
                  {{ opt }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">综合技术水平 <span class="required">*</span></label>
              <div class="option-grid cols-5">
                <button
                  v-for="opt in proficiencyOptions"
                  :key="opt.value"
                  class="option-btn"
                  :class="{ selected: formData.proficiency === opt.value }"
                  @click="formData.proficiency = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">项目经验</label>
              <textarea
                v-model="formData.projectExperience"
                class="form-textarea"
                placeholder="简要描述你做过的项目或实习经历（选填）"
                rows="3"
              />
            </div>
          </div>

          <div v-if="currentStep === 3" class="step-panel">
            <h2 class="step-title">画像生成</h2>
            <p class="step-subtitle">{{ isGenerating ? 'AI 正在分析你的信息...' : '你的专属学习画像已生成' }}</p>

            <div v-if="isGenerating" class="generating-state">
              <div class="spinner" />
              <p class="gen-text">正在生成你的六维能力画像...</p>
            </div>

            <div v-if="isGenerated" class="profile-summary">
              <div class="summary-header">
                <div class="avatar-circle">{{ formData.name.charAt(0) }}</div>
                <div class="summary-info">
                  <h3>{{ formData.name }}</h3>
                  <p>{{ formData.grade }} · {{ formData.major }}{{ formData.school ? ' · ' + formData.school : '' }}</p>
                </div>
              </div>

              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">学习风格</span>
                  <span class="summary-value">{{ styleOptions.find(s => s.value === formData.style)?.label }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">每日学习</span>
                  <span class="summary-value">{{ formData.dailyHours }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">学习目标</span>
                  <span class="summary-value">{{ goalOptions.find(g => g.value === formData.goal)?.label }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">技术水平</span>
                  <span class="summary-value">{{ proficiencyOptions.find(p => p.value === formData.proficiency)?.label }}</span>
                </div>
              </div>

              <div class="summary-section">
                <span class="summary-label">关注方向</span>
                <div class="summary-tags">
                  <span v-for="area in formData.focusAreas" :key="area" class="summary-tag">{{ area }}</span>
                </div>
              </div>

              <div class="summary-section">
                <span class="summary-label">编程语言</span>
                <div class="summary-tags">
                  <span v-for="lang in formData.languages" :key="lang" class="summary-tag">{{ lang }}</span>
                </div>
              </div>

              <div v-if="formData.frameworks.length > 0" class="summary-section">
                <span class="summary-label">框架/工具</span>
                <div class="summary-tags">
                  <span v-for="fw in formData.frameworks" :key="fw" class="summary-tag">{{ fw }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button v-if="currentStep > 0" class="btn btn-secondary" @click="goPrev">
            上一步
          </button>
          <div v-else />
          <button
            v-if="currentStep < 3"
            class="btn btn-primary"
            :disabled="!canNext"
            @click="goNext"
          >
            下一步
          </button>
          <button
            v-if="currentStep === 3 && isGenerated"
            class="btn btn-primary"
            @click="startLearning"
          >
            开始学习之旅
          </button>
        </div>
      </div>

      <div class="radar-section" :class="{ 'is-mobile': isMobile }">
        <div class="radar-card">
          <h4>六维能力画像</h4>
          <RadarChart :width="isMobile ? 240 : 260" :height="isMobile ? 240 : 260" />
          <div v-if="isGenerated" class="complete-badge">
            画像已完成
          </div>
          <div v-else class="progress-hint">
            完成采集后生成画像
          </div>

          <div v-if="isGenerated" class="radar-details">
            <div
              v-for="dim in store.radarDimensions"
              :key="dim.key"
              class="radar-dim-item"
            >
              <span class="dim-name">{{ dim.name }}</span>
              <div class="dim-bar">
                <div class="dim-bar-fill" :style="{ width: store.radarValues[dim.key] + '%' }" />
              </div>
              <span class="dim-value">{{ store.radarValues[dim.key] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-page {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg);
  min-height: 100%;
}

.onboarding-container {
  display: flex;
  gap: var(--spacing-xl);
  max-width: 1000px;
  width: 100%;
}

.onboarding-container.is-mobile {
  flex-direction: column-reverse;
}

.main-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.header {
  padding: 32px;
  border-bottom: 1px solid #f0f0f0;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
  font-family: 'Kaiti', '楷体', 'STKaiti', serif;
}

.page-desc {
  font-size: 14px;
  color: #666666;
  margin: 0 0 24px;
}

.progress-tracker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}

.progress-item {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  background: #e8e8e8;
  color: #999999;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.step-circle.active {
  background: #1e6fff;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(30, 111, 255, 0.3);
}

.step-circle.done {
  background: #1e6fff;
  color: #ffffff;
}

.check-icon {
  font-size: 14px;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e8e8e8;
  margin: 0 8px;
  min-width: 20px;
  transition: background 0.3s ease;
}

.step-line.active {
  background: #1e6fff;
}

.step-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  transition: opacity 0.3s ease;
}

.step-content.fade-out {
  opacity: 0;
}

.step-panel {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}

.step-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px;
}

.step-subtitle {
  font-size: 14px;
  color: #999999;
  margin: 0 0 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
}

.required {
  color: #ff4d4f;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #ffffff;
  color: #333333;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #cccccc;
}

.form-input:focus {
  outline: none;
  border-color: #1e6fff;
  box-shadow: 0 0 0 2px rgba(30, 111, 255, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #ffffff;
  color: #333333;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-textarea::placeholder {
  color: #cccccc;
}

.form-textarea:focus {
  outline: none;
  border-color: #1e6fff;
  box-shadow: 0 0 0 2px rgba(30, 111, 255, 0.1);
}

.grade-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.grade-btn {
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #ffffff;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.grade-btn:hover {
  border-color: #1e6fff;
  color: #1e6fff;
}

.grade-btn.selected {
  border-color: #1e6fff;
  background: #e8f0ff;
  color: #1e6fff;
  font-weight: 500;
}

.option-grid {
  display: grid;
  gap: 8px;
}

.option-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
.option-grid.cols-5 { grid-template-columns: repeat(5, 1fr); }

.option-btn {
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #ffffff;
  color: #666666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.option-btn:hover {
  border-color: #1e6fff;
  color: #1e6fff;
}

.option-btn.selected {
  border-color: #1e6fff;
  background: #e8f0ff;
  color: #1e6fff;
  font-weight: 500;
}

.card-grid {
  display: grid;
  gap: 8px;
}

.card-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }

.card-btn {
  padding: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.card-btn:hover {
  border-color: #1e6fff;
}

.card-btn.selected {
  border-color: #1e6fff;
  background: #e8f0ff;
}

.card-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}

.card-btn.selected .card-label {
  color: #1e6fff;
}

.card-desc {
  display: block;
  font-size: 12px;
  color: #999999;
  margin-top: 4px;
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 20px;
  background: #ffffff;
  color: #666666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  border-color: #1e6fff;
  color: #1e6fff;
}

.tag-btn.selected {
  border-color: #1e6fff;
  background: #1e6fff;
  color: #ffffff;
}

.generating-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e8e8e8;
  border-top-color: #1e6fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.gen-text {
  margin-top: 16px;
  color: #999999;
  font-size: 14px;
}

.profile-summary {
  animation: slideIn 0.4s ease;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #e8f0ff;
  border-radius: 8px;
  margin-bottom: 24px;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #1e6fff;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
}

.summary-info h3 {
  margin: 0;
  font-size: 16px;
  color: #1a1a1a;
}

.summary-info p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #666666;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: #999999;
}

.summary-value {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}

.summary-section {
  margin-bottom: 16px;
}

.summary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.summary-tag {
  padding: 4px 10px;
  background: #e8f0ff;
  color: #1e6fff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  border-top: 1px solid #f0f0f0;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #1e6fff;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #185acd;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666666;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  background: #e8e8e8;
}

.radar-section {
  width: 320px;
  flex-shrink: 0;
}

.radar-section.is-mobile {
  width: 100%;
}

.radar-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 24px;
  text-align: center;
  position: sticky;
  top: 24px;
}

.radar-card h4 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 600;
}

.complete-badge {
  margin-top: 12px;
  padding: 6px 16px;
  background: #f6ffed;
  color: #52c41a;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
}

.progress-hint {
  margin-top: 12px;
  font-size: 13px;
  color: #999999;
}

.radar-details {
  margin-top: 24px;
  text-align: left;
}

.radar-dim-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.dim-name {
  font-size: 12px;
  color: #999999;
  width: 56px;
  flex-shrink: 0;
}

.dim-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.dim-bar-fill {
  height: 100%;
  background: #1e6fff;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.dim-value {
  font-size: 12px;
  color: #333333;
  font-weight: 600;
  width: 28px;
  text-align: right;
}
</style>
