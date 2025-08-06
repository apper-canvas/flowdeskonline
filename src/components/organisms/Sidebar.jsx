import { NavLink, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = () => {
  const location = useLocation()

  const navigation = [
    {
      name: "Deals",
      href: "/deals",
      icon: "Target",
      current: location.pathname === "/" || location.pathname === "/deals"
    },
    {
      name: "Contacts",
      href: "/contacts",
      icon: "Users",
      current: location.pathname === "/contacts"
    },
    {
      name: "Activities",
      href: "/activities", 
      icon: "Activity",
      current: location.pathname === "/activities"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "Settings",
      current: location.pathname === "/settings"
    }
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">FlowDesk</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          FlowDesk CRM v1.0
        </div>
      </div>
    </div>
  )
}

export default Sidebar