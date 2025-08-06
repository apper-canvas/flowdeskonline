import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"

const SettingsPage = () => {
  const [pipelineStages, setPipelineStages] = useState([
    "Lead",
    "Qualified",
    "Proposal", 
    "Negotiation",
    "Closed Won",
    "Closed Lost"
  ])
  
  const [newStage, setNewStage] = useState("")
  const [editingStage, setEditingStage] = useState(null)
  const [editValue, setEditValue] = useState("")
  
  const [preferences, setPreferences] = useState({
    defaultProbability: "50",
    autoSaveInterval: "30",
    emailNotifications: true,
    taskReminders: true,
    dealAlerts: true
  })

  const handleAddStage = () => {
    if (!newStage.trim()) {
      toast.error("Please enter a stage name")
      return
    }
    
    if (pipelineStages.includes(newStage)) {
      toast.error("Stage already exists")
      return
    }
    
    // Insert before the last two stages (Closed Won/Lost)
    const newStages = [...pipelineStages]
    newStages.splice(-2, 0, newStage)
    setPipelineStages(newStages)
    setNewStage("")
    toast.success("Pipeline stage added")
  }

  const handleEditStage = (index, stage) => {
    if (stage === "Closed Won" || stage === "Closed Lost") {
      toast.error("Cannot edit default stages")
      return
    }
    setEditingStage(index)
    setEditValue(stage)
  }

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      toast.error("Please enter a stage name")
      return
    }
    
    if (pipelineStages.includes(editValue) && pipelineStages[editingStage] !== editValue) {
      toast.error("Stage already exists")
      return
    }
    
    const newStages = [...pipelineStages]
    newStages[editingStage] = editValue
    setPipelineStages(newStages)
    setEditingStage(null)
    setEditValue("")
    toast.success("Pipeline stage updated")
  }

  const handleDeleteStage = (index, stage) => {
    if (stage === "Lead" || stage === "Closed Won" || stage === "Closed Lost") {
      toast.error("Cannot delete default stages")
      return
    }
    
    if (!window.confirm(`Are you sure you want to delete the "${stage}" stage?`)) return
    
    const newStages = pipelineStages.filter((_, i) => i !== index)
    setPipelineStages(newStages)
    toast.success("Pipeline stage deleted")
  }

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const handleSavePreferences = () => {
    // In a real app, this would save to the backend
    localStorage.setItem("crm-preferences", JSON.stringify(preferences))
    toast.success("Preferences saved successfully")
  }

  const exportData = () => {
    // In a real app, this would export actual data
    const dummyData = {
      contacts: [],
      deals: [],
      activities: [],
      settings: { pipelineStages, preferences }
    }
    
    const dataStr = JSON.stringify(dummyData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement("a")
    link.href = url
    link.download = "flowdesk-data.json"
    link.click()
    
    toast.success("Data exported successfully")
  }

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("crm-preferences")
    if (saved) {
      setPreferences(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your CRM experience</p>
      </div>

      <div className="space-y-8">
        {/* Pipeline Configuration */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pipeline Stages</h2>
            <p className="text-gray-600">Customize your sales pipeline stages</p>
          </div>

          <div className="space-y-4">
            {/* Existing Stages */}
            <div className="space-y-2">
              {pipelineStages.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                      {index + 1}
                    </div>
                    
                    {editingStage === index ? (
                      <div className="flex items-center gap-2">
                        <FormField
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="Stage name"
                          className="mb-0"
                        />
                        <Button size="sm" onClick={handleSaveEdit}>
                          <ApperIcon name="Check" size={14} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setEditingStage(null)}
                        >
                          <ApperIcon name="X" size={14} />
                        </Button>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900">{stage}</span>
                    )}
                  </div>
                  
                  {editingStage !== index && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditStage(index, stage)}
                        disabled={stage === "Closed Won" || stage === "Closed Lost"}
                      >
                        <ApperIcon name="Edit" size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteStage(index, stage)}
                        disabled={stage === "Lead" || stage === "Closed Won" || stage === "Closed Lost"}
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <ApperIcon name="Trash" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Stage */}
            <div className="flex gap-2">
              <FormField
                placeholder="Enter new stage name"
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                className="flex-1 mb-0"
              />
              <Button onClick={handleAddStage}>
                <ApperIcon name="Plus" size={16} />
                Add Stage
              </Button>
            </div>
          </div>
        </Card>

        {/* General Preferences */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">General Preferences</h2>
            <p className="text-gray-600">Configure default values and behaviors</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Default Deal Probability (%)"
                type="number"
                min="0"
                max="100"
                value={preferences.defaultProbability}
                onChange={(e) => handlePreferenceChange("defaultProbability", e.target.value)}
              />
              
              <FormField
                label="Auto-save Interval (seconds)"
                type="number"
                min="10"
                max="300"
                value={preferences.autoSaveInterval}
                onChange={(e) => handlePreferenceChange("autoSaveInterval", e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h2>
            <p className="text-gray-600">Control when and how you receive notifications</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Task Reminders</h3>
                <p className="text-sm text-gray-600">Get reminded about upcoming tasks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.taskReminders}
                  onChange={(e) => handlePreferenceChange("taskReminders", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Deal Alerts</h3>
                <p className="text-sm text-gray-600">Notifications for deal status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.dealAlerts}
                  onChange={(e) => handlePreferenceChange("dealAlerts", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Management</h2>
            <p className="text-gray-600">Import, export, and manage your CRM data</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={exportData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ApperIcon name="Download" size={16} />
              Export Data
            </Button>
            
            <Button
              variant="outline"
              disabled
              className="flex items-center gap-2 opacity-50 cursor-not-allowed"
              title="Coming soon"
            >
              <ApperIcon name="Upload" size={16} />
              Import Data
            </Button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={handleSavePreferences} className="px-8">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage