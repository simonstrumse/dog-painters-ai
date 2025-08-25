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
  // Optional metadata for sorting/filtering
  birthYear?: number
  deathYear?: number
  popularity?: number // higher = more popular
  categories?: string[] // e.g., ["Renaissance", "Painting"]
}

export type StyleSelection = {
  artistKey: string
  styleKey?: string // Predefined style period
  customReference?: string // OR specific painting reference
  dogName?: string // Dog's name for artistic title
  composition?: 'portrait' | 'landscape' | 'square' // Composition style
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
