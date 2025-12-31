import { cn } from '@/lib/utils'
import { forwardRef, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
          variant === 'secondary' && 'bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600',
          variant === 'ghost' && 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
          size === 'sm' && 'h-9 px-4 text-sm',
          size === 'md' && 'h-11 px-6 text-sm',
          size === 'lg' && 'h-14 px-8 text-base',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
