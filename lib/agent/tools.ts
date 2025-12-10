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
  ({ timezone, format }) => {
    const now = new Date()
    const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    
    if (format === 'date') {
      // Format: "9 December 2025"
      return now.toLocaleDateString('en-US', { 
        timeZone: tz,
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } else if (format === 'time') {
      // Format: "11:16 PM"
      return now.toLocaleTimeString('en-US', { 
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } else {
      // Default: both date and time
      const date = now.toLocaleDateString('en-US', { 
        timeZone: tz,
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      const time = now.toLocaleTimeString('en-US', { 
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      return `${time}, ${date}`
    }
  },
  {
    name: 'get_current_time',
    description: 'Gets the current date and/or time in a readable format. Use this when the user asks about the current time or date.',
    schema: z.object({
      timezone: z.string().optional().describe('Timezone (optional, defaults to user\'s local timezone)'),
      format: z.enum(['time', 'date', 'both']).optional().describe('What to return: "time" for time only (11:16 PM), "date" for date only (9 December 2025), or "both" for both'),
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
