const raw = process.env.NEXT_PUBLIC_MODERN_UI
const val = typeof raw === 'string' ? raw.toLowerCase() : ''
export const IS_MODERN = val === '1' || val === 'true' || val === 'on' || val === 'yes'
