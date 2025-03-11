import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./App.css";

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

function App() {
  const location = useLocation();

  // ✅ Define state & functions inside App.js
  const [users, setUsers] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [activeCard, setActiveCard] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleDeleteAlert = () => {
    console.log("Delete Alert Triggered");
  };

  const handleLogin = () => {
    console.log("Login Function Called");
  };

  const handleCardClick = (card) => {
    setActiveCard(card);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      {location.pathname !== "/" && <Header />}
      <main>
        {/* ✅ Pass state as props using Outlet context */}
        <Outlet
          context={{
            users,
            allData,
            filteredData,
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
        />
      </main>
      {["/AdminLoginPage", "/EmployeeLoginPage", "/NewUserLoginPage"].includes(location.pathname) && <Footer />}

    </>
  );
}

export default App;
