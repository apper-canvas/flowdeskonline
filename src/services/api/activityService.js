import { toast } from "react-toastify"

class ActivityService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    
    this.tableName = 'activity_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "contactId_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "dealId_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to load activities")
      }
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "contactId_c" } },
          { field: { Name: "dealId_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "createdAt_c" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(activityData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: activityData.description_c || activityData.description,
        type_c: activityData.type_c || activityData.type,
        description_c: activityData.description_c || activityData.description,
        contactId_c: parseInt(activityData.contactId_c || activityData.contactId),
        dealId_c: activityData.dealId_c || activityData.dealId ? parseInt(activityData.dealId_c || activityData.dealId) : null,
        dueDate_c: activityData.dueDate_c || activityData.dueDate,
        completed_c: activityData.type === "note" ? true : (activityData.completed_c || activityData.completed || false),
        createdAt_c: new Date().toISOString()
      }
      
      const params = {
        records: [updateableData]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create activity records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating activity:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to create activity")
      }
      return null
    }
  }

  async update(id, activityData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        Name: activityData.description_c || activityData.description,
        type_c: activityData.type_c || activityData.type,
        description_c: activityData.description_c || activityData.description,
        contactId_c: parseInt(activityData.contactId_c || activityData.contactId),
        dealId_c: activityData.dealId_c || activityData.dealId ? parseInt(activityData.dealId_c || activityData.dealId) : null,
        dueDate_c: activityData.dueDate_c || activityData.dueDate,
        completed_c: activityData.completed_c !== undefined ? activityData.completed_c : activityData.completed
      }
      
      const params = {
        records: [updateableData]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update activity records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating activity:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to update activity")
      }
      return null
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete activity records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to delete activity")
      }
      return false
    }
  }
}

export const activityService = new ActivityService()