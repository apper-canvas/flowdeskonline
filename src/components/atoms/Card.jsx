import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl bg-white shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md",
      className
    )}
    {...props}
  />
))

Card.displayName = "Card"

export default Card