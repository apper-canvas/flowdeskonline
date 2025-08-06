import { useState } from "react"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = "" 
}) => {
  const [value, setValue] = useState("")

  const handleSearch = (e) => {
    const searchValue = e.target.value
    setValue(searchValue)
    onSearch?.(searchValue)
  }

  return (
    <div className={`relative ${className}`}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleSearch}
        className="pl-10 pr-4"
      />
    </div>
  )
}

export default SearchBar