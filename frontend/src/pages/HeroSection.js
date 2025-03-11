import React, { useState } from "react";
import { motion } from "framer-motion";
import "../style/pages/HeroSection.css";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const[label, setlabel] = useState('');
    const navigate = useNavigate();
    function gohome(){
        navigate('/AdminLoginPage');
        // const reqLogin = () => {
        //   alert('plese login!');
        // }
      }
      function goNewRigister(){
        navigate('/NewUserLoginPage');
        
      }

      function loginSubmit(){
        console.log(label);
        
      
        if (label === 'Admin')
        {
          navigate('/AdminLoginPage');
        }
        else{
          if(label === 'Employee')
          {
            navigate('/EmployeeLoginPage');
          }
          else{
            alert('Please select user type')
          }
        }
      
      }

  return (
   
    <div id="allone">
    <article className="heroSection203">
    <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2.5 }}
    >
        <div className="logo23">
            <img src="../Triangle-IP-Logo.png" alt="Logo" />
        </div>
    </motion.div>

    <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2.5 }}
    >
        <div className="btnNames23">
            <button onClick={goNewRigister} className="btnNames22">
                <i className="fas fa-sign-in-alt"></i> Sign up
            </button>
        </div>
    </motion.div>
</article>

    
    <div className="heromain1 hero-content">
    <motion.div
      // className="hero-content"
      initial={{ opacity: 0, scale: 0.8}}
      animate={{ opacity: 1, scale: 1}}
      transition={{ duration: 1 }}
    >
      <h1>Welcome to Triangle IP</h1>
      <h3>US Patent Attorney Roster</h3>
      {/* <p onClick=  {gohome} className="pbtn">Explore More >></p>  */}
      <div className="user-typeiselectio-block">
        <h5 className="user-typeiselectio-block-h5">User Type</h5>
                <label className="label-and-input" >
                          <input type='radio' name='value' value='Admin' 
                            onChange={(e) => setlabel(e.target.value)}  />Admin
                          <input type='radio' name='value' value='Employee' 
                            onChange={(e) => setlabel(e.target.value)} />Patent Data Analyst
                </label>
                <button className="label-input-button" type="submit"onClick={loginSubmit} >Log in</button>
      </div>
    </motion.div>
    
    </div>
  </div>
  
  );
};

export default HeroSection;
