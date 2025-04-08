import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../style/Components/AdminDashboard/IndivisualComponents/newProfiles.css";

function NewProfilesUpdated({ onClick }) {
  const [matchingProfiles, setMatchingProfiles] = useState([]);
  const [result, setResult] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";


  useEffect(() => {
    const fetchNewProfiles = async () => {
      try {
        const allDataResponse = await axios.get(`${API_URL}/api/fetchAllDataToCompare`);
        // const allDataResponse = await axios.get("http://localhost:3001/api/fetchAllDataToCompare");

        const newProfilesResponse = await axios.get(`${API_URL}/api/newlyAddedProfiles`);
        // const newProfilesResponse = await axios.get("http://localhost:3001/api/newlyAddedProfiles");


        setResult(newProfilesResponse.data)

        if (allDataResponse.status === 200 && newProfilesResponse.status === 200) {
          const allData = allDataResponse.data; 
          const newProfiles = newProfilesResponse.data; 

          const newProfileRegCodes = newProfiles.map(profile => profile.regCode);

          const matchedProfiles = allData.filter(profile => newProfileRegCodes.includes(profile.regCode));

          setMatchingProfiles(matchedProfiles);
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
    "Attorney", "Date of Patent", "Agent Licensed", "Firm or Organization", 
    "Updated Phone Number", "Email Address", "Updated Organization/Law Firm Name", 
    "Firm/Organization URL", "Updated Address", "Updated City", "Updated State", 
    "Updated Country", "Updated Zipcode", "LinkedIn Profile URL", "Notes", 
    "Initials", "Data Updated as on"
  ];

  return (
    <div className="newprofileUpdated">
      <div className="comecentre">
        <button className="close-btn" onClick={onClick}>X</button>
        <h2>New Profiles [{result.length}]</h2>
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
              {matchingProfiles.length > 0 ? (
                matchingProfiles.map((profile, index) => (
                  <tr key={index}>
                    <td>{profile.slNo}</td>
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
                    <td>{profile.dateOfPatent}</td>
                    <td>{profile.agentLicensed}</td>
                    <td>{profile.firmOrOrganization}</td>
                    <td>{profile.updatedPhoneNumber}</td>
                    <td>{profile.emailAddress}</td>
                    <td>{profile.updatedOrganization}</td>
                    <td><a href={profile.firmUrl} target="_blank" rel="noopener noreferrer">{profile.firmUrl}</a></td>
                    <td>{profile.updatedAddress}</td>
                    <td>{profile.updatedCity}</td>
                    <td>{profile.updatedState}</td>
                    <td>{profile.updatedCountry}</td>
                    <td>{profile.updatedZipcode}</td>
                    <td><a href={profile.linkedInProfile} target="_blank" rel="noopener noreferrer">{profile.linkedInProfile}</a></td>
                    <td>{profile.notes}</td>
                    <td>{profile.initials}</td>
                    <td>{profile.dataUpdatedAsOn}</td>
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
