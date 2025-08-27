import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './utils'

const buttonVariants = cva(
  'btn-modern inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 transform hover:scale-105',
  {
    variants: {
      variant: {
        default: 'gradient-animated text-white shadow-glass hover:shadow-glow border border-white/20',
        secondary: 'glass text-slate-900 hover:bg-white/40 border border-white/30 shadow-glass',
        outline: 'glass border-slate-300/50 bg-white/30 hover:bg-white/50 hover:border-slate-400/50 shadow-glass',
        ghost: 'hover:bg-white/20 text-slate-700 hover:text-slate-900',
        destructive: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-glass hover:shadow-glow hover:from-red-600 hover:to-pink-700 border border-white/20',
      },
      size: {
        default: 'h-11 px-6 text-sm',
        sm: 'h-8 px-4 text-xs rounded-xl',
        lg: 'h-14 px-10 text-base rounded-3xl',
        icon: 'h-11 w-11 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
