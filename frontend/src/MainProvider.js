import React, { useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./route/index";

function MainProvider() {
  // ✅ Define the required states and functions
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
    <RouterProvider
      router={router({
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
      })}
    />
  );
}

export default MainProvider;
