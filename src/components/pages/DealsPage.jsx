import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import DealModal from "@/components/organisms/DealModal";
import DealPipeline from "@/components/organisms/DealPipeline";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";

const DealsPage = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [dealModal, setDealModal] = useState({ isOpen: false, deal: null, initialStage: "Lead" })

  const stages = [
    { id: "all", name: "All Stages" },
    { id: "Lead", name: "Lead" },
    { id: "Qualified", name: "Qualified" },
    { id: "Proposal", name: "Proposal" },
    { id: "Negotiation", name: "Negotiation" },
    { id: "Closed Won", name: "Closed Won" },
    { id: "Closed Lost", name: "Closed Lost" }
  ]

  const loadDeals = async () => {
    try {
      setError("")
const data = await dealService.getAll()
      setDeals(data)
    } catch (err) {
      console.error("Error loading deals:", err)
      setError("Failed to load deals. Please try again.")
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

  useEffect(() => {
    loadDeals()
    loadContacts()
  }, [])

  const filteredDeals = deals.filter(deal => {
const matchesSearch = (deal.title_c || deal.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contacts.find(c => c.Id === (deal.contactId_c?.Id || deal.contactId_c))?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = selectedStage === "all" || deal.stage === selectedStage
    
    return matchesSearch && matchesStage
  })

  const handleDragEnd = async (dealId, newStage) => {
    try {
const deal = deals.find(d => d.Id === dealId)
      if (!deal) return

const updatedDeal = { ...deal, stage_c: newStage }
      const result = await dealService.update(dealId, updatedDeal)
      if (result) {
        setDeals(prev => prev.map(d => d.Id === dealId ? result : d))
      }
      toast.success(`Deal moved to ${newStage}`)
    } catch (err) {
      console.error("Error updating deal:", err)
      toast.error("Failed to update deal")
    }
  }

  const handleSaveDeal = async (dealData) => {
    try {
if (dealModal.deal) {
        const updatedDeal = await dealService.update(dealModal.deal.Id, dealData)
        if (updatedDeal) {
          setDeals(prev => prev.map(d => d.Id === dealModal.deal.Id ? updatedDeal : d))
        }
        toast.success("Deal updated successfully")
} else {
        const newDeal = await dealService.create(dealData)
        if (newDeal) {
          setDeals(prev => [...prev, newDeal])
          toast.success("Deal created successfully")
        }
      }
      setDealModal({ isOpen: false, deal: null, initialStage: "Lead" })
    } catch (err) {
      console.error("Error saving deal:", err)
      toast.error("Failed to save deal")
    }
  }

const handleDeleteDeal = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return

    try {
      const success = await dealService.delete(dealId)
      if (success) {
        setDeals(prev => prev.filter(d => d.Id !== dealId))
        toast.success("Deal deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting deal:", err)
      toast.error("Failed to delete deal")
    }
  }

const totalValue = filteredDeals.reduce((sum, deal) => sum + (deal.value_c || deal.value || 0), 0)
  const wonDeals = filteredDeals.filter(deal => (deal.stage_c || deal.stage) === "Closed Won")
  const wonValue = wonDeals.reduce((sum, deal) => sum + (deal.value_c || deal.value || 0), 0)

  if (loading) return <Loading text="Loading deals..." />
  if (error) return <Error message={error} onRetry={loadDeals} />

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Deal Pipeline</h1>
            <p className="text-gray-600">Track and manage your sales opportunities</p>
          </div>
          
          <Button
            onClick={() => setDealModal({ isOpen: true, deal: null, initialStage: "Lead" })}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Add Deal
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pipeline</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-success" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Won Deals</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${wonValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="BarChart3" size={24} className="text-info" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900">
{filteredDeals.filter(d => !(d.stage_c || d.stage).startsWith("Closed")).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <SearchBar
            placeholder="Search deals and contacts..."
            onSearch={setSearchTerm}
            className="flex-1"
          />
          
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[160px]"
          >
            {stages.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline */}
      {filteredDeals.length === 0 ? (
        <Empty
          icon="Target"
          title="No deals found"
          message="Start building your pipeline by adding your first deal."
          actionLabel="Add Deal"
          onAction={() => setDealModal({ isOpen: true, deal: null, initialStage: "Lead" })}
        />
      ) : (
        <DealPipeline
          deals={filteredDeals}
          contacts={contacts}
          onDragEnd={handleDragEnd}
          onEditDeal={(deal) => setDealModal({ isOpen: true, deal, initialStage: deal.stage })}
          onDeleteDeal={handleDeleteDeal}
          onAddDeal={(stage) => setDealModal({ isOpen: true, deal: null, initialStage: stage })}
        />
      )}

      {/* Deal Modal */}
      <DealModal
        isOpen={dealModal.isOpen}
        onClose={() => setDealModal({ isOpen: false, deal: null, initialStage: "Lead" })}
        deal={dealModal.deal}
        contacts={contacts}
        initialStage={dealModal.initialStage}
        onSave={handleSaveDeal}
      />
    </div>
  )
}

export default DealsPage