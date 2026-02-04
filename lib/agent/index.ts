import { createAgent } from 'langchain'
import { ChatOpenAI } from '@langchain/openai'
import { AgentMessage, AgentConfig } from './types'
import { agentTools } from './tools'
import { defaultAgentConfig } from './config'
import { SYSTEM_PROMPT } from './prompt'

export class LangChainAgent {
  private agent: any
  private model: ChatOpenAI
  private config: AgentConfig

  constructor(config: Partial<AgentConfig> = {}) {
    this.config = { ...defaultAgentConfig, ...config }
    
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing credentials. Please set OPENROUTER_API_KEY in your .env.local file.");
    }

    this.model = new ChatOpenAI({
      modelName: this.config.model,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      apiKey: apiKey,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "https://lexa.ai", // Optional: Update with actual URL
          "X-Title": "Lexa AI", // Optional: Update with actual App Name
        }
      },
      streaming: true,
    })
    
    this.agent = createAgent({
      model: this.model,
      tools: agentTools,
      systemPrompt: SYSTEM_PROMPT,
    })
  }

  async execute(input: string, chatHistory: AgentMessage[] = []): Promise<string> {
    try {
      const messages = [
        ...chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user' as const, content: input },
      ]

      const result = await this.agent.invoke({ messages })
      
      const lastMessage = result.messages[result.messages.length - 1]
      return lastMessage.text || lastMessage.content || ''
    } catch (error) {
      console.error('Agent execution error:', error)
      throw new Error(`Agent execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async *executeStream(input: string, chatHistory: AgentMessage[] = []): AsyncGenerator<string> {
    try {
      const messages = [
        ...chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user' as const, content: input },
      ]

      console.log('Agent: Starting stream with streamMode: messages')
      const stream = await this.agent.stream(
        { messages },
        { streamMode: 'messages' }
      )

      for await (const [token, metadata] of stream) {
        if (token.contentBlocks && token.contentBlocks.length > 0) {
          for (const block of token.contentBlocks) {
            if (block.text) {
              console.log('Agent: Yielding token:', block.text.slice(0, 20))
              yield block.text
            }
          }
        }
      }
      console.log('Agent: Stream completed')
    } catch (error) {
      console.error('Agent streaming error:', error)
      throw new Error(`Agent streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  getAvailableTools(): Array<{ name: string; description: string }> {
    return agentTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
    }))
  }
}

let agentInstance: LangChainAgent | null = null

export function getAgent(config?: Partial<AgentConfig>): LangChainAgent {
  if (!agentInstance || config) {
    agentInstance = new LangChainAgent(config)
  }
  return agentInstance
}
