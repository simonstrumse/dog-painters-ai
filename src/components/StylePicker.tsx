"use client"
import { DOG_STYLE_LIBRARY } from '@/lib/styles'
import type { StyleSelection } from '@/types'
import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'

type Props = {
  value: StyleSelection[]
  onChange: (v: StyleSelection[]) => void
}

export default function StylePicker({ value, onChange }: Props) {
  const setChecked = (artistKey: string, styleKey: string, checked: boolean) => {
    const next = new Set(value.map((v) => `${v.artistKey}:${v.styleKey}`))
    const key = `${artistKey}:${styleKey}`
    if (checked) next.add(key)
    else next.delete(key)
    const arr: StyleSelection[] = Array.from(next).map((k) => {
      const [a, s] = k.split(':')
      return { artistKey: a, styleKey: s }
    })
    onChange(arr)
  }

  const checkedSet = useMemo(() => new Set(value.map((v) => `${v.artistKey}:${v.styleKey}`)), [value])

  return (
    <div className="space-y-6">
      {DOG_STYLE_LIBRARY.map((artist) => (
        <Card key={artist.key}>
          <CardHeader>
            <CardTitle className="text-lg">{artist.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {artist.styles.map((s) => {
                const id = `${artist.key}_${s.key}`
                const isChecked = checkedSet.has(`${artist.key}:${s.key}`)
                return (
                  <label key={id} className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}>
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => setChecked(artist.key, s.key, (e.target as HTMLInputElement).checked)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm sm:text-base">{s.name}</div>
                      <div className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">{s.prompt}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
