import { CheckCircle2, ShieldCheck, Sparkles, Truck } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    { icon: CheckCircle2, title: 'Happiness Guarantee', desc: 'Love your portrait or we make it right.' },
    { icon: Sparkles, title: 'Museum-Quality Prints', desc: 'Archival inks, premium paper, elegant frames.' },
    { icon: ShieldCheck, title: 'Secure & Private', desc: 'Your images are processed securely.' },
    { icon: Truck, title: 'Worldwide Shipping', desc: 'Carefully packaged and shipped to your door.' },
  ]

  return (
    <section className="rounded-xl border bg-white p-6 md:p-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Why Choose Us</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((b, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5 h-9 w-9 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center">
              <b.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">{b.title}</div>
              <div className="text-sm text-gray-600">{b.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

