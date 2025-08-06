import { useState, useContext } from "react"
import { Outlet } from "react-router-dom"
import { useSelector } from 'react-redux'
import Sidebar from "@/components/organisms/Sidebar"
import MobileSidebar from "@/components/organisms/MobileSidebar"
import ApperIcon from "@/components/ApperIcon"
import { AuthContext } from "@/App"
import Button from "@/components/atoms/Button"

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ApperIcon name="Menu" size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded flex items-center justify-center">
                  <ApperIcon name="Zap" size={14} className="text-white" />
                </div>
                <span className="font-bold text-gray-900">FlowDesk</span>
</div>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {user.firstName} {user.lastName}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ApperIcon name="LogOut" size={16} />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout