import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Gallery – Dog Paintings',
  description: 'View your published dog portraits.',
  robots: { index: false, follow: false },
}

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return children
}
