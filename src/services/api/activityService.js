import activitiesData from "@/services/mockData/activities.json"

class ActivityService {
  constructor() {
    this.activities = [...activitiesData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.activities]
  }

  async getById(id) {
    await this.delay(200)
    return this.activities.find(activity => activity.Id === id)
  }

  async create(activityData) {
    await this.delay(400)
    const maxId = Math.max(...this.activities.map(a => a.Id))
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      completed: activityData.type === "note" ? true : false,
      createdAt: new Date().toISOString()
    }
    this.activities.push(newActivity)
    return newActivity
  }

  async update(id, activityData) {
    await this.delay(300)
    const index = this.activities.findIndex(activity => activity.Id === id)
    if (index === -1) throw new Error("Activity not found")
    
    const updatedActivity = { 
      ...this.activities[index], 
      ...activityData 
    }
    this.activities[index] = updatedActivity
    return updatedActivity
  }

  async delete(id) {
    await this.delay(300)
    const index = this.activities.findIndex(activity => activity.Id === id)
    if (index === -1) throw new Error("Activity not found")
    
    this.activities.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const activityService = new ActivityService()