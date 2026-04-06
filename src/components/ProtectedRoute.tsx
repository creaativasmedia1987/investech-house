import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redireciona para a página de login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
