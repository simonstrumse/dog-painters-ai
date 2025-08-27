"use client"
import AuthButtons from './AuthButtons'
import { IS_MODERN } from '@/lib/flags'

export default function NavBar() {
  return (
    <div className={IS_MODERN ? 'sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-gray-200/70' : 'border-b'}>
      <div className="container py-3 sm:py-4 flex items-center justify-between">
        <a href="/" className="font-semibold text-lg tracking-tight">
          Dog Paintings
        </a>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm">
          <a href="/gallery" className={IS_MODERN ? 'px-3 py-1.5 rounded-full hover:bg-gray-100/70' : 'text-gray-700 hover:text-gray-900 px-2 py-1'}>Gallery</a>
          <a href="/my" className={IS_MODERN ? 'hidden sm:inline px-3 py-1.5 rounded-full hover:bg-gray-100/70' : 'text-gray-700 hover:text-gray-900 px-2 py-1 hidden sm:inline'}>My Gallery</a>
          <a href="/my" className={IS_MODERN ? 'sm:hidden px-3 py-1.5 rounded-full hover:bg-gray-100/70' : 'text-gray-700 hover:text-gray-900 px-2 py-1 sm:hidden'}>My</a>
          <AuthButtons />
        </nav>
      </div>
    </div>
  )
}
