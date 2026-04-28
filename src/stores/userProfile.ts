import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RadarValues, Message, OnboardingState, BasicInfo, LearningPreference, TechBackground } from '@/api/types'

export const useUserProfileStore = defineStore('userProfile', () => {
  const userName = ref('')
  const avatar = ref('')
  const cognitiveLevel = ref(0)
  const onboardingCompleted = ref(false)
  const learningDays = ref(0)

  const basicInfo = ref<BasicInfo>({
    name: '',
    grade: '',
    major: '',
    school: ''
  })

  const learningPreference = ref<LearningPreference>({
    style: '',
    dailyHours: '',
    goal: '',
    focusAreas: []
  })

  const techBackground = ref<TechBackground>({
    languages: [],
    frameworks: [],
    proficiency: '',
    projectExperience: ''
  })

  const radarValues = ref<RadarValues>({
    knowledgeBase: 0,
    cognitiveStyle: 0,
    errorPreference: 0,
    logic: 0,
    progress: 0,
    engagement: 0
  })

  const onboarding = ref<OnboardingState>({
    step: 0,
    conversation: [],
    radar: { ...radarValues.value },
    isCompleted: false
  })

  const radarDimensions = computed(() => [
    { name: '知识基础', key: 'knowledgeBase' as const },
    { name: '认知风格', key: 'cognitiveStyle' as const },
    { name: '错误偏好', key: 'errorPreference' as const },
    { name: '逻辑能力', key: 'logic' as const },
    { name: '学习进度', key: 'progress' as const },
    { name: '参与度', key: 'engagement' as const }
  ])

  const updateRadar = (dimension: string, value: number) => {
    const key = dimension as keyof RadarValues
    if (key in radarValues.value) {
      radarValues.value[key] = value
    }
  }

  const addMessage = (msg: Message) => {
    onboarding.value.conversation.push(msg)
    onboarding.value.step = onboarding.value.conversation.length
  }

  const completeOnboarding = () => {
    onboarding.value.isCompleted = true
    onboardingCompleted.value = true
  }

  const isRadarComplete = computed(() =>
    Object.values(radarValues.value).every((v) => v > 0)
  )

  const profileSummary = computed(() => {
    const info = basicInfo.value
    const pref = learningPreference.value
    const tech = techBackground.value
    return {
      name: info.name || '同学',
      grade: info.grade,
      major: info.major,
      school: info.school,
      style: pref.style,
      dailyHours: pref.dailyHours,
      goal: pref.goal,
      focusAreas: pref.focusAreas,
      languages: tech.languages,
      proficiency: tech.proficiency
    }
  })

  return {
    userName,
    avatar,
    cognitiveLevel,
    onboardingCompleted,
    learningDays,
    basicInfo,
    learningPreference,
    techBackground,
    radarValues,
    onboarding,
    radarDimensions,
    isRadarComplete,
    profileSummary,
    updateRadar,
    addMessage,
    completeOnboarding
  }
})
