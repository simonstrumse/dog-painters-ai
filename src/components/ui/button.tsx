import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './utils'
import { IS_MODERN } from '@/lib/flags'

const buttonVariants = cva(
  (
    IS_MODERN
      ? 'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50'
      : 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50'
  ),
  {
    variants: {
      variant: {
        default: IS_MODERN ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700' : 'bg-blue-600 text-white hover:bg-blue-700',
        outline: IS_MODERN ? 'border border-gray-300/70 bg-white/70 backdrop-blur hover:bg-white' : 'border border-gray-300 bg-white hover:bg-gray-50',
        ghost: IS_MODERN ? 'hover:bg-gray-100/60' : 'hover:bg-gray-100',
      },
      size: {
        default: IS_MODERN ? 'h-10 px-5' : 'h-10 px-4 py-2',
        sm: IS_MODERN ? 'h-8 px-3' : 'h-9 rounded-md px-3',
        lg: IS_MODERN ? 'h-12 px-8' : 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
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
