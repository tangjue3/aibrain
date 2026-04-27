<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useAiTutorStore } from '@/stores/aiTutor'
import { useMediaQuery } from '@vueuse/core'
import { BREAKPOINTS } from '@/utils/constants'
import TypingBubble from './TypingBubble.vue'
import QuickReply from './QuickReply.vue'

const store = useAiTutorStore()
const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.MOBILE_MAX}px)`)
const inputText = ref('')
const chatListRef = ref<HTMLElement>()

const messages = computed(() => store.conversation)

const sendMessage = () => {
  const text = inputText.value.trim()
  if (!text) return
  store.sendMessage({ content: text })
  inputText.value = ''
  scrollToBottom()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatListRef.value) {
    chatListRef.value.scrollTop = chatListRef.value.scrollHeight
  }
}
</script>

<template>
  <!-- Floating toggle button -->
  <button
    v-if="!store.isOpen"
    class="float-btn"
    aria-label="打开AI助手"
    @click="store.togglePanel()"
  >
    🤖
  </button>

  <!-- Chat panel -->
  <transition name="slide-right">
    <div v-if="store.isOpen" class="chat-panel" :class="{ 'is-fullscreen': isMobile }">
      <div class="chat-header">
        <h3>AI 伴学助手</h3>
        <button class="close-btn" @click="store.togglePanel()">✕</button>
      </div>

      <!-- Messages -->
      <div ref="chatListRef" class="chat-messages">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message"
          :class="`msg-${msg.role}`"
        >
          <div class="msg-avatar">
            {{ msg.role === 'user' ? '👤' : '🤖' }}
          </div>
          <div class="msg-body">
            <TypingBubble
              v-if="msg.type === 'text'"
              :text="msg.content"
              :speed="25"
            />
            <div v-else-if="msg.type === 'quiz'" class="quiz-card">
              <p>{{ msg.content }}</p>
              <QuickReply
                v-if="msg.options"
                :options="msg.options"
                @select="(opt) => store.sendMessage({ content: opt })"
              />
            </div>
            <div v-else class="generic-bubble">
              {{ msg.content }}
            </div>
          </div>
        </div>

        <div v-if="store.isLoading" class="message msg-assistant">
          <div class="msg-avatar">🤖</div>
          <div class="msg-body">
            <div class="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="chat-input">
        <textarea
          v-model="inputText"
          class="input-textarea"
          placeholder="输入你的问题，Enter发送，Shift+Enter换行"
          rows="2"
          @keydown="onKeydown"
        />
        <button class="send-btn" :disabled="!inputText.trim()" @click="sendMessage">
          发送
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.float-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--color-primary);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  z-index: 999;
  transition: transform var(--transition-fast);
}

.float-btn:hover {
  transform: scale(1.1);
}

.chat-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: var(--chat-panel-width);
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
}

.chat-panel.is-fullscreen {
  width: 100vw;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.chat-header h3 {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-secondary);
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
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
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.msg-body {
  max-width: 80%;
}

.msg-user .msg-body {
  background: var(--color-primary);
  color: #fff;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius) 0 var(--border-radius) var(--border-radius);
}

.msg-assistant .msg-body {
  background: var(--bg-card);
  border-radius: 0 var(--border-radius) var(--border-radius) var(--border-radius);
  padding: var(--spacing-sm) var(--spacing-md);
}

.generic-bubble {
  word-break: break-word;
  line-height: 1.5;
}

.loading-dots {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: var(--text-secondary);
  border-radius: 50%;
  animation: dot-bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-input {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.input-textarea {
  flex: 1;
  resize: none;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  font-family: inherit;
  line-height: 1.5;
}

.input-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.send-btn {
  padding: 8px 16px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: opacity var(--transition-fast);
  align-self: flex-end;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
