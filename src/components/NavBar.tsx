"use client"
import AuthButtons from './AuthButtons'
import { Sparkles } from 'lucide-react'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">Dog Paintings</span>
              <span className="text-xs text-green-600 font-medium">Powered by Musti</span>
            </div>
          </a>
          
          <nav className="hidden lg:flex items-center gap-8">
            <a href="/gallery" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
              Gallery
            </a>
            <a href="/my" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
              My Portraits
            </a>
            <a href="/about" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
              How It Works
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <nav className="lg:hidden flex items-center gap-4">
            <a href="/gallery" className="text-sm font-medium text-gray-600">Gallery</a>
            <a href="/my" className="text-sm font-medium text-gray-600">My</a>
          </nav>
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
