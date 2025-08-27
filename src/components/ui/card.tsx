import * as React from 'react'
import { cn } from './utils'
import { IS_MODERN } from '@/lib/flags'

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = IS_MODERN
    ? 'rounded-xl border border-gray-200/60 bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur text-gray-900 shadow-md hover:shadow-lg transition-shadow'
    : 'rounded-lg border bg-white text-gray-900 shadow-sm'
  return <div className={cn(base, className)} {...props} />
}
function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = IS_MODERN ? 'flex flex-col space-y-1.5 p-5' : 'flex flex-col space-y-1.5 p-4'
  return <div className={cn(base, className)} {...props} />
}
function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const base = IS_MODERN ? 'font-semibold leading-none tracking-tight text-gray-900' : 'font-semibold leading-none tracking-tight'
  return <h3 className={cn(base, className)} {...props} />
}
function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = IS_MODERN ? 'p-5 pt-0' : 'p-4 pt-0'
  return <div className={cn(base, className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardContent }
