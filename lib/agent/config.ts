import { AgentConfig } from './types'


export const defaultAgentConfig: AgentConfig = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  maxTokens: 2048,
  streaming: true,
}

export const AGENT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-exp-1206',
] as const
