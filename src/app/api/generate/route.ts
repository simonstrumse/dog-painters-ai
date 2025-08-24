import { NextRequest, NextResponse } from 'next/server'
import { buildPrompt } from '@/lib/styles'
import { uploadImageToFirebase, generateStoragePath } from '@/lib/firebaseStorage'
import { getAdminServices } from '@/lib/firebaseAdmin'
import type { StyleSelection } from '@/types'

export const runtime = 'nodejs'
export const preferredRegion = ['iad1', 'sfo1', 'fra1']

async function fileToBlob(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  return new Blob([arrayBuffer], { type: file.type || 'image/png' })
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const selectionsRaw = form.get('selections') as string | null
    const size = (form.get('size') as string) || '1024x1024'
    const quality = (form.get('quality') as string) || 'standard'
    const publish = (form.get('publish') as string) === 'true'
    const idToken = (form.get('idToken') as string) || null
    if (!selectionsRaw) {
      return NextResponse.json({ error: 'Missing selections' }, { status: 400 })
    }
    const selections: StyleSelection[] = JSON.parse(selectionsRaw)
    const files: File[] = []
    for (const [key, value] of form.entries()) {
      if (key === 'images' && value instanceof File) {
        files.push(value)
      }
    }
    if (files.length === 0) {
      return NextResponse.json({ error: 'No images uploaded' }, { status: 400 })
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 })
    }

    // We use the Images Edits endpoint with gpt-image-1 for image-to-image stylization.
    const outputs: {
      originalIndex: number
      artistKey: string
      styleKey: string
      b64: string
      mime: string
      publicUrl?: string | null
    }[] = []

    // For each image and each style, generate a portrait
    let index = 0

    const admin = getAdminServices()
    let uid: string | null = null
    if (publish) {
      if (!admin) {
        return NextResponse.json({ error: 'Firebase admin not configured' }, { status: 500 })
      }
      if (!idToken) {
        return NextResponse.json({ error: 'Missing idToken for publishing' }, { status: 401 })
      }
      try {
        const decoded = await admin.auth.verifyIdToken(idToken)
        uid = decoded.uid
      } catch (e) {
        return NextResponse.json({ error: 'Invalid idToken' }, { status: 401 })
      }
    }
    for (const file of files) {
      const imageBlob = await fileToBlob(file)
      for (const sel of selections) {
        const prompt = buildPrompt(sel)
        const body = new FormData()
        body.append('model', 'gpt-image-1')
        body.append('prompt', prompt)
        body.append('size', size)
        // quality is supported in some SDKs; Edits API may ignore it safely
        body.append('image', imageBlob, (file as any).name || 'dog.jpg')

        const resp = await fetch('https://api.openai.com/v1/images/edits', {
          method: 'POST',
          headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
          body,
        })
        if (!resp.ok) {
          const errText = await resp.text()
          console.error('OpenAI error', resp.status, errText)
          return NextResponse.json({ error: 'OpenAI error', details: errText }, { status: 502 })
        }
        const json = (await resp.json()) as any
        const dataItem = json.data?.[0]
        if (!dataItem?.b64_json) {
          return NextResponse.json({ error: 'Invalid response from OpenAI' }, { status: 502 })
        }
        // Upload to Firebase Storage for public sharing
        const buffer = Buffer.from(dataItem.b64_json, 'base64')
        const path = generateStoragePath('generated')
        const publicUrl = await uploadImageToFirebase(path, buffer, 'image/png')

        // If publishing, write to Firestore
        if (publish && admin && publicUrl) {
          try {
            await admin.db.collection('gallery').add({
              uid,
              artistKey: sel.artistKey,
              styleKey: sel.styleKey,
              imageUrl: publicUrl,
              size,
              createdAt: new Date(),
            })
          } catch (e) {
            console.error('Firestore write error', e)
          }
        }

        outputs.push({
          originalIndex: index,
          artistKey: sel.artistKey,
          styleKey: sel.styleKey,
          b64: dataItem.b64_json,
          mime: 'image/png',
          publicUrl,
        })
      }
      index += 1
    }

    return NextResponse.json({
      results: outputs.map((o) => ({
        originalIndex: o.originalIndex,
        artistKey: o.artistKey,
        styleKey: o.styleKey,
        dataUrl: `data:${o.mime};base64,${o.b64}`,
        publicUrl: o.publicUrl ?? undefined,
      })),
    })
  } catch (e: any) {
    console.error('Generation error', e)
    return NextResponse.json({ error: 'Unexpected error', details: e?.message }, { status: 500 })
  }
}
