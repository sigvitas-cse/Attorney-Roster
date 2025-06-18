import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

export const OutletContext = React.createContext();

function App() {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [activeCard, setActiveCard] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleDeleteAlert = () => {
    console.log('Delete Alert Triggered');
  };

  const handleLogin = () => {
    console.log('Login Function Called');
  };

  const handleCardClick = (card) => {
    setActiveCard(card);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <OutletContext.Provider
      value={{
        users,
        setUsers,
        allData,
        setAllData,
        filteredData,
        setFilteredData,
        handleFilterChange,
        filters,
        handleDeleteAlert,
        handleLogin,
        handleCardClick,
        activeCard,
        showForm,
        toggleForm,
        loading,
        email,
        setEmail,
      }}
    >
      {location.pathname !== '/' && <Header />}
      <main>
        <Outlet />
      </main>
      {['/', '/AdminLoginPage', '/EmployeeLoginPage', '/NewUserLoginPage', '/ForgotPassword'].includes(location.pathname) && <Footer />}
    </OutletContext.Provider>
  );
}

export default App;