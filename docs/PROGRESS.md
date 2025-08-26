Session Notes — Dog Painters

Last updated: now

What’s done
- Centralized daily limits + validation; safer API errors
- New sizes incl. landscape; dynamic aspect ratios everywhere
- Randomized artist order; sorting (alpha/chrono/popularity) + consolidated filters
- Gallery item pages with share links, OG/Twitter tags, related content
- Next/Image optimization across hero, gallery, my gallery, results, preview
- Hero: mobile padding fix; two-row loading placeholders
- SEO: site-wide metadata, gallery index metadata, /my noindex

Open TODOs
- Add a branded image at `public/og/default.jpg` for homepage/gallery previews (temporary env override `NEXT_PUBLIC_OG_DEFAULT` supported)
- Optional: CI check to assert /og/default.jpg exists
- Optional: tune Hero <Image> sizes further by breakpoint

Shipped now
- Structured data (JSON‑LD) for gallery index (CollectionPage)

Next candidates
- “More like this” showing both Style and Artist sections simultaneously (style first), de‑duped (SHIPPED)
- Add canonical URLs to more pages if added later (e.g., /pricing)
