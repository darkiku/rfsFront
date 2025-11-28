import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Services from './pages/Services'
import Procurements from './pages/Procurements'
import Contacts from './pages/Contacts'
import About from './pages/About'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import NewsManager from './admin/NewsManager'
import ServicesManager from './admin/ServicesManager'
import ProcurementsManager from './admin/ProcurementManager'
import AboutManager from './admin/AboutManager'
import ContactsManager from './admin/ContactsManager'
import UsersManager from './admin/UsersManager'
import AuditLogs from './admin/AuditLogs'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="news/:type/:id" element={<NewsDetail />} />
          <Route path="news/:type" element={<News />} />
          <Route path="news" element={<News />} />
          <Route path="services" element={<Services />} />
          <Route path="procurements" element={<Procurements />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="about/:section?" element={<About />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          
          {/* Новости - только для ADMIN и NEWS_MANAGER */}
          <Route 
            path="news" 
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'NEWS_MANAGER']}>
                <NewsManager />
              </ProtectedRoute>
            } 
          />
          
          {/* Сервисы - только для ADMIN и SERVICES_MANAGER */}
          <Route 
            path="services" 
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'SERVICES_MANAGER']}>
                <ServicesManager />
              </ProtectedRoute>
            } 
          />
          
          {/* Закупки - только для ADMIN и PROCUREMENT_MANAGER */}
          <Route 
            path="procurements" 
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_MANAGER']}>
                <ProcurementsManager />
              </ProtectedRoute>
            } 
          />
          
          {/* О предприятии - только для ADMIN и ABOUT_MANAGER */}
          <Route 
            path="about" 
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'ABOUT_MANAGER']}>
                <AboutManager />
              </ProtectedRoute>
            } 
          />
          
          {/* Контакты - только для ADMIN и CONTACTS_MANAGER */}
          <Route 
            path="contacts" 
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'CONTACTS_MANAGER']}>
                <ContactsManager />
              </ProtectedRoute>
            } 
          />
          
          {/* Пользователи - только для ADMIN и HR_MANAGER */}
          <Route 
            path="users" 
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'HR_MANAGER']}>
                <UsersManager />
              </ProtectedRoute>
            } 
          />
          
          {/* Аудит - только для ADMIN */}
          <Route 
            path="audit" 
            element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <AuditLogs />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App