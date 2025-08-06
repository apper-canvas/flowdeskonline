import { toast } from "react-toastify"

class DealService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    
    this.tableName = 'deal_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "contactId_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "probability_c" } },
          { field: { Name: "expectedClose_c" } },
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
        console.error("Error fetching deals:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to load deals")
      }
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "contactId_c" } },
          { field: { Name: "probability_c" } },
          { field: { Name: "expectedClose_c" } },
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
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(dealData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: dealData.title_c || dealData.title,
        title_c: dealData.title_c || dealData.title,
        value_c: parseFloat(dealData.value_c || dealData.value),
        stage_c: dealData.stage_c || dealData.stage,
        contactId_c: parseInt(dealData.contactId_c || dealData.contactId),
        probability_c: dealData.probability_c || dealData.probability || '50',
        expectedClose_c: dealData.expectedClose_c || dealData.expectedClose,
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
          console.error(`Failed to create deal records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating deal:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to create deal")
      }
      return null
    }
  }

  async update(id, dealData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        Name: dealData.title_c || dealData.title,
        title_c: dealData.title_c || dealData.title,
        value_c: parseFloat(dealData.value_c || dealData.value),
        stage_c: dealData.stage_c || dealData.stage,
        contactId_c: parseInt(dealData.contactId_c || dealData.contactId),
        probability_c: dealData.probability_c || dealData.probability,
        expectedClose_c: dealData.expectedClose_c || dealData.expectedClose
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
          console.error(`Failed to update deal records:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating deal:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to update deal")
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
          console.error(`Failed to delete deal records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to delete deal")
      }
      return false
    }
  }
}

export const dealService = new DealService()