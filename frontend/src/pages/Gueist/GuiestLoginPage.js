import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '../../style/pages/GUIEST/GuiestLoginPage.css';

function LoginPage() {
  const { email, setEmail, handleLogin } = useOutletContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    setEmail('');
    setPassword('');

    const disableActions = (e) => e.preventDefault();
    document.addEventListener('contextmenu', disableActions);
    document.addEventListener('selectstart', disableActions);
    document.addEventListener('copy', disableActions);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screenshots are disabled.');
      }
    });
    return () => {
      document.removeEventListener('contextmenu', disableActions);
      document.removeEventListener('selectstart', disableActions);
      document.removeEventListener('copy', disableActions);
    };
  }, [setEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    console.log('Login attempt with:', { email, password });
    setIsLoading(true);
    setError('');
  const API_URL = process.env.REACT_APP_API_URL || 'https://roster1.sigvitas.com';
  // const API_URL = 'http://localhost:3001';


    try {
      const response = await fetch(`${API_URL}/api/guiestlogin`, {
      // const response = await fetch('http://localhost:3001/api/guiestlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('Login response:', data);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        handleLogin();
        console.log('Navigating to /guistdatatable');
        navigate('/guistdatatable', { replace: true });
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page94">
      <div className="login-container94">
        <h2>Roster Data Access</h2>
        <form onSubmit={handleSubmit} aria-label="Login form">
          <div className="form-group94">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper94">
              <svg className="input-icon94" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                id="email"
                type="email"
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className={error && !email ? 'input-error94' : ''}
                aria-describedby={error && !email ? 'email-error' : undefined}
              />
            </div>
          </div>
          <div className="form-group94">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper94">
              <svg className="input-icon94" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m0 0c0 1.1.9 2 2 2s2-.9 2-2-2-4-2-4m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className={error && !password ? 'input-error94' : ''}
                aria-describedby={error && !password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="show-password94"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m4.934.757A6 6 0 0112 7c1.757 0 3.172 1.143 3.743 2.707m3.135 3.086A9.97 9.97 0 0121.457 12c-1.275 4.057-5.065 7-9.457 7m-6-7h12"
                    />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="error-alert94" role="alert">
              {error}
            </div>
          )}
          <button type="submit" disabled={isLoading} className="login-button94" aria-label="Login">
            {isLoading ? (
              <div className="loading94">
                <div className="spinner94"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;