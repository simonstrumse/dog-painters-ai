"use client"
import AuthButtons from './AuthButtons'
import { Palette } from 'lucide-react'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between mobile-tight sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-8">
          <a href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-glow animate-pulse-glow">
              <Palette className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="text-base sm:text-lg bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Dog Paintings
            </span>
          </a>
          
          <nav className="hidden md:flex items-center gap-1">
            <a href="/gallery" className="glass px-4 py-2 text-sm font-medium text-slate-800 rounded-xl hover:bg-white/40 hover:text-slate-900 transition-all duration-300 transform hover:scale-105">
              Gallery
            </a>
            <a href="/my" className="glass px-4 py-2 text-sm font-medium text-slate-800 rounded-xl hover:bg-white/40 hover:text-slate-900 transition-all duration-300 transform hover:scale-105">
              My Gallery
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="md:hidden flex items-center gap-1">
            <a href="/gallery" className="glass px-3 py-1.5 text-xs font-medium text-slate-800 rounded-lg hover:bg-white/40 transition-all">
              Gallery
            </a>
            <a href="/my" className="glass px-3 py-1.5 text-xs font-medium text-slate-800 rounded-lg hover:bg-white/40 transition-all">
              My
            </a>
          </nav>
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
