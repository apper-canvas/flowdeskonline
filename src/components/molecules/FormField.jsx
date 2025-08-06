import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  className,
  children,
  ...props 
}) => {
  const inputProps = {
    error,
    ...props
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={error ? "text-error" : ""}>
          {label}
        </Label>
      )}
      
      {type === "select" ? (
        <Select {...inputProps}>
          {children}
        </Select>
      ) : (
        <Input type={type} {...inputProps} />
      )}
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default FormField