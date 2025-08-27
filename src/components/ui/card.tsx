import * as React from 'react'
import { cn } from './utils'

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = 'rounded-xl border border-gray-200/60 bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur text-gray-900 shadow-md hover:shadow-lg transition-shadow'
  return <div className={cn(base, className)} {...props} />
}
function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = 'flex flex-col space-y-1.5 p-5'
  return <div className={cn(base, className)} {...props} />
}
function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const base = 'font-semibold leading-none tracking-tight text-gray-900'
  return <h3 className={cn(base, className)} {...props} />
}
function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = 'p-5 pt-0'
  return <div className={cn(base, className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardContent }
