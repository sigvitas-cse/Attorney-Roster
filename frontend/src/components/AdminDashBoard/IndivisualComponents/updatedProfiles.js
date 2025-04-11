import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../style/Components/AdminDashboard/IndivisualComponents/newProfiles.css";

function NewProfilesUpdated2({ onClick }) { 
  const [data1, setData1] = useState([]);
  const [result, setResult] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";


  useEffect(() => {
    const fetchNewProfiles = async () => {
      try {
        const updatedProfilesResponse = await axios.get(`${API_URL}/api/updated-profiles`);
        // const updatedProfilesResponse = await axios.get("http://localhost:3001/api/updated-profiles");
        setResult(updatedProfilesResponse.data);

        if (updatedProfilesResponse.status === 200) {
          setData1(updatedProfilesResponse.data);
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchNewProfiles();
  }, []);

  const tableHeaders = [
    "S. No.", "Reg Code", "Name", "Field", "Old Value", "New Value"
  ];

  return (
    <div className="newprofileUpdated">
      <div className="comecentre">
        <button className="close-btn" onClick={onClick}>X</button>
        <h2>Updated Profiles [{result.length}]</h2>
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
                data1.map((profile, profileIndex) =>
                  Object.entries(profile.changes).map(([field, values], fieldIndex) => (
                    <tr key={profile.regCode + field}>
                      {fieldIndex === 0 && (
                        <>
                          <td rowSpan={Object.keys(profile.changes).length}>{profileIndex + 1}</td>
                          <td rowSpan={Object.keys(profile.changes).length}>{profile.regCode}</td>
                          <td rowSpan={Object.keys(profile.changes).length}>{profile.name}</td>
                        </>
                      )}
                      <td>{field}</td>
                      <td>{values.oldValue || "N/A"}</td>
                      <td>{values.newValue || "N/A"}</td>
                    </tr>
                  ))
                )
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

export default NewProfilesUpdated2;
