import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const url: string = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    const responseAllModels = await fetch(url)
    const allModelsData = await responseAllModels.json()

    const textGenModels = allModelsData.models
      .map((model: any) => model.name.replace('models/', ''))
      // Filter for Gemini models that are NOT specialized tools
      .filter((name: string) => 
        name.startsWith('gemini') &&           // Must be Gemini
        !name.includes('embedding') &&         // Remove embedding models
        !name.includes('image') &&             // Remove image-generation/vision specific
        !name.includes('tts') &&               // Remove Text-to-Speech
        !name.includes('robotics') &&          // Remove robotics models
        !name.includes('computer-use')         // Remove computer-use agents
      )

    console.log('Usable Text Generation Models:', textGenModels)

    return NextResponse.json({ models: textGenModels })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}