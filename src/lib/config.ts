export const DAILY_LIMIT = Number(process.env.NEXT_PUBLIC_DAILY_LIMIT || 3)
export const MAX_FILE_SIZE_MB = Number(process.env.NEXT_PUBLIC_MAX_FILE_MB || 4)

export const IMAGE_SIZES = new Set(["512x768", "768x1152", "1024x1536"]) // 2:3 portrait
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

