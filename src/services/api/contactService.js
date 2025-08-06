import { toast } from "react-toastify"

class ContactService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    
    this.tableName = 'contact_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "lastActivity_c" } },
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
        console.error("Error fetching contacts:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to load contacts")
      }
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "lastActivity_c" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(contactData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Name: contactData.Name || contactData.name,
        email_c: contactData.email_c || contactData.email,
        phone_c: contactData.phone_c || contactData.phone,
        company_c: contactData.company_c || contactData.company,
        Tags: Array.isArray(contactData.Tags) ? contactData.Tags.join(',') : 
              Array.isArray(contactData.tags) ? contactData.tags.join(',') : 
              contactData.Tags || contactData.tags || '',
        createdAt_c: new Date().toISOString(),
        lastActivity_c: new Date().toISOString()
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
          console.error(`Failed to create contact records:${JSON.stringify(failedRecords)}`)
          
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
        console.error("Error creating contact:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to create contact")
      }
      return null
    }
  }

  async update(id, contactData) {
    try {
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        Name: contactData.Name || contactData.name,
        email_c: contactData.email_c || contactData.email,
        phone_c: contactData.phone_c || contactData.phone,
        company_c: contactData.company_c || contactData.company,
        Tags: Array.isArray(contactData.Tags) ? contactData.Tags.join(',') : 
              Array.isArray(contactData.tags) ? contactData.tags.join(',') : 
              contactData.Tags || contactData.tags || '',
        lastActivity_c: contactData.lastActivity_c || contactData.lastActivity || new Date().toISOString()
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
          console.error(`Failed to update contact records:${JSON.stringify(failedUpdates)}`)
          
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
        console.error("Error updating contact:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to update contact")
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
          console.error(`Failed to delete contact records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting contact:", error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
      } else {
        console.error(error.message)
        toast.error("Failed to delete contact")
      }
      return false
    }
  }
}

export const contactService = new ContactService()