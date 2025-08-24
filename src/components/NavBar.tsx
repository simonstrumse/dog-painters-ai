"use client"
import AuthButtons from './AuthButtons'

export default function NavBar() {
  return (
    <div className="border-b">
      <div className="container py-4 flex items-center justify-between">
        <a href="/" className="font-semibold">Dog Painters</a>
        <nav className="flex items-center gap-4 text-sm">
          <a href="/gallery" className="text-gray-700 hover:text-gray-900">Gallery</a>
          <a href="/my" className="text-gray-700 hover:text-gray-900">My Gallery</a>
          <AuthButtons />
        </nav>
      </div>
    </div>
  )
}
