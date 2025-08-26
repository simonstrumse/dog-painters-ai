import { Brush, Images, Palette, Share2 } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Images,
      title: 'Upload',
      desc: 'Add one or more photos of your dog. Clear, well-lit images work best.'
    },
    {
      icon: Palette,
      title: 'Pick Styles',
      desc: 'Choose sub-styles from great artists like Van Gogh, Picasso, and Hokusai.'
    },
    {
      icon: Brush,
      title: 'Create',
      desc: 'We transform your photos into museum-inspired portraits.'
    },
    {
      icon: Share2,
      title: 'Publish & Print',
      desc: 'Share to the public gallery and request a framed print when ready.'
    }
  ]

  return (
    <section className="rounded-xl border bg-white p-6 md:p-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>How It Works</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="h-12 w-12 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
              <s.icon className="h-6 w-6" />
            </div>
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-gray-600">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
