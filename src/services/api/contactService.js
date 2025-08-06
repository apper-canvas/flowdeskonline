import contactsData from "@/services/mockData/contacts.json"

class ContactService {
  constructor() {
    this.contacts = [...contactsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.contacts]
  }

  async getById(id) {
    await this.delay(200)
    return this.contacts.find(contact => contact.Id === id)
  }

  async create(contactData) {
    await this.delay(400)
    const maxId = Math.max(...this.contacts.map(c => c.Id))
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }
    this.contacts.push(newContact)
    return newContact
  }

  async update(id, contactData) {
    await this.delay(300)
    const index = this.contacts.findIndex(contact => contact.Id === id)
    if (index === -1) throw new Error("Contact not found")
    
    const updatedContact = { 
      ...this.contacts[index], 
      ...contactData 
    }
    this.contacts[index] = updatedContact
    return updatedContact
  }

  async delete(id) {
    await this.delay(300)
    const index = this.contacts.findIndex(contact => contact.Id === id)
    if (index === -1) throw new Error("Contact not found")
    
    this.contacts.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const contactService = new ContactService()