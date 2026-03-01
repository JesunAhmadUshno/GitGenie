import React from 'react'
import { cn } from '@/lib/utils/helpers'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    icon,
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">{icon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2 border-2 border-border rounded-md',
              'bg-surface text-foreground placeholder-foreground-subtle',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-150',
              error && 'border-error',
              !!icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-error mt-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
