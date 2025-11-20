import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
}

export const Button = ({
  variant = 'default',
  size = 'md',
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50'

  const variantClasses = {
    default: 'bg-gray-900 text-gray-50 shadow hover:bg-gray-800',
    primary: 'bg-blue-600 text-white shadow hover:bg-blue-700',
    secondary:
      'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 border border-gray-200',
    danger: 'bg-red-600 text-white shadow hover:bg-red-700',
    outline:
      'border border-gray-200 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
  }

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 py-2',
    lg: 'h-10 px-8',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
