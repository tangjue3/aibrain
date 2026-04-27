export const BREAKPOINTS = {
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1279,
  DESKTOP_MIN: 1280
} as const

export const MESSAGE_TYPES = [
  'onboarding_question',
  'profile_radar_update',
  'path_graph',
  'node_recommend',
  'stream_lecture',
  'viz_mindmap',
  'exercise_deliver',
  'code_execute',
  'execution_result',
  'tutor_step',
  'assessment_report',
  'alert_trigger',
  'intervention_push',
  'generation_progress',
  'skill_execute'
] as const

export const SKILL_NODE_TYPES = [
  'LLM_Chat',
  'WebSearch',
  'CodeExec',
  'Branch',
  'Input',
  'Output'
] as const

export const RADAR_DIMENSIONS = [
  { name: '知识基础', key: 'knowledgeBase' },
  { name: '认知风格', key: 'cognitiveStyle' },
  { name: '错误偏好', key: 'errorPreference' },
  { name: '逻辑能力', key: 'logic' },
  { name: '学习进度', key: 'progress' },
  { name: '参与度', key: 'engagement' }
] as const
