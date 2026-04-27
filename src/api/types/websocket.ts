// WebSocket message type constants
export enum WsMessageType {
  ONBOARDING_QUESTION = 'onboarding_question',
  PROFILE_RADAR_UPDATE = 'profile_radar_update',
  PATH_GRAPH = 'path_graph',
  NODE_RECOMMEND = 'node_recommend',
  STREAM_LECTURE = 'stream_lecture',
  VIZ_MINDMAP = 'viz_mindmap',
  EXERCISE_DELIVER = 'exercise_deliver',
  CODE_EXECUTE = 'code_execute',
  EXECUTION_RESULT = 'execution_result',
  TUTOR_STEP = 'tutor_step',
  TUTOR_ANSWER = 'tutor_answer',
  ASSESSMENT_REPORT = 'assessment_report',
  ALERT_TRIGGER = 'alert_trigger',
  INTERVENTION_PUSH = 'intervention_push',
  TEACHER_REPLY = 'teacher_reply',
  SYSTEM_ALERT = 'system_alert',
  GENERATION_PROGRESS = 'generation_progress',
  SKILL_EXECUTE = 'skill_execute'
}

export interface WsMessage<T = any> {
  type: string
  payload: T
  timestamp: number
  seq?: number
}
