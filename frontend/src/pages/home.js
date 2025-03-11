import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/pages/home.css';
import 'font-awesome/css/font-awesome.min.css';
import { motion } from "framer-motion";


function HomePage2() {
const navigate = useNavigate();
const[label, setlabel] = useState('');

useEffect(() => {
  document.title = "Login "; 
}, []);

function loginSubmit(){
  console.log(label);

  if (label === 'Admin')
  {
    navigate('/AdminLoginPage');
  }
  else{
        navigate('/EmployeeLoginPage');
  }

}

  return (
    <div className="App2">
     
      <main>
      <motion.div
        className="hero-content2"
        initial={{ opacity: 0, scale: 1}}
        animate={{ opacity: 1, scale: 1}}
        transition={{ duration: 1 }}
        >
        <div id='div11'>
          <h1>US Patent Attorney Roster Data</h1>
        </div>
          <div id='div22'>
            <h3>User Type</h3>
                <label >
                      <input type='radio' name='value' value='Admin' 
                          onChange={(e) => setlabel(e.target.value)} />Admin
                     
                
                      <input type='radio' name='value' value='Employee' 
                         onChange={(e) => setlabel(e.target.value)} />Patent Data Analyst
                
                
                      <input type='radio' name='value' value='newUser' 
                          onChange={(e) => setlabel(e.target.value)} />New User
                </label>
                  

         <br />

            <button id='logBtnn71' type="submit" onClick={loginSubmit}>Login</button>
          </div>
          </motion.div>
      </main>

      
    </div>
  );
}

export default HomePage2;