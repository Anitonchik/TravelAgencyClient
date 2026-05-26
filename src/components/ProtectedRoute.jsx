import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  if (!userId || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}