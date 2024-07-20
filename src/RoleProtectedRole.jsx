import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '@/context/UserContext';

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    // Puedes devolver un indicador de carga aquí si es necesario
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/LoginApp" replace />;
  }

  const userRoles = user.roles || [];
  const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));

  return hasAllowedRole ? <Outlet /> : <Navigate to="/auth/LoginApp" replace />;
};

export default RoleProtectedRoute;
