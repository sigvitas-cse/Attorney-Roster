import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.log('ProtectedRoute: No token found');
        setIsAuthenticated(false);
        return;
      }
  const API_URL = process.env.REACT_APP_API_URL || 'https://roster1.sigvitas.com';

      try {
      const response = await fetch(`${API_URL}/api/verify-token`, {
        // const response = await fetch('http://localhost:3001/api/verify-token', {
          method: 'GET',
          headers: {
            'x-auth-token': token,
          },
        });
        const data = await response.json();
        console.log('ProtectedRoute: Verify response', data); // Debug log
        if (response.ok && data.message === 'Token valid') {
          console.log('ProtectedRoute: Token valid');
          setIsAuthenticated(true);
        } else {
          console.log('ProtectedRoute: Token invalid');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('ProtectedRoute: Token verification error', err);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/guistlogin" replace />;
};

export default ProtectedRoute;