import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json()

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    console.log('Calling Gemini Vision to read label...')

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `You are a food label reader. Look at this image carefully.

TASK 1: If you can see a barcode, extract the barcode number printed below the barcode lines.

TASK 2: If you can see a nutrition label or ingredient list, extract all the information.

Return ONLY valid JSON with no markdown, no code fences:
{
  "barcode": "<barcode number if visible, or null>",
  "name": "<product name if visible, or null>",
  "brand": "<brand name if visible, or null>",
  "serving_size_g": <number or null>,
  "ingredients_text": "<full ingredients list or null>",
  "nutrition_per_100g": {
    "calories": <number or null>,
    "protein": <number or null>,
    "carbs": <number or null>,
    "fat": <number or null>,
    "sugar": <number or null>,
    "sodium": <number or null>,
    "fiber": <number or null>
  },
  "additives": ["<e-number or additive name>"],
  "allergens": ["<allergen>"],
  "fssai_number": "<14-digit FSSAI number or null>"
}`
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2000,
          }
        })
      }
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.text()
      console.log('Gemini Vision error:', err)
      return NextResponse.json(
        { success: false, error: 'Vision API failed' },
        { status: 500 }
      )
    }

    const geminiData = await geminiRes.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'No text extracted' },
        { status: 500 }
      )
    }

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    let extracted
    try {
      extracted = JSON.parse(cleaned)
    } catch {
      console.log('Vision parse failed:', cleaned.slice(0, 200))
      return NextResponse.json(
        { success: false, error: 'Could not read label' },
        { status: 500 }
      )
    }

    console.log('Vision extracted barcode:', extracted.barcode)
    console.log('Vision extracted name:', extracted.name)

    return NextResponse.json({ success: true, data: extracted })

  } catch (err: any) {
    console.error('Vision error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Vision failed' },
      { status: 500 }
    )
  }
}
