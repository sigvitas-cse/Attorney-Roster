import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/pages/newUserLoginPage.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import { motion } from "framer-motion";

function NewUserLoginPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  console.log('pass:',password);
  console.log('repass:',rePassword);

  

  const navigate = useNavigate();

  useEffect(() => {
      document.title = "Rigister"; 
    }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (password !== rePassword) {
      alert('Password must be the same');
      return;
    }
    
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert('Please enter a valid email address!');
      return;
    }
    const API_URL = process.env.REACT_APP_API_URL;
  
    setLoading(true);
  
    try {
      // const response = await axios.post(`${API_URL}/api/save-new-employee-details`,{ 
      const response = await axios.post('http://localhost:3001/api/save-new-employee-details', { 
        firstName, lastName, email, contact, password, userType: 'employee' 
      });
  
      if (response.status === 200) {
        const { user } = response.data; // Assuming user is returned as part of the response
        if (user) {
          console.log('User saved:', user);
          localStorage.setItem('authToken', response.data.token); // If token exists
          localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage
  
          alert(`Welcome, ${user.firstName} ${user.lastName}`);
          navigate('/');

          // navigate('/AdminDashboard');
        } else {
          alert('Error: User data not found.');
        }
      } else {
        alert('Failed to save user data.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred while saving the user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  function gohome() {
    navigate('/HomePage');
  }
  function goBack() {
    navigate('/HomePage');
  }


  return (
    <div className="App1233">
      <motion.div
            // className="hero-content"
            initial={{ opacity: 0, scale: 0.8}}
            animate={{ opacity: 1, scale: 1}}
            transition={{ duration: 1 }}
          >

      <main id='main1233'>
        <h3>New User Login</h3>
        <form onSubmit={handleLogin}>
          
          <div id="div1233">
          <input
          required
              type="text"
              // className="inputform1234"
              placeholder="First Name"
              minLength={5}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
            required
              type="text"
              // className="inputform1234"
              placeholder="Last Name"
              // minLength={8}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
            required
              type="text"
              // className="inputform1234"
              placeholder="e-mail Id"
              minLength={8}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
            required
              type="text"
              // className="inputform1234"
              placeholder="Contact Number"
              minLength={10}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
             
            {/* <input
              type="text"
              placeholder="Set User Id"
              minLength={8}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <br /> */}
            <div style={{ position: 'relative' }} >
              <input id='in123'
              required
                type={showPassword ? 'text' : 'password'}
                className="inputform1234"  
                placeholder="Set Password"
                minLength={5}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2rem' }} // Create space for the icon
              />
              <span id='toggle1233'
                onClick={togglePasswordVisibility}
                className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}

                
              />
            </div>
            <div style={{ position: 'relative' }}>
              <input id='in123'
              required
                type={showPassword ? 'text' : 'password'}
                className="inputform1234"
                placeholder="Re-Enter Password"
                minLength={5}
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                style={{ paddingRight: '2rem' }} // Create space for the icon
              />
              <span id='toggle1233'
                onClick={togglePasswordVisibility}
                className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}

                
              />
            </div>
            <br />
            <button className='button1233 button12333' type="submit" disabled={loading}>
              {loading ? 'Rigister...' : 'Rigister'}
            </button>
          </div>
        </form>
      </main>
      </motion.div>
    </div>
  );
}

export default NewUserLoginPage;