import { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"

const DealModal = ({ 
  isOpen, 
  onClose, 
  deal = null, 
  onSave, 
  contacts = [], 
  initialStage = "Lead" 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "Lead",
    contactId: "",
    probability: "50",
    expectedClose: ""
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const stages = [
    "Lead",
    "Qualified", 
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost"
  ]

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "Lead",
        contactId: deal.contactId?.toString() || "",
        probability: deal.probability?.toString() || "50",
        expectedClose: deal.expectedClose ? deal.expectedClose.split("T")[0] : ""
      })
    } else {
      setFormData({
        title: "",
        value: "",
        stage: initialStage || "Lead",
        contactId: "",
        probability: "50",
        expectedClose: ""
      })
    }
    setErrors({})
  }, [deal, initialStage, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required"
    }
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = "Deal value must be greater than 0"
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact"
    }

    if (!formData.probability || parseInt(formData.probability) < 0 || parseInt(formData.probability) > 100) {
      newErrors.probability = "Probability must be between 0 and 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        contactId: parseInt(formData.contactId),
        probability: parseInt(formData.probability)
      }
      
      await onSave(dealData)
      onClose()
    } catch (error) {
      console.error("Error saving deal:", error)
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
            {deal ? "Edit Deal" : "Add New Deal"}
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
            label="Deal Title *"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter deal title"
            error={errors.title}
          />

          <FormField
            label="Deal Value *"
            type="number"
            step="0.01"
            min="0"
            value={formData.value}
            onChange={(e) => handleInputChange("value", e.target.value)}
            placeholder="0.00"
            error={errors.value}
          />

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
            label="Stage *"
            type="select"
            value={formData.stage}
            onChange={(e) => handleInputChange("stage", e.target.value)}
            error={errors.stage}
          >
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </FormField>

          <FormField
            label="Probability (%)"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => handleInputChange("probability", e.target.value)}
            placeholder="50"
            error={errors.probability}
          />

          <FormField
            label="Expected Close Date"
            type="date"
            value={formData.expectedClose}
            onChange={(e) => handleInputChange("expectedClose", e.target.value)}
            error={errors.expectedClose}
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
                deal ? "Update Deal" : "Add Deal"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DealModal