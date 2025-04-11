import React, { useState } from "react";
import axios from "axios";
import "./../style/Components/AdminDashboard/IndivisualComponents/IndivisualProfilesUpdate.css";

function IndivisualProfilesUpdated({ onClick }) {
  const [regCodeInput, setRegCodeInput] = useState("");
  const [matchingProfile, setMatchingProfile] = useState([]);
  const [error, setError] = useState("");
  const [searchField, setSearchField] = useState("regCode");


  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";

  const handleSearch = async () => {
    if (!regCodeInput.trim()) {
      setError("Please enter a register number.");
      setMatchingProfile([]); // ✅ keep as empty array
      return;
    }
    

    try {
      const response = await axios.get(`${API_URL}/api/IndivisualDataFetching`, {
      // const response = await axios.get("http://localhost:3001/api/IndivisualDataFetching", {
        params: {
          field: searchField,
          query: regCodeInput,
        },
      });

      const profiles = response.data;
      console.log("Receive Data:", profiles);
      

      if (Array.isArray(profiles) && profiles.length > 0) {
        setMatchingProfile(profiles);
        setError("");
      } else {
        setMatchingProfile([]);
        setError("No matching profiles found.");
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setMatchingProfile(null);
      setError("Server error occurred.");
    }
  };

  return (
    <div className="indiv-profile-modal">
      <div className="indiv-profile-container">
        <button className="indiv-close-btn" onClick={onClick}>×</button>
        <h2>Search Profile</h2>

        <div className="indiv-search-box">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="regCode">Reg Code</option>
            <option value="name">Name</option>
            <option value="organization">Organization</option>
            <option value="city">City</option>
            {/* Add other options as needed */}
          </select>

          <input
            type="text"
            placeholder={`Enter ${searchField}`}
            value={regCodeInput}
            onChange={(e) => setRegCodeInput(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>


        {error && <p className="indiv-error-message">{error}</p>}

        {matchingProfile.length > 0 && (
          <div className="indiv-profile-table-wrapper">
            <table className="indiv-profile-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Name</th>
                <th>Organization</th>
                <th>Address Line 1</th>
                <th>Address Line 2</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Zipcode</th>
                <th>Phone</th>
                <th>Reg Code</th>
                <th>Attorney</th>
                <th>Date of Patent</th>
                <th>Agent Licensed</th>
                <th>Firm</th>
                <th>Updated Phone</th>
                <th>Email</th>
                <th>Updated Org</th>
                <th>Website</th>
                <th>Updated Address</th>
                <th>Updated City</th>
                <th>Updated State</th>
                <th>Updated Country</th>
                <th>Updated Zipcode</th>
                <th>LinkedIn</th>
                <th>Notes</th>
                <th>Data Updated As On</th>
              </tr>
            </thead>

              <tbody>
                {matchingProfile.map((profile, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td> {/* slNo generated in frontend */}
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
                    <td>
                      <a href={profile.firmUrl} target="_blank" rel="noopener noreferrer">
                        {profile.firmUrl}
                      </a>
                    </td>
                    <td>{profile.updatedAddress}</td>
                    <td>{profile.updatedCity}</td>
                    <td>{profile.updatedState}</td>
                    <td>{profile.updatedCountry}</td>
                    <td>{profile.updatedZipcode}</td>
                    <td>
                      <a href={profile.linkedInProfile} target="_blank" rel="noopener noreferrer">
                        {profile.linkedInProfile}
                      </a>
                    </td>
                    <td>{profile.notes}</td>
                    <td>{profile.dataUpdatedAsOn}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default IndivisualProfilesUpdated;
