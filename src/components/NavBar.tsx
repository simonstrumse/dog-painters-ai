"use client"
import AuthButtons from './AuthButtons'
import { Palette } from 'lucide-react'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <Palette className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg">Dog Paintings</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-1">
            <a href="/gallery" className="px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors">
              Gallery
            </a>
            <a href="/my" className="px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors">
              My Gallery
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <nav className="md:hidden flex items-center gap-1">
            <a href="/gallery" className="px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100">
              Gallery
            </a>
            <a href="/my" className="px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100">
              My
            </a>
          </nav>
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
