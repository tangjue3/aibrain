<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  source: string
  verified?: boolean
}>()

const showDetail = ref(false)
</script>

<template>
  <div class="ai-disclaimer">
    <span class="icon">💡</span>
    <span>本内容由 AI 生成，基于《{{ source }}》及科大讯飞星火大模型生成。</span>
    <a v-if="verified" class="verified-tag">已校验</a>
    <a class="show-source" @click="showDetail = true">查看出处</a>
  </div>

  <el-dialog v-model="showDetail" title="参考来源" width="500px">
    <p>本内容由 AI 模型根据以下来源生成：</p>
    <ul>
      <li>《{{ source }}》知识库</li>
      <li>课程教材与习题集</li>
      <li>公开学术资源</li>
    </ul>
    <p style="margin-top: 12px; color: var(--text-secondary); font-size: 13px;">
      AI 生成内容仅供参考，如有疑问请向老师求证。
    </p>
  </el-dialog>
</template>

<style scoped>
.ai-disclaimer {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-hover);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: var(--spacing-md);
}

.icon {
  font-size: 14px;
}

.verified-tag {
  color: var(--color-success);
  font-weight: 600;
}

.show-source {
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: underline;
}
</style>
