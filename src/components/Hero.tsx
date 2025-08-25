export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-white">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-amber-100" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-blue-50" />
      </div>
      <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-12">
        <div className="space-y-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Museum‑Quality Dog Portraits
          </h1>
          <p className="text-gray-700 text-base sm:text-lg max-w-prose">
            Transform your dog photos into stunning portraits in the styles of the great masters — from Van Gogh to Hokusai. Generate, share, and order framed prints.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#create" className="inline-flex items-center justify-center rounded-md bg-blue-700 px-5 py-2.5 text-white font-medium hover:bg-blue-800">Create Your Portrait</a>
            <a href="/gallery" className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 font-medium hover:bg-gray-50">Explore Gallery</a>
          </div>
          <div className="text-sm text-gray-600">No design skills needed. Keep your dog's unique markings — just add art.</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 self-center">
          <div className="aspect-square rounded-lg border bg-[url('https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center shadow-sm" />
          <div className="aspect-square rounded-lg border bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center shadow-sm" />
          <div className="aspect-square rounded-lg border bg-[url('https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center shadow-sm" />
          <div className="aspect-square rounded-lg border bg-[url('https://images.unsplash.com/photo-1542060748-10c28b62716d?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center shadow-sm" />
          <div className="aspect-square rounded-lg border bg-[url('https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center shadow-sm" />
          <div className="aspect-square rounded-lg border bg-[url('https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center shadow-sm" />
        </div>
      </div>
    </section>
  )
}

