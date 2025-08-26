"use client"
import { useEffect, useState } from 'react'

export default function OnboardingOverlay() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      const seen = localStorage.getItem('onboarding_seen') === '1'
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches
      if (!seen && isDesktop) setShow(true)
    } catch {}
  }, [])

  if (!show) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div className="pointer-events-auto absolute bottom-4 right-4 max-w-sm rounded-xl border bg-white/95 shadow-lg backdrop-blur p-4">
        <div className="text-sm font-semibold mb-2">Getting started</div>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-800">
          <li>Sign in</li>
          <li>Upload dog photos</li>
          <li>Select artists and styles</li>
          <li>Generate your portraits</li>
        </ol>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            className="text-xs text-gray-600 hover:text-gray-800 underline"
            onClick={() => {
              try { localStorage.setItem('onboarding_seen', '1') } catch {}
              setShow(false)
            }}
          >Got it</button>
        </div>
      </div>
    </div>
  )
}

