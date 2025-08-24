import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' })
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const NavBar = dynamic(() => import('../components/NavBar'), { ssr: false })

export const metadata: Metadata = {
  title: 'Dog Painters – AI Dog Portraits',
  description: 'Upload your dog photos and generate portraits in famous art styles using AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full antialiased bg-[#f8f5ef] text-gray-900">
        <NavBar />
        <div className="container py-6">{children}</div>
        <footer className="mt-16 border-t">
          <div className="container py-8 text-sm text-gray-600 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Dog Painters • AI Dog Portraits</div>
            <div>
              Inspired by the great masters. Crafted with care.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
