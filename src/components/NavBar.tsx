"use client"
import AuthButtons from './AuthButtons'

export default function NavBar() {
  return (
    <div className="border-b">
      <div className="container py-4 flex items-center justify-between">
        <a href="/" className="font-semibold text-lg">Dog Paintings</a>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm">
          <a href="/gallery" className="text-gray-700 hover:text-gray-900 px-2 py-1">Gallery</a>
          <a href="/my" className="text-gray-700 hover:text-gray-900 px-2 py-1 hidden sm:inline">My Gallery</a>
          <a href="/my" className="text-gray-700 hover:text-gray-900 px-2 py-1 sm:hidden">My</a>
          <AuthButtons />
        </nav>
      </div>
    </div>
  )
}
