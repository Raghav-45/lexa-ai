import { tool } from 'langchain'
import * as z from 'zod'

export const calculatorTool = tool(
  ({ operation, a, b }) => {
    switch (operation) {
      case 'add':
        return `${a + b}`
      case 'subtract':
        return `${a - b}`
      case 'multiply':
        return `${a * b}`
      case 'divide':
        if (b === 0) return 'Error: Cannot divide by zero'
        return `${a / b}`
      default:
        return 'Invalid operation'
    }
  },
  {
    name: 'calculator',
    description: 'Performs basic arithmetic operations. Use this when you need to calculate numbers.',
    schema: z.object({
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']).describe('The arithmetic operation to perform'),
      a: z.number().describe('First number'),
      b: z.number().describe('Second number'),
    }),
  }
)

export const currentTimeTool = tool(
  ({ timezone }) => {
    const now = new Date()
    if (timezone) {
      return now.toLocaleString('en-US', { timeZone: timezone })
    }
    return now.toISOString()
  },
  {
    name: 'get_current_time',
    description: 'Gets the current date and time. Use this when the user asks about the current time or date.',
    schema: z.object({
      timezone: z.string().optional().describe('Timezone (optional, defaults to UTC)'),
    }),
  }
)

export const textAnalysisTool = tool(
  ({ text }) => {
    const words = text.trim().split(/\s+/).length
    const characters = text.length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    
    return JSON.stringify({
      words,
      characters,
      sentences,
      averageWordLength: (characters / words).toFixed(2),
    })
  },
  {
    name: 'analyze_text',
    description: 'Analyzes text and returns statistics like word count, character count, etc.',
    schema: z.object({
      text: z.string().describe('The text to analyze'),
    }),
  }
)

export const agentTools = [
  calculatorTool,
  currentTimeTool,
  textAnalysisTool,
]
