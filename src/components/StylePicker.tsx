"use client"
import { DOG_STYLE_LIBRARY } from '@/lib/styles'
import type { StyleSelection } from '@/types'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ChevronDown, ChevronRight, Plus, X, Palette, Image } from 'lucide-react'

type Props = {
  value: StyleSelection[]
  onChange: (v: StyleSelection[]) => void
}

export default function StylePicker({ value, onChange }: Props) {
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null)
  const [paintingInputs, setPaintingInputs] = useState<{[key: string]: string}>({})
  const [sortBy, setSortBy] = useState<'random' | 'alphabetical' | 'chronological' | 'popularity'>('random')
  const [activeCategories, setActiveCategories] = useState<string[]>([])

  const addStyleSelection = (artistKey: string, styleKey: string) => {
    const newSelection: StyleSelection = {
      artistKey,
      styleKey
    }
    onChange([...value, newSelection])
  }

  const addReferenceSelection = (artistKey: string, customReference: string) => {
    const newSelection: StyleSelection = {
      artistKey,
      customReference
    }
    onChange([...value, newSelection])
  }

  const removeSelection = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const selectedSet = useMemo(() => 
    new Set(value.map(v => v.styleKey ? `${v.artistKey}:${v.styleKey}` : `${v.artistKey}:${v.customReference}`)), 
    [value]
  )

  // All categories discovered from the library
  const allCategories = useMemo(() => {
    const set = new Set<string>()
    for (const a of DOG_STYLE_LIBRARY) {
      (a.categories || []).forEach((c) => set.add(c))
    }
    return Array.from(set).sort((a,b) => a.localeCompare(b))
  }, [])

  // A persistent randomized order for default sort
  const randomizedKeys = useMemo(() => {
    return [...DOG_STYLE_LIBRARY.map(a => a.key)].sort(() => Math.random() - 0.5)
  }, [])

  const artistsList = useMemo(() => {
    // Filter by categories (if any active)
    const filtered = DOG_STYLE_LIBRARY.filter(a => {
      if (activeCategories.length === 0) return true
      const cats = a.categories || []
      return cats.some(c => activeCategories.includes(c))
    })

    if (sortBy === 'random') {
      const order = new Map(randomizedKeys.map((k, i) => [k, i]))
      return [...filtered].sort((a, b) => (order.get(a.key)! - order.get(b.key)!))
    }

    if (sortBy === 'alphabetical') {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    }
    if (sortBy === 'chronological') {
      const year = (x?: number) => (typeof x === 'number' ? x : Number.POSITIVE_INFINITY)
      return [...filtered].sort((a, b) => year(a.birthYear) - year(b.birthYear))
    }
    if (sortBy === 'popularity') {
      const score = (x?: number) => (typeof x === 'number' ? x : 0)
      return [...filtered].sort((a, b) => score(b.popularity) - score(a.popularity))
    }
    return filtered
  }, [sortBy, activeCategories, randomizedKeys])

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Select Artists & Styles</h3>
        <p className="text-sm text-gray-600">
          Choose an artist and their style, or reference a specific painting instead.
        </p>
      </div>

      {/* Selected Styles */}
      {value.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Selected ({value.length})</h4>
          <div className="space-y-2">
            {value.map((selection, index) => {
              const artist = DOG_STYLE_LIBRARY.find(a => a.key === selection.artistKey)
              const style = artist?.styles.find(s => s.key === selection.styleKey)
              const isReference = !!selection.customReference
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{artist?.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {isReference ? `"${selection.customReference}"` : style?.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSelection(index)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Sort & Filter Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="random">Random</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="chronological">Chronological</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => {
              const active = activeCategories.includes(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`text-xs px-2 py-1 rounded border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              )
            })}
            {activeCategories.length > 0 && (
              <button onClick={() => setActiveCategories([])} className="text-xs px-2 py-1 rounded border bg-white text-gray-700 hover:bg-gray-50">Clear</button>
            )}
          </div>
        )}
      </div>

      {/* Artist Selection */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Choose Artists & Styles</h4>
        <div className="grid gap-3">
          {artistsList.map((artist) => {
            const isExpanded = expandedArtist === artist.key
            const hasSelections = value.some(v => v.artistKey === artist.key)
            
            return (
              <Card key={artist.key} className={hasSelections ? 'border-blue-300 bg-blue-50/30' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{artist.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedArtist(isExpanded ? null : artist.key)}
                      className="h-8 w-8 p-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {hasSelections && (
                    <div className="text-xs text-blue-600 font-medium">
                      {value.filter(v => v.artistKey === artist.key).length} selected
                    </div>
                  )}
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Painting Reference Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Or reference a specific painting:
                        </label>
                        <input
                          type="text"
                          placeholder={`e.g., ${artist.examples?.[0] || 'famous work'}`}
                          value={paintingInputs[artist.key] || ''}
                          onChange={(e) => setPaintingInputs(prev => ({...prev, [artist.key]: e.target.value}))}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!paintingInputs[artist.key]?.trim()}
                            onClick={() => {
                              if (paintingInputs[artist.key]?.trim()) {
                                addReferenceSelection(artist.key, paintingInputs[artist.key].trim())
                                setPaintingInputs(prev => ({...prev, [artist.key]: ''}))
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Painting Reference
                          </Button>
                        </div>
                        {artist.examples && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-gray-500">Examples:</span>
                            {artist.examples.slice(0, 3).map((example, i) => (
                              <button
                                key={i}
                                onClick={() => setPaintingInputs(prev => ({...prev, [artist.key]: example}))}
                                className="text-xs px-2 py-0.5 bg-white border rounded hover:bg-gray-50 text-blue-600"
                              >
                                {example}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Style Periods */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Style periods:</label>
                        <div className="grid gap-2">
                          {artist.styles.map((style) => {
                            const isSelected = selectedSet.has(`${artist.key}:${style.key}`)
                            
                            return (
                              <div key={style.key} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm mb-1">{style.name}</div>
                                  <div className="text-xs text-gray-600 line-clamp-2">{style.prompt}</div>
                                </div>
                                <Button
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                  disabled={isSelected}
                                  onClick={() => addStyleSelection(artist.key, style.key)}
                                  className="shrink-0"
                                >
                                  {isSelected ? "Added" : <Plus className="h-4 w-4" />}
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
