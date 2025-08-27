"use client"
import AuthButtons from './AuthButtons'

export default function NavBar() {
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-gray-200/70">
      <div className="container py-3 sm:py-4 flex items-center justify-between">
        <a href="/" className="font-semibold text-lg tracking-tight">
          Dog Paintings
        </a>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm">
          <a href="/gallery" className="px-3 py-1.5 rounded-full hover:bg-gray-100/70">Gallery</a>
          <a href="/my" className="hidden sm:inline px-3 py-1.5 rounded-full hover:bg-gray-100/70">My Gallery</a>
          <a href="/my" className="sm:hidden px-3 py-1.5 rounded-full hover:bg-gray-100/70">My</a>
          <AuthButtons />
        </nav>
      </div>
    </div>
  )
}
