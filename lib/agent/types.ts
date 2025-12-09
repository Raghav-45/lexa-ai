export interface AgentMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AgentConfig {
  model: string
  temperature?: number
  maxTokens?: number
  streaming?: boolean
}

export interface AgentTool {
  name: string
  description: string
  execute: (input: string) => Promise<string>
}

export interface AgentResponse {
  content: string
  toolCalls?: Array<{
    tool: string
    input: string
    output: string
  }>
}
