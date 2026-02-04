import { AgentConfig } from './types'

export const AGENT_MODELS = [
  'nvidia/nemotron-3-nano-30b-a3b:free',
] as const

export const defaultAgentConfig: AgentConfig = {
  model: AGENT_MODELS[0],
  temperature: 0.7,
  maxTokens: 2048,
  streaming: true,
}