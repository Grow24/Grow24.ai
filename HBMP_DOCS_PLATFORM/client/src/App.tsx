import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from './pages/Login/LoginPage';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProjectDashboardPage from './pages/ProjectDashboard/ProjectDashboardPage';
import DocumentEditorPage from './pages/DocumentEditor/DocumentEditorPage';
import AppShell from './components/layout/AppShell';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      // Add error handling to prevent unhandled promise rejections
      onError: (error: any) => {
        console.error('Query error:', error);
        // Prevent the error from being thrown as unhandled
      },
    },
    mutations: {
      // Add error handling for mutations to prevent unhandled promise rejections
      onError: (error: any) => {
        console.error('Mutation error:', error);
        // Prevent the error from being thrown as unhandled
      },
      retry: false,
    },
  },
});

// Simple auth check (fake for v1)
const isAuthenticated = () => {
  return localStorage.getItem('hbmp_user') !== null;
};

function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDashboardPage />} />
            <Route
              path="/projects/:projectId/dockets/:docketId/documents/:documentId"
              element={<DocumentEditorPage />}
            />
            <Route path="/" element={<Navigate to="/projects" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

