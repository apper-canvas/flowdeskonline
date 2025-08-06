import dealsData from "@/services/mockData/deals.json"

class DealService {
  constructor() {
    this.deals = [...dealsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.deals]
  }

  async getById(id) {
    await this.delay(200)
    return this.deals.find(deal => deal.Id === id)
  }

  async create(dealData) {
    await this.delay(400)
    const maxId = Math.max(...this.deals.map(d => d.Id))
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString()
    }
    this.deals.push(newDeal)
    return newDeal
  }

  async update(id, dealData) {
    await this.delay(300)
    const index = this.deals.findIndex(deal => deal.Id === id)
    if (index === -1) throw new Error("Deal not found")
    
    const updatedDeal = { 
      ...this.deals[index], 
      ...dealData 
    }
    this.deals[index] = updatedDeal
    return updatedDeal
  }

  async delete(id) {
    await this.delay(300)
    const index = this.deals.findIndex(deal => deal.Id === id)
    if (index === -1) throw new Error("Deal not found")
    
    this.deals.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const dealService = new DealService()