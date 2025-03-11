import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/pages/adminDashboard.css';
import AttorneyRoster from '../components/AdminDashBoard/AttorneyRoster.js';
import Users from '../components/AdminDashBoard/UsersTable.js';
import AddUserForm from '../components/AdminDashBoard/AddUserForm.js';
function AdminDashboard() {
  const [activeCard, setActiveCard] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    setActiveCard(activeCard === card ? null : card);
  };

  return (
    <div className="App1234">
      <main id="main1234">
        <section className="heroAdmin1234">
          <h1>Dashboard</h1>
        </section>
        <section className="content1234">
          <div className="grid">
            <div className="card" onClick={() => handleCardClick('users')}>
              <i className="fa-solid fa-users"></i>
              <h3>Users</h3>
            </div>
            <div className="card" onClick={() => handleCardClick('patentData')}>
              <i className="fas fa-cloud"></i>
              <h3>Attorney Roster</h3>
            </div>
            <div className="card" onClick={() => navigate("/Analysis")}>
              <i className="fa-solid fa-chart-simple"></i>
              <h3>Analysis</h3>
            </div>
          </div>
          <AddUserForm />
        </section>

        {activeCard === 'users' && <Users />}
        {activeCard === 'patentData' && <AttorneyRoster />}
      </main>
    </div>
  );
}

export default AdminDashboard;
