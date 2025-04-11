import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../style/Components/AdminDashboard/IndivisualComponents/newProfiles.css";

function NewProfilesUpdated({ onClick }) { 
  const [data1, setData1] = useState([]);
  const [result, setResult] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";


  useEffect(() => {
    const fetchNewProfiles = async () => {
      try {
        
        const removedDataResponse = await axios.get(`${API_URL}/api/removedProfiles`);
        // const removedDataResponse = await axios.get("http://localhost:3001/api/removedProfiles");

        setResult(removedDataResponse.data)

        if (removedDataResponse.status === 200) {
          const allData = removedDataResponse.data; 
          setData1(allData);
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchNewProfiles();
  }, []);

  const tableHeaders = [
    "S. No.", "Name", "Organization", "Address Line 1", "Address Line 2", 
    "City", "State", "Country", "Zipcode", "Phone Number", "Reg Code", 
    "Attorney",
  ];

  return (
    <div className="newprofileUpdated">
      <div className="comecentre">
        <button className="close-btn" onClick={onClick}>X</button>
        <h2>Removed Profiles [{result.length}]</h2>
        <div className="profile-table-container">
          <table className="profile-table">
            <thead>
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data1.length > 0 ? (
                data1.map((profile, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{profile.name}</td>
                    <td>{profile.organization}</td>
                    <td>{profile.addressLine1}</td>
                    <td>{profile.addressLine2}</td>
                    <td>{profile.city}</td>
                    <td>{profile.state}</td>
                    <td>{profile.country}</td>
                    <td>{profile.zipcode}</td>
                    <td>{profile.phoneNumber}</td>
                    <td>{profile.regCode}</td>
                    <td>{profile.agentAttorney}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="no-data">No profiles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default NewProfilesUpdated;
