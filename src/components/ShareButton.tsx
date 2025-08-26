"use client"
import { useState } from 'react'

export function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }
  return (
    <button onClick={onCopy} className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50">
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  )
}

