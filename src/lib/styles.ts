import type { Artist, SubStyle, StyleSelection } from '@/types'

// Dog Art Style Library (expandable)
export const DOG_STYLE_LIBRARY: Artist[] = [
  {
    key: 'picasso',
    name: 'Pablo Picasso',
    styles: [
      {
        key: 'blue_period',
        name: 'Blue Period',
        prompt:
          'in the melancholic Blue Period of Pablo Picasso: cool blue tones, elongated forms, heavy emotion, painterly brushwork, focus on canine expression',
      },
      {
        key: 'rose_period',
        name: 'Rose Period',
        prompt:
          'in Picasso\'s Rose Period: warm pinks and oranges, softness, circus-inspired tenderness, simplified forms, emotional warmth',
      },
      {
        key: 'analytical_cubism',
        name: 'Analytical Cubism',
        prompt:
          'as Analytical Cubism by Picasso: fragmented, geometric, overlapping muted planes, multiple viewpoints, faceted structure',
      },
      {
        key: 'synthetic_cubism',
        name: 'Synthetic Cubism',
        prompt:
          'as Synthetic Cubism by Picasso: bright colors, collage-like simplifications, bold shapes, decorative planes',
      },
      {
        key: 'line_sketch',
        name: 'Line Sketch',
        prompt:
          'as a minimalist single-line drawing in the playful spirit of Picasso\'s La Chèvre: continuous black line, white background, whimsical contours',
      },
    ],
  },
  {
    key: 'munch',
    name: 'Edvard Munch',
    styles: [
      { key: 'scream', name: 'The Scream / Anxiety', prompt: 'in the style of Munch\'s The Scream: swirling skies, distorted figures, existential dread, intense expressionism' },
      { key: 'symbolist', name: 'Symbolist Phase', prompt: 'as Munch\'s symbolist phase: ghostly, spiritual, emotional atmosphere, muted palette, ethereal' },
      { key: 'frieze', name: 'Frieze of Life', prompt: 'in Munch\'s Frieze of Life: themes of love, death, loneliness, muted expressionism, narrative tension' },
      { key: 'late_impressionism', name: 'Late Impressionism', prompt: 'as late Munch: looser brushwork, more naturalistic, French-influenced impressionism' },
      { key: 'woodcuts', name: 'Woodcuts & Lithographs', prompt: 'as Munch woodcut/lithograph: bold graphic simplification in black and white, strong contrasts' },
    ],
  },
  {
    key: 'dali',
    name: 'Salvador Dalí',
    styles: [
      { key: 'classic_surrealism', name: 'Classic Surrealism', prompt: 'as Dalí classic surrealism: barren landscapes, melting objects, long shadows, dream logic' },
      { key: 'paranoiac', name: 'Paranoiac-Critical Method', prompt: 'as Dalí paranoiac-critical: double images, hidden shapes in landscapes, uncanny illusions' },
      { key: 'religious_mythic', name: 'Religious/Mythic Phase', prompt: 'as Dalí religious/mythic: dramatic skies, spiritual dream elements, theatrical lighting' },
      { key: 'animal_hybrids', name: 'Animal Hybrids', prompt: 'as Dalí: surreal animal hybrids, long-limbed creatures, symbolic totems, elongated anatomy' },
      { key: 'hyperrealist', name: 'Hyperrealist Surrealism', prompt: 'as Dalí hyperrealist surrealism: crystalline detail with impossible dream logic, precise rendering' },
    ],
  },
  {
    key: 'vangogh',
    name: 'Vincent van Gogh',
    styles: [
      { key: 'starry_night', name: 'Starry Night', prompt: 'as Van Gogh Starry Night: swirling skies, luminous cosmic light, impasto brushstrokes' },
      { key: 'sunflowers', name: 'Sunflowers/Still Lifes', prompt: 'as Van Gogh sunflowers/still life: bright thick brushstrokes, glowing bursts of color' },
      { key: 'arles_portraits', name: 'Arles Portraits', prompt: 'as Van Gogh Arles portraits: warm yellows and blues, intimate portrait, bold impasto' },
      { key: 'early_dutch', name: 'Early Dutch Phase', prompt: 'as early Dutch Van Gogh: earthy browns, dark realism like The Potato Eaters' },
      { key: 'japanese', name: 'Japanese-Inspired', prompt: 'as Van Gogh\'s Japanese-inspired: flatter colors, bold outlines, ukiyo-e influence' },
    ],
  },
  {
    key: 'matisse',
    name: 'Henri Matisse',
    styles: [
      { key: 'fauvism', name: 'Fauvism', prompt: 'as Matisse fauvism: flat, vibrant unnatural colors, bold outlines, joyful design' },
      { key: 'interiors', name: 'Decorative Interiors', prompt: 'as Matisse The Red Room: patterned richly colored interiors, decorative rhythm' },
      { key: 'simplified_portraits', name: 'Simplified Portraits', prompt: 'as Matisse simplified portraits: reduced shapes, strong contrasts, elegant economy' },
      { key: 'cutouts', name: 'Cut-outs', prompt: 'as Matisse late paper cut-outs: collage abstraction, bold silhouettes, playful arrangement' },
    ],
  },
  {
    key: 'klimt',
    name: 'Gustav Klimt',
    styles: [
      { key: 'golden', name: 'Golden Phase', prompt: 'as Klimt golden phase: mosaic-like gold leaf patterns, ornamental aura, decorative abstraction' },
      { key: 'portraits', name: 'Portraits', prompt: 'as Klimt portraits: elongated forms, stylized patterned backgrounds, sensual elegance' },
      { key: 'landscapes', name: 'Landscapes', prompt: 'as Klimt landscapes: mosaic-like stylized nature, decorative tessellations' },
      { key: 'sketches', name: 'Sketches', prompt: 'as Klimt sketches: minimalist sensual line drawings, delicate graphite' },
    ],
  },
  {
    key: 'monet',
    name: 'Claude Monet',
    styles: [
      { key: 'water_lilies', name: 'Water Lilies', prompt: 'as Monet water lilies: hazy pastel reflections, atmospheric softness' },
      { key: 'haystacks_cathedral', name: 'Haystacks / Rouen Cathedral', prompt: 'as Monet light studies: changing daytimes, shimmering color, soft edges' },
      { key: 'urban', name: 'Urban Impressionism', prompt: 'as Monet urban impressionism: street or train scenes, loose brushwork, airy light' },
      { key: 'early_realism', name: 'Early Realism', prompt: 'as early Monet realism: more defined, structured, naturalistic' },
    ],
  },
  {
    key: 'bacon',
    name: 'Francis Bacon',
    styles: [
      { key: 'screaming_popes', name: 'Screaming Popes', prompt: 'as Francis Bacon screaming popes: grotesque distortions, existential terror, smeared paint' },
      { key: 'triptychs', name: 'Triptychs', prompt: 'as Bacon triptychs: fragmented subject across panels, stark space, psychological intensity' },
      { key: 'distorted_portraits', name: 'Distorted Portraits', prompt: 'as Bacon distorted portrait: blurred twisted forms, raw flesh-like textures' },
      { key: 'animalistic_abstractions', name: 'Animalistic Abstractions', prompt: 'as Bacon animalistic abstractions: flesh-like smears resembling creatures, visceral' },
    ],
  },
  {
    key: 'mucha',
    name: 'Alphonse Mucha',
    styles: [
      { key: 'posters', name: 'Posters', prompt: 'as Mucha posters: flowing lines, elegant pastel gradients, decorative framing' },
      { key: 'seasonal', name: 'Seasonal Panels', prompt: 'as Mucha seasonal panels: nature motifs tied to seasons, ornate panels' },
      { key: 'decorative_panels', name: 'Decorative Panels', prompt: 'as Mucha decorative panels: floral ornamental borders, Art Nouveau elegance' },
      { key: 'lithographs', name: 'Lithographs', prompt: 'as Mucha lithograph: strong graphic black-and-white linework, poster-like' },
    ],
  },
  {
    key: 'hokusai',
    name: 'Hokusai',
    styles: [
      { key: 'great_wave', name: 'The Great Wave', prompt: 'as Hokusai The Great Wave: bold stylized wave-like fur patterns, dynamic foam shapes' },
      { key: 'mount_fuji', name: 'Mount Fuji Series', prompt: 'as Hokusai Mount Fuji series: symbolic backdrops, crisp woodblock flat colors' },
      { key: 'nature_animals', name: 'Nature & Animals', prompt: 'as Hokusai nature/animals: crisp linework, stylized patterns, ukiyo-e clarity' },
      { key: 'manga_sketches', name: 'Manga Sketches', prompt: 'as Hokusai manga sketches: playful loose ink drawings, spontaneous' },
    ],
  },
  {
    key: 'warhol',
    name: 'Andy Warhol',
    styles: [
      { key: 'marilyn', name: 'Marilyn-style Silkscreens', prompt: 'as Warhol Marilyn silkscreens: repeated portraits in neon colors, pop-art halftone' },
      { key: 'silkscreen_imperfections', name: 'Silkscreen Imperfections', prompt: 'as Warhol silkscreen: halftone, imperfect overlays, off-register colors' },
      { key: 'commercial_flat', name: 'Commercial Flat', prompt: 'as Warhol commercial flat: advertising bold look, flat graphic fills' },
      { key: 'sketches', name: 'Sketches', prompt: 'as Warhol sketches: quick minimalist line work, spontaneous' },
    ],
  },
  {
    key: 'basquiat',
    name: 'Jean-Michel Basquiat',
    styles: [
      { key: 'neo_expressionist', name: 'Neo-expressionist graffiti', prompt: 'as Basquiat: raw lines, crowns, chaotic energy, graffiti scrawl' },
      { key: 'text_symbols', name: 'Text & Symbols', prompt: 'as Basquiat: overlays with words, anatomy motifs, symbolic icons' },
      { key: 'primitive_figures', name: 'Primitive Figures', prompt: 'as Basquiat: mask-like raw figures, primitive power' },
      { key: 'color_block', name: 'Color-block Compositions', prompt: 'as Basquiat: fragmented energy-driven forms, color blocks and scribbles' },
    ],
  },
  {
    key: 'caravaggio',
    name: 'Caravaggio',
    styles: [
      { key: 'chiaroscuro', name: 'Chiaroscuro', prompt: 'as Caravaggio chiaroscuro: extreme light/dark realism, dramatic spotlit portrait' },
      { key: 'religious', name: 'Religious Dramatic Scenes', prompt: 'as Caravaggio: religious dramatic scene, spotlight composition, deep shadows' },
      { key: 'still_life', name: 'Still-life Naturalism', prompt: 'as Caravaggio still-life: earthy realism, tactile textures, subdued palette' },
    ],
  },
  {
    key: 'rembrandt',
    name: 'Rembrandt',
    styles: [
      { key: 'portrait_chiaroscuro', name: 'Portrait Chiaroscuro', prompt: 'as Rembrandt: soulful eyes in soft golden light, rich chiaroscuro' },
      { key: 'self_portrait', name: 'Self-Portrait style', prompt: 'as Rembrandt self-portrait style: expressive brushwork, textured emotion, warm browns' },
      { key: 'etchings', name: 'Sketch Etchings', prompt: 'as Rembrandt etchings: loose black ink forms, crosshatching' },
    ],
  },
  {
    key: 'bosch',
    name: 'Hieronymus Bosch',
    styles: [
      { key: 'hellscapes', name: 'Fantastical Hellscapes', prompt: 'as Bosch: grotesque creatures and fantastical hellscape, surreal allegory' },
      { key: 'hybrid_animals', name: 'Hybrid Animals', prompt: 'as Bosch: mythic dog-bird-fish hybrid animals, medieval surrealism' },
      { key: 'surreal_allegories', name: 'Surreal Allegories', prompt: 'as Bosch: symbolic dreamlike scene, teeming details' },
    ],
  },
  {
    key: 'mondrian',
    name: 'Piet Mondrian',
    styles: [
      { key: 'geometric', name: 'Geometric Abstraction', prompt: 'as Mondrian: grid abstraction, primary colors, black lines, white ground' },
      { key: 'early_naturalism', name: 'Early Naturalism', prompt: 'as early Mondrian: softer representational style before abstraction' },
    ],
  },
  {
    key: 'pollock',
    name: 'Jackson Pollock',
    styles: [
      { key: 'drip', name: 'Drip Technique', prompt: 'as Pollock: chaotic layers of drip paint, energetic all-over composition' },
      { key: 'action', name: 'Action Painting', prompt: 'as Pollock action painting: gestural immersive composition, dynamic splatters' },
    ],
  },
  {
    key: 'miro',
    name: 'Joan Miró',
    styles: [
      { key: 'biomorphic', name: 'Biomorphic Abstraction', prompt: 'as Miró: playful biomorphic shapes, surreal symbols, vivid primaries' },
      { key: 'childlike', name: 'Childlike Primitivism', prompt: 'as Miró: whimsical simplified figures, naive energy' },
    ],
  },
  {
    key: 'lichtenstein',
    name: 'Roy Lichtenstein',
    styles: [
      { key: 'comic_pop', name: 'Comic Pop', prompt: 'as Lichtenstein comic pop: Ben-Day dots, speech caption, dramatic expressions' },
      { key: 'whaam', name: 'Whaam!-style', prompt: 'as Lichtenstein Whaam!: bold dynamic comic panels, graphic onomatopoeia' },
    ],
  },
  {
    key: 'haring',
    name: 'Keith Haring',
    styles: [
      { key: 'outlined_figures', name: 'Outlined Figures', prompt: 'as Keith Haring: bright cartoon-like bold outlines, simplified dog figure' },
      { key: 'motion_lines', name: 'Motion Lines', prompt: 'as Haring: dogs with radiating energy, motion lines, pop boldness' },
    ],
  },
]

export function findStyle(selection: StyleSelection): { artistName: string; styleName: string; prompt: string } | null {
  const artist = DOG_STYLE_LIBRARY.find((a) => a.key === selection.artistKey)
  if (!artist) return null
  const style = artist.styles.find((s) => s.key === selection.styleKey)
  if (!style) return null
  return { artistName: artist.name, styleName: style.name, prompt: style.prompt }
}

export function buildPrompt(selection: StyleSelection) {
  const found = findStyle(selection)
  if (!found) return ''
  // Identity-preserving directive and content policy-safe phrasing
  return [
    'Create an artistic dog portrait based on the provided photo.',
    'Preserve the exact dog breed and unique facial markings.',
    'Vertical composition, full dog entirely visible, head-to-toe inside frame, generous top/bottom margins, centered on clean background, no cropping.',
    'Ensure no part of the dog is cropped or cut off.',
    'Keep 10-15% padding around the dog on all sides.',
    'Maintain clean background to avoid edge clutter.',
    'Avoid adding text or watermarks.',
    found.prompt,
  ].join(' ')
}

