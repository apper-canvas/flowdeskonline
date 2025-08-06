import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import ContactCard from "@/components/molecules/ContactCard"
import ContactModal from "@/components/organisms/ContactModal"
import ActivityModal from "@/components/organisms/ActivityModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { contactService } from "@/services/api/contactService"
import { dealService } from "@/services/api/dealService"
import { activityService } from "@/services/api/activityService"

const ContactsPage = () => {
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")
  const [contactModal, setContactModal] = useState({ isOpen: false, contact: null })
  const [activityModal, setActivityModal] = useState({ isOpen: false, contactId: null })

  const loadContacts = async () => {
    try {
      setError("")
      const data = await contactService.getAll()
      setContacts(data)
    } catch (err) {
      console.error("Error loading contacts:", err)
      setError("Failed to load contacts. Please try again.")
    } finally {
      setLoading(false)
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
    loadContacts()
    loadDeals()
  }, [])

  const allTags = ["all", ...new Set(contacts.flatMap(contact => contact.tags || []))]

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === "all" || (contact.tags && contact.tags.includes(selectedTag))
    
    return matchesSearch && matchesTag
  })

  const handleSaveContact = async (contactData) => {
    try {
      if (contactModal.contact) {
        const updatedContact = await contactService.update(contactModal.contact.Id, contactData)
        setContacts(prev => prev.map(c => c.Id === contactModal.contact.Id ? updatedContact : c))
        toast.success("Contact updated successfully")
      } else {
        const newContact = await contactService.create(contactData)
        setContacts(prev => [...prev, newContact])
        toast.success("Contact created successfully")
      }
      setContactModal({ isOpen: false, contact: null })
    } catch (err) {
      console.error("Error saving contact:", err)
      toast.error("Failed to save contact")
    }
  }

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact? This will also delete all related deals and activities.")) return

    try {
      await contactService.delete(contactId)
      setContacts(prev => prev.filter(c => c.Id !== contactId))
      toast.success("Contact deleted successfully")
    } catch (err) {
      console.error("Error deleting contact:", err)
      toast.error("Failed to delete contact")
    }
  }

  const handleSaveActivity = async (activityData) => {
    try {
      const newActivity = await activityService.create(activityData)
      
      // Update the contact's last activity timestamp
      const contactId = activityData.contactId
      const contact = contacts.find(c => c.Id === contactId)
      if (contact) {
        const updatedContact = { ...contact, lastActivity: new Date().toISOString() }
        await contactService.update(contactId, updatedContact)
        setContacts(prev => prev.map(c => c.Id === contactId ? updatedContact : c))
      }
      
      toast.success("Activity added successfully")
      setActivityModal({ isOpen: false, contactId: null })
    } catch (err) {
      console.error("Error saving activity:", err)
      toast.error("Failed to save activity")
    }
  }

  if (loading) return <Loading text="Loading contacts..." />
  if (error) return <Error message={error} onRetry={loadContacts} />

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
            <p className="text-gray-600">Manage your customer relationships</p>
          </div>
          
          <Button
            onClick={() => setContactModal({ isOpen: true, contact: null })}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Add Contact
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Building" size={24} className="text-success" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Companies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(contacts.filter(c => c.company).map(c => c.company)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" size={24} className="text-info" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {deals.filter(d => !d.stage.startsWith("Closed")).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <SearchBar
            placeholder="Search contacts..."
            onSearch={setSearchTerm}
            className="flex-1"
          />
          
          {allTags.length > 1 && (
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[160px]"
            >
              {allTags.map(tag => (
                <option key={tag} value={tag}>
                  {tag === "all" ? "All Tags" : tag}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Contact Grid */}
      {filteredContacts.length === 0 ? (
        <Empty
          icon="Users"
          title="No contacts found"
          message="Start building your network by adding your first contact."
          actionLabel="Add Contact"
          onAction={() => setContactModal({ isOpen: true, contact: null })}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div key={contact.Id} className="relative group">
              <ContactCard
                contact={contact}
                onEdit={(contact) => setContactModal({ isOpen: true, contact })}
                onDelete={handleDeleteContact}
              />
              
              {/* Quick Actions */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActivityModal({ isOpen: true, contactId: contact.Id })}
                  className="bg-white shadow-sm hover:shadow-md"
                  title="Add Activity"
                >
                  <ApperIcon name="Plus" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModal.isOpen}
        onClose={() => setContactModal({ isOpen: false, contact: null })}
        contact={contactModal.contact}
        onSave={handleSaveContact}
      />

      {/* Activity Modal */}
      <ActivityModal
        isOpen={activityModal.isOpen}
        onClose={() => setActivityModal({ isOpen: false, contactId: null })}
        contacts={contacts}
        deals={deals}
        preSelectedContactId={activityModal.contactId}
        onSave={handleSaveActivity}
      />
    </div>
  )
}

export default ContactsPage