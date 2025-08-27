import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' })
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const NavBar = dynamic(() => import('../components/NavBar'), { ssr: false })

export const metadata: Metadata = {
  // Default OG image can be overridden via env
  // If not provided, falls back to /og/default.jpg
  // Add a real file under public/og/default.jpg for production
  // or set NEXT_PUBLIC_OG_DEFAULT to an absolute URL
  title: {
    default: 'Dog Paintings – Your dog in the style of history’s most famous painters',
    template: '%s | Dog Paintings',
  },
  description: 'Turn your dog photos into museum‑quality paintings inspired by the world’s most celebrated artists. Share to our public gallery and order framed prints.',
  keywords: ['dog portraits', 'dog paintings', 'pet portraits', 'custom dog art', 'dog pictures', 'art styles', 'museum quality', 'gallery', 'framed prints', 'Leonardo da Vinci', 'Van Gogh', 'Picasso', 'Hokusai', 'Klimt', 'Matisse', 'Monet', 'Munch', 'Warhol', 'Lichtenstein'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  openGraph: {
    type: 'website',
    title: 'Dog Paintings – Your dog in the style of history’s most famous painters',
    description: 'Turn your dog photos into museum‑quality paintings inspired by the world’s most celebrated artists.',
    url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
    images: [{ url: process.env.NEXT_PUBLIC_OG_DEFAULT || '/og/default.jpg', width: 1200, height: 630, alt: 'Dog Paintings – Your dog in the style of history’s most famous painters' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dog Paintings – Your dog in the style of history’s most famous painters',
    description: 'Turn your dog photos into museum‑quality paintings inspired by the world’s most celebrated artists.',
    images: [process.env.NEXT_PUBLIC_OG_DEFAULT || '/og/default.jpg'],
  },
}

export const viewport = 'width=device-width, initial-scale=1'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${playfair.variable} ${inter.variable}`} data-modern="1">
      <body className="h-full bg-slate-50 text-slate-900 antialiased">
        <div className="flex h-full flex-col">
          <NavBar />
          {/* Organization schema for stronger entity signals */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Dog Paintings',
                url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
              }),
            }}
          />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-600 sm:flex-row">
                <div>© {new Date().getFullYear()} Dog Paintings — AI-powered pet portraits</div>
                <div className="flex items-center gap-4">
                  <span>Inspired by the great masters</span>
                  <div className="h-1 w-1 rounded-full bg-slate-400" />
                  <span>Crafted with care</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
