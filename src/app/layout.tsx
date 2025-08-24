import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'
const NavBar = dynamic(() => import('../components/NavBar'), { ssr: false })

export const metadata: Metadata = {
  title: 'Dog Painters – AI Dog Portraits',
  description: 'Upload your dog photos and generate portraits in famous art styles using AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased bg-white text-gray-900">
        <NavBar />
        <div className="container py-6">{children}</div>
      </body>
    </html>
  )
}
