import type { Metadata } from 'next'
import './globals.css'
import { IS_MODERN } from '@/lib/flags'
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
  const bodyClass = IS_MODERN
    ? 'min-h-full antialiased bg-gradient-to-b from-white via-neutral-50 to-neutral-100 text-gray-900'
    : 'min-h-full antialiased bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-200 text-gray-900'
  const bgStyle = IS_MODERN
    ? { backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(0,0,0,0.03) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '24px 24px, 28px 28px' }
    : { backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }
  return (
    <html lang="en" className={`h-full ${playfair.variable} ${inter.variable}`} data-modern={IS_MODERN ? '1' : '0'}>
      <body className={bodyClass} style={bgStyle as any}>
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
        <div className="container py-4 sm:py-6">{children}</div>
        <footer className={IS_MODERN ? 'mt-16 border-t border-gray-200/70' : 'mt-16 border-t'}>
          <div className="container py-8 text-sm text-gray-600 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Dog Paintings • Your dog in the style of history’s most famous painters</div>
            <div>
              Inspired by the great masters. Crafted with care.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
