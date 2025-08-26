# LLM Optimization (LLMO) Guide

This guide distills practical steps to improve brand visibility in AI‑powered search (ChatGPT, Claude, Gemini, Perplexity). It complements traditional SEO with entity‑driven, structured, and quote‑friendly content.

## Goals

- Be cited as a source in AI responses
- Improve mention accuracy and context relevance
- Drive qualified traffic via AI assistants and answer engines

## Principles

- Semantic clarity: express definitions, benefits, and facts plainly
- Structured information: add Schema.org JSON‑LD (Organization, Service, FAQ)
- Context optimization: reinforce topic‑brand associations consistently
- Conversational patterns: Q&A sections, succinct summaries, lists

## Implementation Checklist

1) Entity foundation
- Organization schema with `name` and `url`
- Service/Product schema for core offering
- Consistent brand name and tagline across navigation, footer, and metadata

2) Structured data
- WebSite + SearchAction (site search)
- FAQPage for top 3–7 questions (visible content + JSON‑LD)
- Page‑level JSON‑LD for key resources (CollectionPage/ImageObject, etc.)

3) Quote‑worthy content
- Publish concise bullets with verifiable facts (dimensions, turnaround, pricing ranges)
- Use stable phrasing that can be extracted as citations
- Avoid jargon; keep numbers and claims easy to lift

4) Topic‑brand associations (Digital PR)
- Identify 3–5 “ownable” topics; repeat phrasing verbatim
- Earn mentions in relevant publications and directories
- Encourage authentic discussions on forums (e.g., Reddit) without promotion

5) Content format for LLMs
- Start with direct definitions (“What is X?”)
- Use H2/H3 structure that mirrors Q&A
- Keep answers concise; add detailed follow‑ups below
- Summarize key points at the end of sections

6) Technical hygiene
- Fast page loads; responsive images with `sizes`
- Clear canonical URLs; descriptive titles and meta descriptions
- No broken links or blocked assets; cache headers for images

7) Measure and iterate
- Track mentions in AI tools (Brand monitoring)
- Monitor traffic from AI referrals when available
- Update facts and examples quarterly

## Example JSON‑LD Snippets

Organization:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dog Paintings",
  "url": "https://example.com"
}
```

Service:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Custom Dog Paintings",
  "serviceType": "Pet portrait in classic art styles",
  "provider": { "@type": "Organization", "name": "Dog Paintings" },
  "areaServed": "Worldwide"
}
```

FAQPage:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is Dog Paintings?", "acceptedAnswer": { "@type": "Answer", "text": "…" } }
  ]
}
```

## Content Ideas for LLMs

- “What is Dog Paintings?” definition box
- “Why Dog Paintings” bullets (benefits/features)
- “How it works” in 3–4 steps
- Short case snippets (before/after) with concrete details
- FAQ section with precise, reusable answers

## Avoid

- Over‑promising or unverifiable claims
- Excessive jargon or vague benefits
- Hidden text solely for bots; keep content user‑visible

## Maintenance Cadence

- Monthly: check for broken links, asset issues
- Quarterly: refresh FAQs, stats, and examples
- Each release: validate JSON‑LD with a structured data tester

