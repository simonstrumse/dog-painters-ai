"use client"
import { DOG_STYLE_LIBRARY } from '@/lib/styles'
import type { StyleSelection } from '@/types'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react'

type Props = {
  value: StyleSelection[]
  onChange: (v: StyleSelection[]) => void
}

export default function StylePicker({ value, onChange }: Props) {
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null)
  
  const addSelection = (artistKey: string, styleKey: string, customReference?: string) => {
    const newSelection: StyleSelection = {
      artistKey,
      styleKey,
      customReference: customReference || undefined
    }
    onChange([...value, newSelection])
  }

  const removeSelection = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateCustomReference = (index: number, customReference: string) => {
    const updated = [...value]
    updated[index] = { ...updated[index], customReference: customReference || undefined }
    onChange(updated)
  }

  const selectedSet = useMemo(() => 
    new Set(value.map(v => `${v.artistKey}:${v.styleKey}`)), 
    [value]
  )

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Select Artists & Styles</h3>
        <p className="text-sm text-gray-600">
          Choose an artist, then pick their style. Add custom painting references for more specific results.
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
              
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{artist?.name}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{style?.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSelection(index)}
                        className="ml-auto h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Optional: Reference a specific painting (e.g., Starry Night, Guernica)"
                        value={selection.customReference || ''}
                        onChange={(e) => updateCustomReference(index, e.target.value)}
                        className="w-full text-xs px-2 py-1 border rounded bg-white"
                      />
                      {artist?.examples && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-gray-500">Examples:</span>
                          {artist.examples.map((example, i) => (
                            <button
                              key={i}
                              onClick={() => updateCustomReference(index, example)}
                              className="text-xs px-2 py-0.5 bg-white border rounded hover:bg-gray-50 text-blue-600"
                            >
                              {example}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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
                    <div className="space-y-3">
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
                                onClick={() => addSelection(artist.key, style.key)}
                                className="shrink-0"
                              >
                                {isSelected ? "Added" : <Plus className="h-4 w-4" />}
                              </Button>
                            </div>
                          )
                        })}
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