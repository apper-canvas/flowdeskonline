import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import ActivityItem from "@/components/molecules/ActivityItem"
import ActivityModal from "@/components/organisms/ActivityModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { activityService } from "@/services/api/activityService"
import { contactService } from "@/services/api/contactService"
import { dealService } from "@/services/api/dealService"

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activityModal, setActivityModal] = useState({ isOpen: false, activity: null })

  const activityTypes = [
    { id: "all", name: "All Types" },
    { id: "call", name: "Phone Call" },
    { id: "email", name: "Email" },
    { id: "meeting", name: "Meeting" },
    { id: "note", name: "Note" },
    { id: "task", name: "Task" }
  ]

  const statusTypes = [
    { id: "all", name: "All Status" },
    { id: "pending", name: "Pending" },
    { id: "completed", name: "Completed" }
  ]

  const loadActivities = async () => {
    try {
      setError("")
      const data = await activityService.getAll()
      setActivities(data)
    } catch (err) {
      console.error("Error loading activities:", err)
      setError("Failed to load activities. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll()
      setContacts(data)
    } catch (err) {
      console.error("Error loading contacts:", err)
    }
  }

  const loadDeals = async () => {
    try {
      const data = await dealService.getAll()
      setDeals(data)
    } catch (err) {
      console.error("Error loading deals:", err)
    }
  }

  useEffect(() => {
    loadActivities()
    loadContacts()
    loadDeals()
  }, [])

  const filteredActivities = activities.filter(activity => {
    const contact = contacts.find(c => c.Id === activity.contactId)
    const deal = deals.find(d => d.Id === activity.dealId)
    
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || activity.type === selectedType
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "completed" && activity.completed) ||
                         (selectedStatus === "pending" && !activity.completed)
    
    return matchesSearch && matchesType && matchesStatus
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const handleSaveActivity = async (activityData) => {
    try {
      if (activityModal.activity) {
        const updatedActivity = await activityService.update(activityModal.activity.Id, activityData)
        setActivities(prev => prev.map(a => a.Id === activityModal.activity.Id ? updatedActivity : a))
        toast.success("Activity updated successfully")
      } else {
        const newActivity = await activityService.create(activityData)
        setActivities(prev => [newActivity, ...prev])
        toast.success("Activity created successfully")
      }
      setActivityModal({ isOpen: false, activity: null })
    } catch (err) {
      console.error("Error saving activity:", err)
      toast.error("Failed to save activity")
    }
  }

  const handleCompleteActivity = async (activityId) => {
    try {
      const activity = activities.find(a => a.Id === activityId)
      if (!activity) return

      const updatedActivity = { ...activity, completed: !activity.completed }
      await activityService.update(activityId, updatedActivity)
      setActivities(prev => prev.map(a => a.Id === activityId ? updatedActivity : a))
      toast.success(updatedActivity.completed ? "Activity marked as completed" : "Activity marked as pending")
    } catch (err) {
      console.error("Error updating activity:", err)
      toast.error("Failed to update activity")
    }
  }

  const completedCount = activities.filter(a => a.completed).length
  const pendingCount = activities.filter(a => !a.completed).length
  const todayCount = activities.filter(a => {
    const today = new Date().toDateString()
    return new Date(a.createdAt).toDateString() === today
  }).length

  if (loading) return <Loading text="Loading activities..." />
  if (error) return <Error message={error} onRetry={loadActivities} />

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities</h1>
            <p className="text-gray-600">Track your customer interactions and tasks</p>
          </div>
          
          <Button
            onClick={() => setActivityModal({ isOpen: true, activity: null })}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Add Activity
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Activity" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" size={24} className="text-warning" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={24} className="text-success" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <SearchBar
            placeholder="Search activities, contacts, and deals..."
            onSearch={setSearchTerm}
            className="flex-1"
          />
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[140px]"
          >
            {activityTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[140px]"
          >
            {statusTypes.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      {filteredActivities.length === 0 ? (
        <Empty
          icon="Activity"
          title="No activities found"
          message="Start tracking your customer interactions by adding your first activity."
          actionLabel="Add Activity"
          onAction={() => setActivityModal({ isOpen: true, activity: null })}
        />
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => (
            <div key={activity.Id} className="relative">
              {/* Timeline Line */}
              {index < filteredActivities.length - 1 && (
                <div className="absolute left-[19px] top-16 w-0.5 h-8 bg-gray-200"></div>
              )}
              
              <div className="flex items-start gap-4">
                {/* Timeline Dot */}
                <div className={`w-2 h-2 rounded-full mt-6 flex-shrink-0 ${
                  activity.completed ? "bg-success" : "bg-gray-300"
                }`}></div>
                
                {/* Activity Item */}
                <div className="flex-1 min-w-0">
                  <ActivityItem
                    activity={activity}
                    contacts={contacts}
                    deals={deals}
                  />
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCompleteActivity(activity.Id)}
                      className="flex items-center gap-1 text-xs"
                    >
                      <ApperIcon 
                        name={activity.completed ? "RotateCcw" : "Check"} 
                        size={12} 
                      />
                      {activity.completed ? "Mark Pending" : "Mark Complete"}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setActivityModal({ isOpen: true, activity })}
                      className="flex items-center gap-1 text-xs"
                    >
                      <ApperIcon name="Edit" size={12} />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Modal */}
      <ActivityModal
        isOpen={activityModal.isOpen}
        onClose={() => setActivityModal({ isOpen: false, activity: null })}
        activity={activityModal.activity}
        contacts={contacts}
        deals={deals}
        onSave={handleSaveActivity}
      />
    </div>
  )
}

export default ActivitiesPage