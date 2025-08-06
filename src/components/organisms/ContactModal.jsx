import { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"

const ContactModal = ({ isOpen, onClose, contact = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    tags: ""
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        tags: contact.tags ? contact.tags.join(", ") : ""
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        tags: ""
      })
    }
    setErrors({})
  }, [contact, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const contactData = {
        ...formData,
        tags: formData.tags 
          ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
          : []
      }
      
      await onSave(contactData)
      onClose()
    } catch (error) {
      console.error("Error saving contact:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {contact ? "Edit Contact" : "Add New Contact"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Full Name *"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter full name"
            error={errors.name}
          />

          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter email address"
            error={errors.email}
          />

          <FormField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter phone number"
            error={errors.phone}
          />

          <FormField
            label="Company"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="Enter company name"
            error={errors.company}
          />

          <FormField
            label="Tags"
            value={formData.tags}
            onChange={(e) => handleInputChange("tags", e.target.value)}
            placeholder="Enter tags separated by commas"
            error={errors.tags}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
              ) : (
                contact ? "Update Contact" : "Add Contact"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactModal