import { Routes, Route, Navigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import DashboardLayout from './pages/DashboardLayout'
import DashboardOverview from './pages/DashboardOverview'
import VaultItems from './pages/VaultItems'
import ActivityLogPage from './pages/ActivityLogPage'
import SettingsPage from './pages/SettingsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: 'var(--bg-void)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="items" element={<VaultItems title="All Items" />} />
        <Route
          path="notes"
          element={<VaultItems typeFilter="note" title="Notes" />}
        />
        <Route
          path="urls"
          element={<VaultItems typeFilter="url" title="URLs" />}
        />
        <Route
          path="snippets"
          element={<VaultItems typeFilter="snippet" title="Code Snippets" />}
        />
        <Route
          path="prompts"
          element={<VaultItems typeFilter="prompt" title="AI Prompts" />}
        />
        <Route
          path="media"
          element={<VaultItems typeFilter="media" title="Media" />}
        />
        <Route path="activity" element={<ActivityLogPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
