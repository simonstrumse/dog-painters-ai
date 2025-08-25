// Utility functions for displaying artist and style information in a user-friendly way

export function formatArtistName(artistKey: string): string {
  // Convert camelCase or snake_case to proper names
  const nameMap: Record<string, string> = {
    'picasso': 'Pablo Picasso',
    'vangogh': 'Vincent van Gogh',
    'monet': 'Claude Monet',
    'matisse': 'Henri Matisse',
    'klimt': 'Gustav Klimt',
    'munch': 'Edvard Munch',
    'dali': 'Salvador Dalí',
    'bacon': 'Francis Bacon',
    'mucha': 'Alphonse Mucha',
    'hokusai': 'Hokusai',
    'warhol': 'Andy Warhol',
    'basquiat': 'Jean-Michel Basquiat',
    'caravaggio': 'Caravaggio',
    'rembrandt': 'Rembrandt',
    'bosch': 'Hieronymus Bosch',
    'mondrian': 'Piet Mondrian',
    'pollock': 'Jackson Pollock',
    'miro': 'Joan Miró',
    'lichtenstein': 'Roy Lichtenstein',
    'haring': 'Keith Haring'
  }
  
  return nameMap[artistKey] || artistKey.replace(/([A-Z])/g, ' $1').trim()
}

export function formatStyleName(styleKey: string): string {
  if (styleKey === 'custom_reference') {
    return 'Custom Reference'
  }
  
  // Convert snake_case to proper names
  const styleMap: Record<string, string> = {
    'blue_period': 'Blue Period',
    'rose_period': 'Rose Period',
    'analytical_cubism': 'Analytical Cubism',
    'synthetic_cubism': 'Synthetic Cubism',
    'line_sketch': 'Line Sketch',
    'scream': 'The Scream Style',
    'symbolist': 'Symbolist Phase',
    'frieze': 'Frieze of Life',
    'late_impressionism': 'Late Impressionism',
    'woodcuts': 'Woodcuts & Lithographs',
    'classic_surrealism': 'Classic Surrealism',
    'paranoiac': 'Paranoiac-Critical Method',
    'religious_mythic': 'Religious/Mythic Phase',
    'animal_hybrids': 'Animal Hybrids',
    'hyperrealist': 'Hyperrealist Surrealism',
    'starry_night': 'Starry Night Style',
    'sunflowers': 'Sunflowers/Still Lifes',
    'arles_portraits': 'Arles Portraits',
    'early_dutch': 'Early Dutch Phase',
    'japanese': 'Japanese-Inspired',
    'fauvism': 'Fauvism',
    'interiors': 'Decorative Interiors',
    'simplified_portraits': 'Simplified Portraits',
    'cutouts': 'Cut-outs',
    'golden': 'Golden Phase',
    'portraits': 'Portraits',
    'landscapes': 'Landscapes',
    'sketches': 'Sketches',
    'water_lilies': 'Water Lilies',
    'haystacks_cathedral': 'Haystacks/Cathedral Series',
    'urban': 'Urban Impressionism',
    'early_realism': 'Early Realism',
    'screaming_popes': 'Screaming Popes',
    'triptychs': 'Triptychs',
    'distorted_portraits': 'Distorted Portraits',
    'animalistic_abstractions': 'Animalistic Abstractions',
    'posters': 'Posters',
    'seasonal': 'Seasonal Panels',
    'decorative_panels': 'Decorative Panels',
    'lithographs': 'Lithographs',
    'great_wave': 'The Great Wave',
    'mount_fuji': 'Mount Fuji Series',
    'nature_animals': 'Nature & Animals',
    'manga_sketches': 'Manga Sketches',
    'marilyn': 'Marilyn-style Silkscreens',
    'silkscreen_imperfections': 'Silkscreen Imperfections',
    'commercial_flat': 'Commercial Flat',
    'neo_expressionist': 'Neo-expressionist Graffiti',
    'text_symbols': 'Text & Symbols',
    'primitive_figures': 'Primitive Figures',
    'color_block': 'Color-block Compositions',
    'chiaroscuro': 'Chiaroscuro',
    'religious': 'Religious Dramatic Scenes',
    'still_life': 'Still-life Naturalism',
    'portrait_chiaroscuro': 'Portrait Chiaroscuro',
    'self_portrait': 'Self-Portrait Style',
    'etchings': 'Sketch Etchings',
    'hellscapes': 'Fantastical Hellscapes',
    'hybrid_animals': 'Hybrid Animals',
    'surreal_allegories': 'Surreal Allegories',
    'geometric': 'Geometric Abstraction',
    'early_naturalism': 'Early Naturalism',
    'drip': 'Drip Technique',
    'action': 'Action Painting',
    'biomorphic': 'Biomorphic Abstraction',
    'childlike': 'Childlike Primitivism',
    'comic_pop': 'Comic Pop',
    'whaam': 'Whaam!-style',
    'outlined_figures': 'Outlined Figures',
    'motion_lines': 'Motion Lines'
  }
  
  return styleMap[styleKey] || styleKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}