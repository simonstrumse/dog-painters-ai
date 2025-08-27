"use client"
import AuthButtons from './AuthButtons'
import { Sparkles } from 'lucide-react'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 font-semibold text-gray-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg">Dog Paintings</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="/gallery" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Gallery
            </a>
            <a href="/my" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              My Gallery
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <nav className="md:hidden flex items-center gap-4">
            <a href="/gallery" className="text-sm font-medium text-gray-600">Gallery</a>
            <a href="/my" className="text-sm font-medium text-gray-600">My</a>
          </nav>
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
