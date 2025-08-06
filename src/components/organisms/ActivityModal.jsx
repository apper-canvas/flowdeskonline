import { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"

const ActivityModal = ({ 
  isOpen, 
  onClose, 
  activity = null, 
  onSave, 
  contacts = [],
  deals = [],
  preSelectedContactId = null 
}) => {
  const [formData, setFormData] = useState({
    type: "note",
    description: "",
    contactId: "",
    dealId: "",
    dueDate: ""
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const activityTypes = [
    { value: "call", label: "Phone Call" },
    { value: "email", label: "Email" },
    { value: "meeting", label: "Meeting" },
    { value: "note", label: "Note" },
    { value: "task", label: "Task" }
  ]

  useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type || "note",
        description: activity.description || "",
        contactId: activity.contactId?.toString() || "",
        dealId: activity.dealId?.toString() || "",
        dueDate: activity.dueDate ? activity.dueDate.split("T")[0] : ""
      })
    } else {
      setFormData({
        type: "note",
        description: "",
        contactId: preSelectedContactId?.toString() || "",
        dealId: "",
        dueDate: ""
      })
    }
    setErrors({})
  }, [activity, preSelectedContactId, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const activityData = {
        ...formData,
        contactId: parseInt(formData.contactId),
        dealId: formData.dealId ? parseInt(formData.dealId) : null
      }
      
      await onSave(activityData)
      onClose()
    } catch (error) {
      console.error("Error saving activity:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDeals = deals.filter(deal => 
    !formData.contactId || deal.contactId === parseInt(formData.contactId)
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {activity ? "Edit Activity" : "Add New Activity"}
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
            label="Activity Type *"
            type="select"
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            error={errors.type}
          >
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </FormField>

          <FormField
            label="Contact *"
            type="select"
            value={formData.contactId}
            onChange={(e) => handleInputChange("contactId", e.target.value)}
            placeholder="Select a contact"
            error={errors.contactId}
          >
            <option value="">Select a contact</option>
            {contacts.map((contact) => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name} {contact.company && `(${contact.company})`}
              </option>
            ))}
          </FormField>

          <FormField
            label="Related Deal"
            type="select"
            value={formData.dealId}
            onChange={(e) => handleInputChange("dealId", e.target.value)}
            placeholder="Select a deal (optional)"
            error={errors.dealId}
          >
            <option value="">Select a deal (optional)</option>
            {filteredDeals.map((deal) => (
              <option key={deal.Id} value={deal.Id}>
                {deal.title}
              </option>
            ))}
          </FormField>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter activity description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            {errors.description && (
              <p className="text-sm text-error">{errors.description}</p>
            )}
          </div>

          {(formData.type === "task" || formData.type === "meeting") && (
            <FormField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              error={errors.dueDate}
            />
          )}

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
                activity ? "Update Activity" : "Add Activity"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ActivityModal