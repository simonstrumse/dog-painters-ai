import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Gallery – Dog Painters',
  description: 'View your published AI‑generated dog portraits.',
  robots: { index: false, follow: false },
}

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return children
}

