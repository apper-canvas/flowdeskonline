import { useState, useRef } from "react"
import DealCard from "@/components/molecules/DealCard"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const DealPipeline = ({ deals = [], contacts = [], onDragEnd, onEditDeal, onDeleteDeal, onAddDeal }) => {
  const [draggedDeal, setDraggedDeal] = useState(null)
  const dragOverStage = useRef(null)

  const stages = [
    { id: "Lead", name: "Lead", color: "bg-gray-100 border-gray-300" },
    { id: "Qualified", name: "Qualified", color: "bg-blue-100 border-blue-300" },
    { id: "Proposal", name: "Proposal", color: "bg-yellow-100 border-yellow-300" },
    { id: "Negotiation", name: "Negotiation", color: "bg-purple-100 border-purple-300" },
    { id: "Closed Won", name: "Closed Won", color: "bg-green-100 border-green-300" },
    { id: "Closed Lost", name: "Closed Lost", color: "bg-red-100 border-red-300" }
  ]

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage)
  }

  const getStageTotal = (stage) => {
    const stageDeals = getDealsByStage(stage)
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0)
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e, stage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    dragOverStage.current = stage
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      dragOverStage.current = null
    }
  }

  const handleDrop = (e, newStage) => {
    e.preventDefault()
    if (draggedDeal && draggedDeal.stage !== newStage) {
      onDragEnd?.(draggedDeal.Id, newStage)
    }
    setDraggedDeal(null)
    dragOverStage.current = null
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.id)
        const stageTotal = getStageTotal(stage.id)
        const isDragOver = dragOverStage.current === stage.id

        return (
          <div
            key={stage.id}
            className={`min-w-[300px] bg-gray-50 rounded-xl p-4 border-2 border-dashed transition-all duration-200 ${
              isDragOver ? stage.color : "border-gray-200"
            }`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Stage Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                <p className="text-sm text-gray-600">
                  {stageDeals.length} deal{stageDeals.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(stageTotal)}</p>
              </div>
            </div>

            {/* Add Deal Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddDeal?.(stage.id)}
              className="w-full mb-4 border-2 border-dashed border-gray-300 hover:border-primary hover:text-primary"
            >
              <ApperIcon name="Plus" size={16} />
              Add Deal
            </Button>

            {/* Deal Cards */}
            <div className="space-y-3">
              {stageDeals.map((deal) => (
                <div
                  key={deal.Id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal)}
                  onClick={() => onEditDeal?.(deal)}
                >
                  <DealCard
                    deal={deal}
                    contacts={contacts}
                    onEdit={onEditDeal}
                    onDelete={onDeleteDeal}
                    isDragging={draggedDeal?.Id === deal.Id}
                  />
                </div>
              ))}
              
              {stageDeals.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <ApperIcon name="Package" size={24} className="mx-auto mb-2 text-gray-300" />
                  No deals in this stage
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DealPipeline