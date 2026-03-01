import React from 'react'
import { cn } from '@/lib/utils/helpers'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-semibold rounded-md transition-all duration-150 cursor-pointer'

    const variantStyles = {
      primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 active:brightness-95 shadow-lg hover:shadow-glow',
      secondary: 'border-2 border-accent text-accent bg-transparent hover:bg-accent/10 active:bg-accent/20',
      danger: 'bg-error text-white hover:brightness-110 active:brightness-95',
      ghost: 'text-foreground hover:bg-surface-light active:bg-surface-lighter',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          disabledStyles,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="animate-spin-slow inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
