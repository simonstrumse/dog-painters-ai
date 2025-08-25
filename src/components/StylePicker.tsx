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

      {/* Artist Selection */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Choose Artists & Styles</h4>
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