import { format } from "date-fns"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const ActivityItem = ({ activity, contacts = [], deals = [] }) => {
  const contact = contacts.find(c => c.Id === activity.contactId)
  const deal = deals.find(d => d.Id === activity.dealId)

  const getActivityIcon = (type) => {
    switch (type) {
      case "call": return "Phone"
      case "email": return "Mail"
      case "meeting": return "Calendar"
      case "note": return "FileText"
      case "task": return "CheckSquare"
      default: return "Activity"
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case "call": return "info"
      case "email": return "secondary"
      case "meeting": return "warning"
      case "note": return "default"
      case "task": return activity.completed ? "success" : "error"
      default: return "default"
    }
  }

  return (
    <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        activity.completed ? "bg-success/10" : "bg-gray-100"
      }`}>
        <ApperIcon 
          name={getActivityIcon(activity.type)} 
          size={18} 
          className={activity.completed ? "text-success" : "text-gray-600"}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {activity.description}
            </p>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getActivityColor(activity.type)} className="text-xs">
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </Badge>
              
              {contact && (
                <span className="text-xs text-gray-500">
                  for {contact.name}
                </span>
              )}
              
              {deal && (
                <span className="text-xs text-gray-500">
                  • {deal.title}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 ml-2">
            {format(new Date(activity.createdAt), "MMM dd, h:mm a")}
          </div>
        </div>
        
        {activity.dueDate && !activity.completed && (
          <div className="flex items-center gap-1 mt-2 text-xs text-warning">
            <ApperIcon name="Clock" size={12} />
            Due {format(new Date(activity.dueDate), "MMM dd, yyyy")}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityItem