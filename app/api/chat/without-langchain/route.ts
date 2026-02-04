import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { systemPrompt } from '@/config/prompt'
import { AGENT_MODELS, defaultAgentConfig } from '@/lib/agent/config'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://lexa.ai', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'Lexa AI', // Optional. Site title for rankings on openrouter.ai.
  },
})

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      )
    }

    // Use provided model or default from config, ensuring it's in the allowed list
    // Use provided model or default from config
    // We allow any model string to support adding new models via the frontend/config without code changes here
    let selectedModel = model
    if (!selectedModel) {
      selectedModel = defaultAgentConfig.model
    }

    // Convert messages to OpenAI format if needed (though the frontend usually sends { role, content })
    // Convert messages to OpenAI format
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.content,
      }))
    ]

    const stream = await openai.chat.completions.create({
      model: selectedModel,
      messages: formattedMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    })

    const encoder = new TextEncoder()
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              // Send as SSE format
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    })

  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}