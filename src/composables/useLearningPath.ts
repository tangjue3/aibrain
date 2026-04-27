import { useLearningPathStore } from '@/stores/learningPath'
import { useRouter } from 'vue-router'

export function useLearningPath() {
  const store = useLearningPathStore()
  const router = useRouter()

  const navigate = (nodeId: string) => {
    const node = store.getNode(nodeId)
    if (!node) {
      console.warn(`[LearningPath] Node ${nodeId} not found`)
      return false
    }

    const unmet = store.getUnmetPrerequisites(nodeId)
    if (unmet.length > 0) {
      const names = unmet.map((id) => store.getNode(id)?.label || id).join('、')
      alert(`请先完成前置节点：${names}`)
      return false
    }

    store.setCurrentNode(nodeId)
    router.push({ name: 'workspace', query: { nodeId } })
    return true
  }

  return { navigate }
}
