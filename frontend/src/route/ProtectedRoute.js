import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }
    // Validate token with backend
    fetch('http://localhost:3001/api/validate-token', {
      method: 'POST',
      headers: {
        'x-auth-token': token,
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsValid(true);
        } else {
          localStorage.removeItem('token');
          setIsValid(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsValid(false);
      });
  }, [token]);

  if (isValid === null) return <div>Loading...</div>;
  if (!isValid) {
    console.log('Invalid or no token, redirecting to /guistlogin');
    return <Navigate to="/guistlogin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;