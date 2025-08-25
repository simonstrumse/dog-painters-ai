export type SubStyle = {
  key: string
  name: string
  prompt: string
}

export type Artist = {
  key: string
  name: string
  styles: SubStyle[]
  examples?: string[] // Example famous paintings for reference suggestions
}

export type StyleSelection = {
  artistKey: string
  styleKey: string
  customReference?: string // Optional custom painting reference
}

export type GenerationRequest = {
  size?: '512x512' | '1024x1024'
  quality?: 'standard' | 'hd'
  selections: StyleSelection[]
}

export type GeneratedImage = {
  originalIndex: number
  artistKey: string
  styleKey: string
  dataUrl: string
}

