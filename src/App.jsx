import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import DealsPage from "@/components/pages/DealsPage"
import ContactsPage from "@/components/pages/ContactsPage"
import ActivitiesPage from "@/components/pages/ActivitiesPage"
import SettingsPage from "@/components/pages/SettingsPage"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DealsPage />} />
            <Route path="deals" element={<DealsPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="activities" element={<ActivitiesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App