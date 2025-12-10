import { NextResponse } from 'next/server'
import { getAgent } from '@/lib/agent'
import { AgentMessage } from '@/lib/agent/types'
import { AGENT_MODELS } from '@/lib/agent/config'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { messages, model, streaming = true } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      )
    }

    // Check if simulated responses are enabled
    const simulateResponses = process.env.SIMULATE_RESPONSES === 'true'
    
    if (simulateResponses) {
      const fakeResponse = "Hey Aditya! What's up?"
      
      if (streaming) {
        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          async start(controller) {
            // Simulate streaming by sending character by character
            for (let i = 0; i < fakeResponse.length; i++) {
              const data = `data: ${JSON.stringify({ text: fakeResponse[i] })}\n\n`
              controller.enqueue(encoder.encode(data))
              await new Promise(resolve => setTimeout(resolve, 30))
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          },
        })

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
          },
        })
      }

      return NextResponse.json({
        content: fakeResponse,
        model: model || 'simulated',
      })
    }

    const selectedModel = model && AGENT_MODELS.includes(model) ? model : 'gemini-2.5-flash'
    
    const agent = getAgent({ model: selectedModel })

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from user' },
        { status: 400 }
      )
    }

    const chatHistory: AgentMessage[] = messages.slice(0, -1)

    if (streaming) {
      console.log('Starting streaming response...')
      const encoder = new TextEncoder()
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
            console.log('Calling agent.executeStream...')
            const agentStream = agent.executeStream(lastMessage.content, chatHistory)
            
            let chunkCount = 0
            for await (const chunk of agentStream) {
              chunkCount++
              console.log(`Received chunk ${chunkCount}:`, chunk)
              if (chunk) {
                const data = `data: ${JSON.stringify({ text: chunk })}\n\n`
                controller.enqueue(encoder.encode(data))
                await new Promise(resolve => setTimeout(resolve, 0))
              }
            }
            
            console.log(`Streaming complete. Total chunks: ${chunkCount}`)
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (error) {
            console.error('Agent streaming error:', error)
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ 
                  error: error instanceof Error ? error.message : 'Unknown error' 
                })}\n\n`
              )
            )
            controller.close()
          }
        },
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      })
    }

    const response = await agent.execute(lastMessage.content, chatHistory)

    return NextResponse.json({
      content: response,
      model: selectedModel,
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