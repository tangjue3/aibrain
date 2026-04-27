<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserProfileStore } from '@/stores/userProfile'
import { useMediaQuery } from '@vueuse/core'
import { BREAKPOINTS } from '@/utils/constants'
import TypingBubble from '@/components/chat/TypingBubble.vue'
import QuickReply from '@/components/chat/QuickReply.vue'
import RadarChart from '@/components/charts/RadarChart.vue'
import { gsap } from 'gsap'
import type { Message } from '@/api/types'

const store = useUserProfileStore()
const router = useRouter()
const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.MOBILE_MAX}px)`)
const inputText = ref('')
const chatContainerRef = ref<HTMLElement>()
const radarChartRef = ref<InstanceType<typeof RadarChart>>()
let inactivityTimer: number | null = null

// Initial system greeting
const initMessages = () => {
  if (store.onboarding.conversation.length === 0) {
    store.addMessage({
      id: '1',
      role: 'assistant',
      content: '你好！欢迎来到智学脑 🎉\n\n我是你的 AI 学伴，在开始学习之前，我想先了解你的情况，以便为你定制最佳学习路径。\n\n首先，你当前是计算机专业哪个阶段的学生呢？',
      type: 'text',
      timestamp: Date.now(),
      options: ['大一新生', '大二在读', '大三/大四', '研一及以上']
    })
  }
}

const messages = computed(() => store.onboarding.conversation)

const handleSend = () => {
  const text = inputText.value.trim()
  if (!text) return

  store.addMessage({
    id: Date.now().toString(),
    role: 'user',
    content: text,
    type: 'text',
    timestamp: Date.now()
  })
  inputText.value = ''
  resetInactivityTimer()
  simulateResponse(text)
}

const handleQuickReply = (option: string) => {
  store.addMessage({
    id: Date.now().toString(),
    role: 'user',
    content: option,
    type: 'text',
    timestamp: Date.now()
  })
  resetInactivityTimer()
  simulateResponse(option)
}

const simulateResponse = (userInput: string) => {
  const step = store.onboarding.step

  // Simulate radar update based on step
  const dimensions = ['knowledgeBase', 'cognitiveStyle', 'errorPreference', 'logic', 'progress', 'engagement']
  if (step < dimensions.length) {
    const dim = dimensions[step]
    const value = Math.floor(Math.random() * 40) + 30 // 30-70 range
    store.updateRadar(dim, value)
  }

  // Simulate AI response based on step
  const responses = [
    { text: '了解了！你的基础情况已记录。\n\n接下来，你平时更喜欢通过哪种方式学习新知识？', options: ['看视频教程', '读教材文档', '动手实操项目', '和别人讨论交流'] },
    { text: '明白你的学习风格了。\n\n在做编程题时，你通常遇到错误的第一反应是？', options: ['自己调试排查', '搜索报错信息', '直接问同学/老师', '看答案或参考代码'] },
    { text: '谢谢你的反馈。\n\n你对目前自己的逻辑思维能力怎么评价？', options: ['很强，喜欢算法题', '一般，能应对课程要求', '较弱，需要加强训练', '不确定，没认真评估过'] },
    { text: '了解了。\n\n目前你在专业学习上的进度感觉如何？', options: ['超过课程进度', '按部就班', '有些吃力，勉强跟上', '跟不上，需要帮助'] },
    { text: '最后一个问题，你对学习的投入和参与度怎样？', options: ['非常积极，每天学习', '比较规律，每周几次', '考前突击为主', '不太投入，缺乏动力'] },
    { text: `太棒了！你的学习画像已经初步完成 📊\n\n根据你的回答，系统已经为你生成了个性化的 6 维能力画像。你可以在右侧雷达图中查看。\n\n接下来，我们将为你规划一条专属的学习路径。准备好了吗？`, options: ['开始学习之旅 🚀', '先看看画像详情'] }
  ]

  const idx = Math.min(step, responses.length - 1)
  const resp = responses[idx]

  setTimeout(() => {
    store.addMessage({
      id: Date.now().toString(),
      role: 'assistant',
      content: resp.text,
      type: 'text',
      timestamp: Date.now(),
      options: resp.options
    })
    scrollToBottom()
  }, 800)
}

const startLearning = () => {
  store.completeOnboarding()
  router.push('/dashboard')
}

const resetInactivityTimer = () => {
  if (inactivityTimer) clearTimeout(inactivityTimer)
  inactivityTimer = window.setTimeout(() => {
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg?.role === 'assistant') {
      // Show nudge message
      const nudge: Message = {
        id: `nudge_${Date.now()}`,
        role: 'system',
        content: '💡 试着点击一个选项，或告诉我你的想法～',
        type: 'text',
        timestamp: Date.now()
      }
      store.onboarding.conversation.push(nudge)
      scrollToBottom()
    }
    resetInactivityTimer()
  }, 20000)
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
    }
  }, 100)
}

const canFinish = computed(() => store.onboarding.step >= 5)

onMounted(() => {
  initMessages()
  resetInactivityTimer()
})

onUnmounted(() => {
  if (inactivityTimer) clearTimeout(inactivityTimer)
})
</script>

<template>
  <div class="onboarding-page">
    <div class="onboarding-container" :class="{ 'is-mobile': isMobile }">
      <!-- Chat area -->
      <div class="chat-section">
        <div ref="chatContainerRef" class="chat-messages">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message"
            :class="`msg-${msg.role}`"
          >
            <div v-if="msg.role === 'system'" class="system-nudge">
              {{ msg.content }}
            </div>
            <template v-else>
              <div class="msg-avatar">
                {{ msg.role === 'user' ? '👤' : '🤖' }}
              </div>
              <div class="msg-body">
                <TypingBubble
                  v-if="msg.role === 'assistant'"
                  :text="msg.content"
                  :speed="25"
                />
                <div v-else class="user-bubble">
                  {{ msg.content }}
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Quick replies for last message options -->
        <div v-if="messages.length > 0" class="input-area">
          <QuickReply
            v-if="messages[messages.length - 1]?.options?.length"
            :options="messages[messages.length - 1].options || []"
            @select="handleQuickReply"
          />
          <div class="manual-input">
            <input
              v-model="inputText"
              class="text-input"
              placeholder="或者输入你的想法..."
              @keydown.enter="handleSend"
            />
            <button class="send-btn" :disabled="!inputText.trim()" @click="handleSend">
              发送
            </button>
          </div>
          <button
            v-if="canFinish"
            class="skip-btn"
            @click="startLearning"
          >
            直接开始学习 →
          </button>
        </div>
      </div>

      <!-- Radar Card (right side on desktop, bottom on mobile) -->
      <div class="radar-section" :class="{ 'is-mobile': isMobile }">
        <div class="radar-card">
          <h4>📊 学习画像</h4>
          <RadarChart ref="radarChartRef" :width="isMobile ? 240 : 280" :height="isMobile ? 240 : 280" />
          <div v-if="store.isRadarComplete" class="complete-badge">
            ✅ 画像完成
          </div>
          <div v-else class="progress-hint">
            继续对话完成画像 ({{ store.onboarding.step }}/5)
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
  gap: var(--spacing-lg);
  max-width: 1000px;
  width: 100%;
}

.onboarding-container.is-mobile {
  flex-direction: column;
}

.chat-section {
  flex: 1;
  max-width: 720px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-height: 400px;
  max-height: 60vh;
}

.message {
  display: flex;
  gap: var(--spacing-sm);
  max-width: 100%;
}

.msg-user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--bg-hover);
}

.msg-body {
  max-width: 75%;
}

.user-bubble {
  background: var(--color-primary);
  color: #fff;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius) 0 var(--border-radius) var(--border-radius);
  word-break: break-word;
}

.system-nudge {
  width: 100%;
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm);
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.input-area {
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.manual-input {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.text-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  font-family: inherit;
}

.text-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.send-btn {
  padding: 8px 20px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.skip-btn {
  display: block;
  width: 100%;
  margin-top: var(--spacing-sm);
  padding: 10px;
  background: none;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-sm);
  color: var(--color-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.radar-section {
  width: 300px;
  flex-shrink: 0;
}

.radar-section.is-mobile {
  width: 100%;
}

.radar-card {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  text-align: center;
  position: sticky;
  top: var(--spacing-lg);
}

.radar-card h4 {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.complete-badge {
  margin-top: var(--spacing-md);
  padding: 6px 16px;
  background: #ecf8e6;
  color: var(--color-success);
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.progress-hint {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
