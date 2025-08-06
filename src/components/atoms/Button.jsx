import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    default: "bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus:ring-primary",
    outline: "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white focus:ring-primary",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
    danger: "bg-error text-white hover:bg-red-600 focus:ring-error",
    success: "bg-success text-white hover:bg-green-600 focus:ring-success"
  }
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button