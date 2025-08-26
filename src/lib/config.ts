export const DAILY_LIMIT = Number(process.env.NEXT_PUBLIC_DAILY_LIMIT || 3)
export const MAX_FILE_SIZE_MB = Number(process.env.NEXT_PUBLIC_MAX_FILE_MB || 4)

// Supported output sizes (portrait, square, landscape)
export const IMAGE_SIZES = new Set([
  // Portrait 2:3
  "512x768",
  "768x1152",
  "1024x1536",
  // Square
  "512x512",
  "1024x1024",
  // Landscape 3:2
  "768x512",
  "1152x768",
  "1536x1024",
])
export const IMAGE_QUALITY = new Set(["standard", "high"]) // forwarded, may be ignored by API

export const OPENAI_IMAGES_EDITS_URL = "https://api.openai.com/v1/images/edits"

export function todayKeyUTC() {
  return new Date().toISOString().split("T")[0]
}

export function tomorrowMidnightUTCISO() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  tomorrow.setUTCHours(0, 0, 0, 0)
  return tomorrow.toISOString()
}
