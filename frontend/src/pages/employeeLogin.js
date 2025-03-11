import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/pages/employeeLogin.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import { motion } from "framer-motion";

function EmpLoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const userType = 'employee';
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);

useEffect(() => {
    document.title = "Patent Data Analyst Login"; 
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      alert('Please enter both User ID and Password');
      return;
    }

    setLoading(true);  

    // const API_URL = process.env.REACT_APP_API_URL;
  const API_URL = process.env.REACT_APP_API_URL || 'https://roster1.sigvitas.com';


    try {
      const response = await axios.post(`${API_URL}/api/check-login`, { userId, password, userType });
      // const response = await axios.post('http://localhost:3001/api/check-login', { userId, password, userType });
      
      if (response.status === 200) {
        alert('Login successful!');
        navigate('/EmployeeDashBoard', { state:{ userId }}); 
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred while logging in. Please try again later.');
    } finally {
      setLoading(false);
    }

  };
  
  function gohome() {
    navigate('/');
  }
  function forgotPass() {
    navigate('/ForgotPassword');
  }
  
  return (
   <div className="App1122">
         
         <main id='main1122'>
         <h3>Patent Data Analyst</h3>
           <form onSubmit={handleLogin}>
             <div id="div1122" className='form-cover'>
               <input
                 type="text"
                 placeholder="Enter User ID"
                 value={userId}
                 onChange={(e) => setUserId(e.target.value)}
               />
               <br />
               <div style={{ position: 'relative' }} >
                 <input id='in1122'
                   type={showPassword ? 'text' : 'password'}
                   placeholder="Enter Password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   style={{ paddingRight: '2rem' }} // Create space for the icon
                 />
                 <span id='toggle1122'
                   onClick={togglePasswordVisibility}
                   className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
   
                 />
               </div>
                 <p className='forgot-password' onClick={forgotPass}>forgot password?</p>
               <br />
               <button className='button1122 button11223' type="submit" disabled={loading}>
                 {loading ? 'Logging in...' : 'Log in'}
               </button>
             </div>
           </form>
         </main>
         
       </div>
  );
}

export default EmpLoginPage;