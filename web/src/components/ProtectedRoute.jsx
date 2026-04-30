import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('transport_token');
  const user = JSON.parse(localStorage.getItem('transport_user') || 'null');

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
