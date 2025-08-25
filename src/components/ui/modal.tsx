"use client"
import { useEffect } from 'react'
import { cn } from './utils'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={cn('absolute left-1/2 top-1/2 w-[95vw] max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white shadow-xl overflow-hidden')}
           role="dialog" aria-modal="true">
        <div className="flex items-center justify-between border-b p-4 sm:p-6">
          <div className="text-lg font-semibold">{title}</div>
          <button className="text-gray-500 hover:text-gray-800 p-1" onClick={onClose}>✕</button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
      </div>
    </div>
  )
}

