export interface RadarValues {
  knowledgeBase: number
  cognitiveStyle: number
  errorPreference: number
  logic: number
  progress: number
  engagement: number
}

export interface OnboardingState {
  step: number
  conversation: Message[]
  radar: RadarValues
  isCompleted: boolean
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  type: 'text' | 'code_diff' | 'mindmap_thumb' | 'quiz'
  timestamp: number
  options?: string[]
  payload?: any
}

export interface BasicInfo {
  name: string
  grade: string
  major: string
  school: string
}

export interface LearningPreference {
  style: string
  dailyHours: string
  goal: string
  focusAreas: string[]
}

export interface TechBackground {
  languages: string[]
  frameworks: string[]
  proficiency: string
  projectExperience: string
}

export interface UserProfile {
  id: string
  name: string
  avatar: string
  basicInfo: BasicInfo
  learningPreference: LearningPreference
  techBackground: TechBackground
  radarValues: RadarValues
  cognitiveLevel: number
  onboardingCompleted: boolean
  learningDays: number
  overallProgress: number
}

export interface GraphNode {
  id: string
  label: string
  type: 'theory-node' | 'challenge-node' | 'repair-node'
  difficulty: number
  prerequisites: string[]
  completed: boolean
  x?: number
  y?: number
  width?: number
  height?: number
  attrs?: any
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  recommended?: boolean
}

export interface Exercise {
  id: string
  description: string
  template: string
  testCases: { input: string; expected: string }[]
}

export interface AssessmentReport {
  generatedAt: string
  unitId: string
  masteryHeatmap: { concept: string; level: number }[]
  errorFrequency: { type: string; count: number }[]
  efficiencyScore: number
  suggestions: string[]
}

export interface TutorStep {
  stepId: number
  type: 'text' | 'diagram' | 'quiz'
  content: string
  waitForAction?: boolean
}

export interface CoTStep {
  step: number
  thought: string
  action?: string
  observation?: string
}

export interface SkillNode {
  id: string
  type: 'LLM_Chat' | 'WebSearch' | 'CodeExec' | 'Branch' | 'Input' | 'Output'
  x: number
  y: number
  config?: Record<string, any>
}

export interface SkillEdge {
  id: string
  source: string
  target: string
}

export interface InterventionTask {
  taskId: string
  title: string
  deadline: string
  nodeId: string
}

export interface SystemAlert {
  level: 'warning' | 'critical'
  message: string
  weakPoints: string[]
}
