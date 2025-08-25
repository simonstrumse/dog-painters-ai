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

type SelectionMode = 'style' | 'reference'

export default function StylePicker({ value, onChange }: Props) {
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null)
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('style')
  
  const addStyleSelection = (artistKey: string, styleKey: string) => {
    const newSelection: StyleSelection = {
      artistKey,
      styleKey,
      dogName: ''
    }
    onChange([...value, newSelection])
  }

  const addReferenceSelection = (artistKey: string, customReference: string) => {
    const newSelection: StyleSelection = {
      artistKey,
      customReference,
      dogName: ''
    }
    onChange([...value, newSelection])
  }

  const removeSelection = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateDogName = (index: number, dogName: string) => {
    const updated = [...value]
    updated[index] = { ...updated[index], dogName: dogName || undefined }
    onChange(updated)
  }

  const selectedSet = useMemo(() => 
    new Set(value.map(v => v.styleKey ? `${v.artistKey}:${v.styleKey}` : `${v.artistKey}:${v.customReference}`)), 
    [value]
  )

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Create Artistic Portraits</h3>
        <p className="text-sm text-gray-600">
          Choose an artist, then select either a style period OR reference a specific painting. Name your dog for artistic titles!
        </p>
      </div>

      {/* Selection Mode Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setSelectionMode('style')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectionMode === 'style' 
              ? 'bg-white text-blue-700 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Palette className="h-4 w-4" />
          Style Periods
        </button>
        <button
          onClick={() => setSelectionMode('reference')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectionMode === 'reference' 
              ? 'bg-white text-blue-700 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Image className="h-4 w-4" />
          Specific Paintings
        </button>
      </div>

      {/* Selected Styles */}
      {value.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Your Selections ({value.length})</h4>
          <div className="space-y-3">
            {value.map((selection, index) => {
              const artist = DOG_STYLE_LIBRARY.find(a => a.key === selection.artistKey)
              const style = artist?.styles.find(s => s.key === selection.styleKey)
              const isReference = !!selection.customReference
              
              return (
                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
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
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Dog's name (for artistic title, e.g., 'LE FLUKE')"
                      value={selection.dogName || ''}
                      onChange={(e) => updateDogName(index, e.target.value)}
                      className="w-full text-sm px-3 py-2 border rounded-md bg-white"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Artist Selection */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Choose Artists</h4>
        <div className="grid gap-3">
          {DOG_STYLE_LIBRARY.map((artist) => {
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
                    {selectionMode === 'style' ? (
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-700">Style Periods</h5>
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
                    ) : (
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-700">Reference a Specific Painting</h5>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder={`Enter a ${artist.name} painting (e.g., ${artist.examples?.[0] || 'famous work'})`}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement
                                if (input.value.trim()) {
                                  addReferenceSelection(artist.key, input.value.trim())
                                  input.value = ''
                                }
                              }
                            }}
                          />
                          {artist.examples && (
                            <div className="space-y-2">
                              <span className="text-xs text-gray-500">Famous {artist.name} works:</span>
                              <div className="flex flex-wrap gap-2">
                                {artist.examples.map((example, i) => (
                                  <button
                                    key={i}
                                    onClick={() => addReferenceSelection(artist.key, example)}
                                    className="text-sm px-3 py-1.5 bg-white border rounded-md hover:bg-blue-50 hover:border-blue-300 text-gray-700"
                                  >
                                    {example}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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