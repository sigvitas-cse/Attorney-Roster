import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../style/pages/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  
  const API_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const requestOtp = async () => {
    setLoading(true);
    setMessage('⏳ Sending OTP...');
    setIsEmailError(false);


    try {
      const res = await axios.post(`${API_URL}/api/request-otp`, { email });
      // const res = await axios.post('http://localhost:3001/api/request-otp', { email });
      setMessage(res.data.message || '✅ OTP sent successfully!');
      setStep(2);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Something went wrong.';
      if (errMsg.toLowerCase().includes('email not registered')) {
        setMessage("🔔 We couldn't find your email. Please ensure it's correct or ");
        setIsEmailError(true);
      } else {
        setMessage(errMsg);
      }
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage('⏳ Verifying OTP...');
    try {
      const res = await axios.post(`${API_URL}/api/verify-otp`, { email, otp });
      // const res = await axios.post('http://localhost:3001/api/verify-otp', { email, otp });
      setMessage(res.data.message || '✅ OTP Verified!');
      setStep(3);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid or expired OTP.';
      setMessage(errorMsg);
      if (errorMsg.toLowerCase().includes('expired')) {
        setShowResend(true);
      }
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('⏳ Resetting password...');
    try {
      const res = await axios.post(`${API_URL}/api/reset-password`, { email, newPassword });
      // const res = await axios.post('http://localhost:3001/api/reset-password', { email, newPassword });
      setMessage(res.data.message || '✅ Password reset successfully!');
      setStep(4);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to reset password.');
    }
    setLoading(false);
  };

  const goToLogin = () => {
    navigate('/EmployeeLoginPage');
  };

  return (
    <div className="forgot-password-container">
      <h2 className="title">🔐 Forgot Password</h2>

      {message && (
        <p className={`message ${isEmailError ? 'error' : ''}`}>
          {message}
          {isEmailError && (
            <Link to="/NewUSerLoginPage" className="register-link">Register Now</Link>
          )}
        </p>
      )}

      {step === 1 && (
        <div className="form-box">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={requestOtp} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Request OTP'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="form-box">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button onClick={verifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {showResend && (
            <button className="resend-btn" onClick={() => {
              requestOtp();
              setShowResend(false);
            }}>
              🔁 Resend OTP
            </button>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="form-box">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button onClick={resetPassword} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="success-box">
          <div className="tick-animation">✅</div>
          <h3>Success!</h3>
          <p>Your password has been reset. You can now login.</p>
          <button onClick={goToLogin}>Go to Login</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
