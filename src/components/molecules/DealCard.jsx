import { useState } from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const DealCard = ({ 
  deal, 
  onEdit, 
  onDelete, 
  isDragging = false,
  contacts = [] 
}) => {
  const [showMenu, setShowMenu] = useState(false)

const contact = contacts.find(c => c.Id === (deal.contactId_c?.Id || deal.contactId_c))
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(deal.value_c || deal.value || 0)

  const getStageColor = (stage) => {
    switch (stage) {
      case "Lead": return "default"
      case "Qualified": return "info"
      case "Proposal": return "warning"
      case "Negotiation": return "secondary"
      case "Closed Won": return "success"
      case "Closed Lost": return "error"
      default: return "default"
    }
  }

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isDragging ? "opacity-80 rotate-2" : ""
      }`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
<h3 className="font-semibold text-gray-900 truncate">
              {deal.title_c || deal.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {contact?.Name || deal.contactId_c?.Name || "Unknown Contact"}
            </p>
          </div>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="MoreVertical" size={16} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    onEdit?.(deal)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
setShowMenu(false)
                    onDelete?.(deal.Id)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-error hover:bg-gray-50 rounded-b-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Value */}
        <div className="text-lg font-bold text-gray-900">
          {formattedValue}
        </div>

{/* Stage Badge */}
        <Badge variant={getStageColor(deal.stage_c || deal.stage)}>
          {deal.stage_c || deal.stage}
        </Badge>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
<ApperIcon name="Calendar" size={12} />
            {deal.expectedClose_c || deal.expectedClose ? format(new Date(deal.expectedClose_c || deal.expectedClose), "MMM dd") : "No date"}
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Target" size={12} />
            {deal.probability_c || deal.probability}%
          </div>
        </div>
      </div>
    </Card>
  )
}

export default DealCard