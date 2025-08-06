import { useState } from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const ContactCard = ({ contact, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
{getInitials(contact.Name)}
            </div>
            <div>
<h3 className="font-semibold text-gray-900">{contact.Name}</h3>
              {contact.company_c && (
                <p className="text-sm text-gray-600">{contact.company_c}</p>
              )}
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="MoreVertical" size={16} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    onEdit?.(contact)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false)
                    onDelete?.(contact.Id)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-error hover:bg-gray-50 rounded-b-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
{contact.email_c && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Mail" size={14} />
              {contact.email_c}
            </div>
          )}
{contact.phone_c && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Phone" size={14} />
              {contact.phone_c}
            </div>
          )}
        </div>

        {/* Tags */}
{((contact.Tags && contact.Tags.split(',').length > 0) || (contact.tags && contact.tags.length > 0)) && (
          <div className="flex flex-wrap gap-1">
            {(contact.Tags ? contact.Tags.split(',') : contact.tags || []).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
<ApperIcon name="Calendar" size={12} />
            Added {format(new Date(contact.createdAt_c || contact.createdAt), "MMM dd, yyyy")}
          </div>
{(contact.lastActivity_c || contact.lastActivity) && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={12} />
              Last {format(new Date(contact.lastActivity_c || contact.lastActivity), "MMM dd")}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ContactCard