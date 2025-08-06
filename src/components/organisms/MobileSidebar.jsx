import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Deals", href: "/deals", icon: "Target" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Activities", href: "/activities", icon: "Activity" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:hidden transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FlowDesk</h1>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <ApperIcon name="X" size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50",
                  isActive 
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20" 
                    : "text-gray-700 hover:text-gray-900"
                )
              }
            >
              <ApperIcon name={item.icon} size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  )
}

export default MobileSidebar