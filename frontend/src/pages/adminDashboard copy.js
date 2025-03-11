import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilter } from "react-icons/fa";
import '../style/pages/adminDashboard.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import { motion } from "framer-motion";
import 'handsontable/dist/handsontable.full.css';
import qs from 'qs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";


function AdminDashboard() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [patentData, setPatentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState(patentData);
  const [filters, setFilters] = useState({});
  const [activeCard, setActiveCard] = useState(null); // State to track the active card
  const [manipulatedData, setManipulatedData] = useState([]); // State to track manipulated data
  const [height, setHeight] = useState('50vh'); // Initial height is 50vh
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [activeCountry, setActiveCountry] = useState(null);
  const [stateCounts, setStateCounts] = useState([]);

  const handleCountryClick = (country) => {
    if (activeCountry === country) {
      setActiveCountry(null); // Hide the chart if the same country is clicked again
      setStateCounts([]);
    } else {
      setActiveCountry(country);
      generateStateCounts(country);
    }
  };

  // Function to generate state-wise data count
  const generateStateCounts = (selectedCountry) => {
    const filteredData = allData.filter((data) => data.country === selectedCountry);

    const stateData = filteredData.reduce((acc, curr) => {
      acc[curr.state] = (acc[curr.state] || 0) + 1;
      return acc;
    }, {});

    // Convert state-wise data into an array for the chart
    const chartData = Object.keys(stateData).map((state) => ({
      state,
      count: stateData[state],
    }));

    setStateCounts(chartData);
  };

  useEffect(() => {
    document.title = "Admin Dashboard"; 
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter email!');
      return;
    }
    setLoading(true);
    try {
      // const response = await axios.post(`${API_URL}/api/save-employee-details`, { name, userId, email, userType: 'employee' });
      const response = await axios.post('http://localhost:3001/api/save-employee-details', { email});

        
        const { user } = response.data; // Assuming user is returned as part of the response
        
  

      alert(`${userId} added successfully.`);
      setUsers([...users, { userId, name }]);
      setName('');
      setUserId('');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // Displays 'User ID already exists...' error
      } else {
        console.error('Error:', err);
        alert('An error occurred while adding the user. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleUsers = async () => {
    if (!users.length) {
      try {
        // const response = await axios.get(`${API_URL}/api/all-users`);

        const response = await axios.get('http://localhost:3001/api/all-users');
        if (response.status === 200) {
          setUsers(response.data.data);
        } else {
          alert('Failed to fetch users.');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        alert('An error occurred while fetching users. Please try again later.');
      }
    }
  };

//   const togglePatentData = async () => {
//     if (!patentData.length) {
//       try {
//         const response = await axios.get('http://localhost:3001/api/all-users-data');
// // 
//         // const response = await axios.get(`${API_URL}/api/all-users-data`);
//         if (response.status === 200) {
//           setPatentData(response.data.data);
//         } else {
//           alert('Failed to fetch patent data.');
//         }
//       } catch (err) {
//         console.error('Error fetching patent data:', err);
//         alert('An error occurred while fetching patent data. Please try again later.');
//       }
//     }
//   };
  
const togglePatentDataForManipulation = async () => {
    if (!patentData.length) {
      try {
        const response = await axios.get('http://localhost:3001/api/all-users-data');
        // const response = await axios.get(`${API_URL}/api/all-users-data`);

        if (response.status === 200) {
          setPatentData(response.data.data);
        } else {
          alert('Failed to fetch patent data.');
        }
      } catch (err) {
        console.error('Error fetching patent data:', err);
        alert('An error occurred while fetching patent data. Please try again later.');
      }
    }
  };
  // const manipulateData = () => {
  //   // Assuming you want to manipulate patent data (or users' data) here
  //   const manipulated = patentData.map(item => ({
  //     ...item,
  //     name: item.name.toUpperCase(), // Example manipulation: converting names to uppercase
  //     updatedPhoneNumber: item.updatedPhoneNumber || 'Not Available', // Default value if phone number is missing
  //   }));
  //   setManipulatedData(manipulated);
  // };
  function gohome() {
    const userConfirmed = window.confirm('Do you want to exit?');
    if (userConfirmed) {
          navigate('/');
    } else {
      console.log('User chose to stay on the page.');
    }
  }
  
  const goBack = () => navigate('/AdminLoginPage');

  const handleCardClick = (card) => {
    if (activeCard === card) {
      setActiveCard(null); // Hide the card if it's already active
    } else {
      setActiveCard(card); // Show the selected card
  
      // Fetch data for Users or Patent Data if not already fetched
      if (card === 'users') {
        toggleUsers(); // Fetch users data if not already fetched
      } else if (card === 'patentData') {
        handleFilterChange(); // Fetch patent data if not already fetched
      }else{
        navigate("/Analysis");
      }
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // const response = await axios.get(`${API_URL}/api/all-users-data`);
        const response = await axios.get(`http://localhost:3001/api/all-users-data`);
        if (response.status === 200) {
          setAllData(response.data.data); // Set all data
          setFilteredData(response.data.data); // Display all data initially
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
  
    fetchAllData();
  }, []);

  const handleFilterChange = async (column, value) => {
    console.log("Column:", column, "Value:", value); // Debugging
  
    if (!value || value.trim() === "") {
      setFilteredData(allData);
      return;
    }
  
    const newFilters = { ...filters, [column]: value.trim() };
    setFilters(newFilters);
  
    const queryString = qs.stringify(newFilters);
    try {
      // const response = await axios.get(`${API_URL}/api/all-users-data-filtering?${queryString}`);
      const response = await axios.get(`http://localhost:3001/api/all-users-data-filtering?${queryString}`);
      if (response.status === 200) {
        setFilteredData(response.data.data); // Update filtered data
      }
    } catch (err) {
      console.error("Error fetching filtered data:", err);
    }
  };
  const dataManipulation = async (column, value) => {
    console.log("Column:", column, "Value:", value); // Debugging
  
    if (!value || value.trim() === "") {
      setFilteredData(allData);
      return;
    }
  
    const newFilters = { ...filters, [column]: value.trim() };
    setFilters(newFilters);
  
    const queryString = qs.stringify(newFilters);
    try {
      // const response = await axios.get(`${API_URL}/api/all-users-data-filtering?${queryString}`);
      const response = await axios.get(`http://localhost:3001/api/all-users-data-filtering?${queryString}`);
      if (response.status === 200) {
        setFilteredData(response.data.data); // Update filtered data
      }
    } catch (err) {
      console.error("Error fetching filtered data:", err);
    }
  };
  
  
  // const toggleHeight = () => {
  //   setHeight(prevHeight => prevHeight === '50vh' ? '20vh' : '50vh');
  // }


  const handleDelete = async (userId) => {
    try {
      setLoading(true);
      
      // URL encode the userId (email in this case)
      const encodedUserId = encodeURIComponent(userId);
      // const response = await axios.get(`${API_URL}/api/delete-user/${encodedUserId}`);
      const response = await axios.delete(`http://localhost:3001/api/delete-user/${encodedUserId}`);
      if (response.status === 200) {
        setUsers(users.filter(user => user.userId !== userId));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error deleting user:", error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };
  const handleDeleteAlert = (userId) => {
    const confirmDelete = window.confirm("Do you want to delete the user permanently?");
    if (confirmDelete) {
      handleDelete(userId);  // Call handleDelete if the user confirms
    }
  }
  return (
    <div className="App1234">
    
      <main id="main1234">
        <section className="heroAdmin1234">
          <h1>Dashboard</h1>
          {/* <p>Delivering innovative and reliable software solutions to help you achieve your business goals.</p> */}
        </section>

        <section className="content1234" style={{ height: height, transition: 'height 0.5s ease' }}>
          {/* <h2>Our Services</h2> */}
          <div className="grid">
            <div className="card" onClick={() => handleCardClick('users')}>
              {/* <i className="fas fa-laptop-code"></i> */}
              <i class="fa-duotone fa-solid fa-users"></i>
              <h3>Users</h3>
              {/* <p>Find all data Users here</p> */}
            </div>
            <div className="card" onClick={() => handleCardClick('patentData')}>
              <i className="fas fa-cloud"></i>
              <h3>Attorney Roster</h3>
              {/* <p>Find all data here</p> */}
            </div>
            <div className="card" onClick={() => handleCardClick('dataManipulation')}>
              {/* <i className="fas fa-tools"></i> */}
              <i class="fa-sharp fa-solid fa-chart-simple"></i>
              <h3>Analysis</h3>
              {/* <p>Manipulate the data in well-formatted manner</p> */}
            </div>

            <div className="card"  onClick={() => toggleForm()}>
                 {/* <i className="fas fa-tools"></i> */}
              <i class="fa-solid fa-user-plus"></i>
              <h3>Add User</h3>
            
                {/* <button className="saveButtondashboard1" onClick={toggleForm}>
                  {showForm ? 'Hide' : 'Add User'}
                </button> */}
              

            </div>

          </div>
        </section>

        {/* Show users data if the 'users' card is active */}
        {activeCard === 'users' && (
          <section className="usersSection cardOneHeight" >
            <h2>All Users</h2>
            <table className="user-table2" style={{background:'white'}}>
              <thead>
                <tr>
                  <th className='makeAuto'>S. No.</th>
                  <th>User ID</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{user.userId}</td>
                    <td>{user.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Show patent data if the 'patentData' card is active */}
        {activeCard === 'patentData' && (
          <section className="patentDataSection">
          <h2>All Patent Data : {allData.length}</h2>
          <div className="table-container">
            <table className="user-table2">
              <thead>
                <tr>
                  {[
                    "S. No.",
                    "Name",
                    "Organization",
                    "Address Line 1",
                    "Address Line 2",
                    "City",
                    "State",
                    "Country",
                    "Zipcode",
                    "Phone Number",
                    "Reg Code",
                    "Attorney",
                    "Date of Patent",
                    "Agent Licensed",
                    "Firm or Organization",
                    "Updated Phone Number",
                    "Email Address",
                    "Updated Organization/Law Firm Name",
                    "Firm/Organization URL",
                    "Updated Address",
                    "Updated City",
                    "Updated State",
                    "Updated Country",
                    "Updated Zipcode",
                    "LinkedIn Profile URL",
                    "Notes",
                    "Initials",
                    "Data Updated as on",
                  ].map((header, index) => (
                    <th key={index} className={index === 0 ? "serial-no-header" : "non-serial-no-header"}>
                    {/* <th key={index}> */}
                      {header}
                      {index !== 0 && (
                        <FaFilter
                          className="filter-icon"
                          onClick={() =>
                            handleFilterChange(
                              header.toLowerCase().replace(/ /g, ""),
                              prompt(`Filter by ${header}:`, filters[header] || "")
                            )
                          }
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((data, index) => (
                   <tr key={index}>
                   <td>{index + 1}</td>
                   <td>{data.name}</td>
                   <td>{data.organization}</td>
                   <td>{data.addressLine1}</td>
                   <td>{data.addressLine2}</td>
                   <td>{data.city}</td>
                   <td>{data.state}</td>
                   <td>{data.country}</td>
                   <td>{data.zipcode}</td>
                   <td>{data.phoneNumber}</td>
                   <td>{data.regCode}</td>
                   <td>{data.agentAttorney}</td>
                   <td>{data.dateOfPatent}</td>
                   <td>{data.agentLicensed}</td>
                   <td>{data.firmOrOrganization}</td>
                   <td>{data.updatedPhoneNumber}</td>
                   <td>{data.emailAddress}</td>
                   <td>{data.updatedOrganization}</td>
                   <td>{data.firmUrl}</td>
                   <td>{data.updatedAddress}</td>
                   <td>{data.updatedCity}</td>
                   <td>{data.updatedState}</td>
                   <td>{data.updatedCountry}</td>
                   <td>{data.updatedZipcode}</td>
                   <td>{data.linkedInProfile}</td>
                   <td>{data.notes}</td>
                   <td>{data.initials}</td>
                   <td>{data.dataUpdatedAsOn}</td>
                 </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        )}

        {/* Show manipulated data if the 'dataManipulation' card is active */}
        {activeCard === 'dataManipulation' && (
          <section className="manipulatedDataSection">
            <h2>Data Analysis</h2>
            <div className="table-container">
              <table className="user-table2">
                <thead>
                  <tr>
                    {[
                      "S. No.",
                      "Name",
                      "Organization",
                      "Address Line 1",
                      "Address Line 2",
                      "City",
                      "State",
                      "Country",
                      "Zipcode",
                      "Phone Number",
                      "Reg Code",
                      "Attorney",
                      "Date of Patent",
                      "Agent Licensed",
                      "Firm or Organization",
                      "Updated Phone Number",
                      "Email Address",
                      "Updated Organization/Law Firm Name",
                      "Firm/Organization URL",
                      "Updated Address",
                      "Updated City",
                      "Updated State",
                      "Updated Country",
                      "Updated Zipcode",
                      "LinkedIn Profile URL",
                      "Notes",
                      "Initials",
                      "Data Updated as on",
                    ].map((header, index) => (
                      <th key={index} className={index === 0 ? "serial-no-header" : "non-serial-no-header"}>
                        {header}
                        {index !== 0 && (
                          <FaFilter
                            className="filter-icon"
                            onClick={() =>
                              handleFilterChange(
                                header.toLowerCase().replace(/ /g, ""),
                                prompt(`Filter by ${header}:`, filters[header] || "")
                              )
                            }
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.name}</td>
                      <td>{data.organization}</td>
                      <td>{data.addressLine1}</td>
                      <td>{data.addressLine2}</td>
                      <td>{data.city}</td>
                      <td>{data.state}</td>
                      <td>{data.country}</td>
                      <td>{data.zipcode}</td>
                      <td>{data.phoneNumber}</td>
                      <td>{data.regCode}</td>
                      <td>{data.agentAttorney}</td>
                      <td>{data.dateOfPatent}</td>
                      <td>{data.agentLicensed}</td>
                      <td>{data.firmOrOrganization}</td>
                      <td>{data.updatedPhoneNumber}</td>
                      <td>{data.emailAddress}</td>
                      <td>{data.updatedOrganization}</td>
                      <td>{data.firmUrl}</td>
                      <td>{data.updatedAddress}</td>
                      <td>{data.updatedCity}</td>
                      <td>{data.updatedState}</td>
                      <td>{data.updatedCountry}</td>
                      <td>{data.updatedZipcode}</td>
                      <td>
                        {data.linkedInProfile ? (
                          <a
                            href={data.linkedInProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "blue", textDecoration: "underline" }}
                          >
                            LinkedIn Profile
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{data.notes}</td>
                      <td>{data.initials}</td>
                      <td>{data.dataUpdatedAsOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        
        {showForm && (
          <div className="split-screen">
          <div className="left-section">
              <div className='makeSectionBorder'><h2>Create User</h2>
              <form className="userForm" onSubmit={handleLogin}>
                {/* <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    placeholder='Enter Name'
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>User ID:</label>
                  <input
                    type="text"
                    value={userId}
                    placeholder='Enter User ID'
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div> */}
                <div>
                  <label>email:</label>
                  <input
                    type="email"
                    value={email}
                    placeholder='Enter Email'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button className='saveButtondashboard1' type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </form>
              </div>
            </div>
    
          <div className="right-section">
            <h2>All Users</h2>
            <table className="user-table2">
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Remove User</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.userId}>
                    <td>{index + 1}</td>
                    <td>{user.userId}</td>
                    <td>{user.name}</td>
                    <td>
                    <button
                  className="removeButton"
                  onClick={() => handleDeleteAlert(user.userId)} // Pass userId to the delete alert
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

       
      </main>

    </div>
  );
}

export default AdminDashboard;