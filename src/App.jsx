import { lazy, Suspense, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminBar from './components/AdminBar'
import Home from './pages/Home'
import About from './pages/About'
import Project from './pages/Project'
import ProjectDetail from './pages/ProjectDetail'
import CreativeDesign from './pages/projects/CreativeDesign'
import Multimedia from './pages/projects/Multimedia'
import ITSolution from './pages/projects/ITSolution'
import WebDevelopment from './pages/projects/WebDevelopment'
import CCTVSpecialist from './pages/projects/CCTVSpecialist'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Toaster from './components/ui/sonner'
import LoadingScreen from './components/admin/loading-screen'

// ———— Area Admin (di-lazy-load supaya bundle publik tetap ringan) ————
const AdminLayout = lazy(() => import('./components/admin/admin-layout'))
const AdminGuard = lazy(() => import('./components/admin/admin-guard'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminProjects = lazy(() => import('./pages/admin/Projects'))
const AdminContent = lazy(() => import('./pages/admin/Content'))
const AdminMessages = lazy(() => import('./pages/admin/Messages'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))
const AdminAuditLog = lazy(() => import('./pages/admin/AuditLog'))

function AdminSuspense({ children }) {
  return (
    <Suspense fallback={<LoadingScreen message="Memuat Admin Panel..." />}>
      {children}
    </Suspense>
  )
}

/** Pasang kelas `admin-scope` + `dark` di <body> selama rute /admin/* aktif. */
function AdminScope() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    document.body.classList.toggle('admin-scope', isAdmin)
    document.body.classList.toggle('dark', isAdmin)
  }, [isAdmin])

  return null
}

export default function App() {
  return (
    <Router>
      <AdminScope />
      <Toaster />

      <Routes>
        {/* ───────────── Area Admin (terlindungi) ───────────── */}
        <Route path="/admin">
          {/* Login admin — halaman terpisah, di luar guard */}
          <Route
            path="login"
            element={
              <AdminSuspense>
                <AdminLogin />
              </AdminSuspense>
            }
          />

          {/* /admin & semua sub-halaman admin dilindungi guard */}
          <Route
            element={
              <AdminSuspense>
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              </AdminSuspense>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="audit-log" element={<AdminAuditLog />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

        {/* ───────────── Website publik (dengan Navbar) ───────────── */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <AdminBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/project" element={<Project />} />
                <Route path="/project/creative-design" element={<CreativeDesign />} />
                <Route path="/project/multimedia" element={<Multimedia />} />
                <Route path="/project/it-solution" element={<ITSolution />} />
                <Route path="/project/web-development" element={<WebDevelopment />} />
                <Route path="/project/cctv-specialist" element={<CCTVSpecialist />} />
                <Route path="/project/:slug" element={<ProjectDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  )
}