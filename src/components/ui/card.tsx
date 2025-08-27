import * as React from 'react'
import { cn } from './utils'

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = 'rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200'
  return <div className={cn(base, className)} {...props} />
}
function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = 'flex flex-col space-y-1.5 p-6'
  return <div className={cn(base, className)} {...props} />
}
function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const base = 'text-lg font-semibold leading-none tracking-tight text-slate-900'
  return <h3 className={cn(base, className)} {...props} />
}
function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = 'p-6 pt-0'
  return <div className={cn(base, className)} {...props} />
}
function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const base = 'text-sm text-slate-600'
  return <p className={cn(base, className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardContent, CardDescription }
