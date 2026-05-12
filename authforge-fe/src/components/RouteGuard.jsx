import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-full" style={{ minHeight: '100vh' }}>
      <div className="loading-spinner" />
      <span>Loading...</span>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-full" style={{ minHeight: '100vh' }}>
      <div className="loading-spinner" />
    </div>
  );
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
