import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/pages/adminDashboard.css';
import AttorneyRoster from '../components/AdminDashBoard/AttorneyRoster';
import Users from '../components/AdminDashBoard/UsersTable';
import AddUserForm from '../components/AdminDashBoard/AddUserForm.js';
import Analysis from '../components/AdminDashBoard/Analysis.js';

function AdminDashboard() {
  const [activeCard, setActiveCard] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    setActiveCard((prevCard) => (prevCard === card ? null : card));
  };

  return (
    <div className="App1234">
      <main id="main1234">
        {/* Header Section */}
        <section className="heroAdmin1234">
          <h1>Dashboard</h1>
        </section>

        {/* Navigation Cards Section */}
        <section className="content1234">
          <div className="grid">
            <div className={`card ${activeCard === 'users' ? 'active' : ''}`} 
                 onClick={() => handleCardClick('users')}>
              <i className="fa-solid fa-users"></i>
              <h3>Users</h3>
            </div>

            <div className={`card ${activeCard === 'patentData' ? 'active' : ''}`} 
                 onClick={() => handleCardClick('patentData')}>
              <i className="fas fa-cloud"></i>
              <h3>Attorney Roster</h3>
            </div>

            <div className={`card ${activeCard === 'analysis' ? 'active' : ''}`} 
                 onClick={() => handleCardClick("analysis")}>
              <i className="fa-solid fa-chart-simple"></i>
              <h3>Analysis</h3>
            </div>

            <div className={`card ${activeCard === 'addUserForm' ? 'active' : ''}`} 
                 onClick={() => handleCardClick("addUserForm")}>
              <i className="fa-solid fa-user-plus"></i>
              <h3>Add User</h3>
            </div>
          </div>
        </section>

        {/* Dynamic Component Section */}
        <section className="component-display">
          {activeCard === 'users' && <Users />}
          {activeCard === 'patentData' && <AttorneyRoster />}
          {activeCard === 'analysis' && <Analysis />}
          {activeCard === 'addUserForm' && <AddUserForm />}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
