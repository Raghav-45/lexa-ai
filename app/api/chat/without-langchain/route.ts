import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { systemPrompt } from '@/config/prompt'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUPPORTED_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite-001',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-lite-preview-02-05',
  'gemini-2.0-flash-lite-preview',
  'gemini-2.0-pro-exp',
  'gemini-2.0-pro-exp-02-05',
  'gemini-exp-1206',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-pro-latest',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash-preview-09-2025',
  'gemini-2.5-flash-lite-preview-09-2025',
  'gemini-3-pro-preview'
] as const

// Prevents this route's response from being cached on Vercel
export const dynamic = "force-dynamic";
 
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      )
    }

    // Use provided model or default to gemini-2.5-flash
    const selectedModel = model && SUPPORTED_MODELS.includes(model)
      ? model
      : 'gemini-2.5-flash'

    // Convert messages to Gemini chat history format
    const history = messages.slice(0, -1).map((msg: Message) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const lastMessage = messages[messages.length - 1].content

    // Create chat session with history and selected model
    const chat = ai.chats.create({
      model: selectedModel,
      history: history,
      config: {
        systemInstruction: systemPrompt,
      },
    })

    const response = await chat.sendMessageStream({ message: lastMessage })

    const encoder = new TextEncoder()
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            console.log(chunk)
            const text = chunk.text
            if (text) {
              // Send as SSE format
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
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
        Connection: "keep-alive",
        "Content-Encoding": "none",
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/event-stream; charset=utf-8",
      },
    })
  } catch (error: any) {
    console.error('Chat API error:', error)

    // // Handle rate limit errors specifically
    // if (error?.status === 429 || error?.error?.code === 429) {
    //   const retryDelay = error?.error?.details?.find((d: any) => d['@type']?.includes('RetryInfo'))?.retryDelay
    //   const quotaInfo = error?.error?.details?.find((d: any) => d['@type']?.includes('QuotaFailure'))

    //   return NextResponse.json(
    //     {
    //       error: 'Rate limit exceeded',
    //       message: `Quota exceeded for ${selectedModel}. ${retryDelay ? `Please retry in ${retryDelay}.` : 'Please try a different model or wait before retrying.'}`,
    //       modelUsed: selectedModel,
    //       retryAfter: retryDelay,
    //       suggestSwitchModel: true
    //     },
    //     { status: 429 }
    //   )
    // }

    // return NextResponse.json(
    //   { error: 'Failed to process chat request', modelUsed: selectedModel },
    //   { status: 500 }
    // )
  }
}