import { NextResponse } from 'next/server'
import { AGENT_MODELS } from '@/lib/agent/config'

export async function GET() {
  try {
    // Return the list of configured OpenRouter models
    // We filter out any potential non-string values just in case, though the type definition is robust
    const models = [...AGENT_MODELS]

    return NextResponse.json({ models })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}