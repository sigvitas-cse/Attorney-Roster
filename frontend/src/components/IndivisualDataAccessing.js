import React, { useState } from "react";
import axios from "axios";
import "./../style/Components/AdminDashboard/IndivisualComponents/IndivisualProfilesUpdate.css";

function IndivisualProfilesUpdated({ onClick }) {
  const [regCodeInput, setRegCodeInput] = useState("");
  const [matchingProfile, setMatchingProfile] = useState(null);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";

  const handleSearch = async () => {
    if (!regCodeInput.trim()) {
      setError("Please enter a register number.");
      setMatchingProfile(null);
      return;
    }

    try {
      // const response = await axios.get(`${API_URL}/api/IndivisualDataFetching`, {
      const response = await axios.get("http://localhost:3001/api/IndivisualDataFetching",{
        params: { regCode: regCodeInput }
      });

      const profile = response.data;

      if (profile && profile.regCode) {
        setMatchingProfile(profile);
        setError("");
      } else {
        setMatchingProfile(null);
        setError("No data found for this register number.");
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setMatchingProfile(null);
      setError("Server error occurred.");
    }
  };

  return (
    <div className="profile-modal">
      <div className="profile-container">
        <button className="close-btn" onClick={onClick}>×</button>
        <h2>Search Profile</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter Register Number"
            value={regCodeInput}
            onChange={(e) => setRegCodeInput(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {matchingProfile && (
          <div className="profile-card">
            <div className="profile-section">
              <h3>Basic Info</h3>
              <p><strong>Name:</strong> {matchingProfile.name}</p>
              <p><strong>Organization:</strong> {matchingProfile.organization}</p>
              <p><strong>Reg Code:</strong> {matchingProfile.regCode}</p>
              <p><strong>Initials:</strong> {matchingProfile.initials}</p>
            </div>

            <div className="profile-section">
              <h3>Contact Info</h3>
              <p><strong>Phone:</strong> {matchingProfile.phoneNumber}</p>
              <p><strong>Email:</strong> {matchingProfile.emailAddress}</p>
              <p><strong>Address:</strong> {matchingProfile.addressLine1}, {matchingProfile.addressLine2}, {matchingProfile.city}, {matchingProfile.state}, {matchingProfile.country} - {matchingProfile.zipcode}</p>
            </div>

            <div className="profile-section">
              <h3>Patent Details</h3>
              <p><strong>Attorney:</strong> {matchingProfile.agentAttorney}</p>
              <p><strong>Date of Patent:</strong> {matchingProfile.dateOfPatent}</p>
              <p><strong>Agent Licensed:</strong> {matchingProfile.agentLicensed}</p>
              <p><strong>Firm:</strong> {matchingProfile.firmOrOrganization}</p>
            </div>

            <div className="profile-section">
              <h3>Updated Info</h3>
              <p><strong>New Phone:</strong> {matchingProfile.updatedPhoneNumber}</p>
              <p><strong>Updated Org:</strong> {matchingProfile.updatedOrganization}</p>
              <p><strong>Updated Address:</strong> {matchingProfile.updatedAddress}, {matchingProfile.updatedCity}, {matchingProfile.updatedState}, {matchingProfile.updatedCountry} - {matchingProfile.updatedZipcode}</p>
              <p><strong>LinkedIn:</strong> <a href={matchingProfile.linkedInProfile} target="_blank" rel="noopener noreferrer">{matchingProfile.linkedInProfile}</a></p>
              <p><strong>Website:</strong> <a href={matchingProfile.firmUrl} target="_blank" rel="noopener noreferrer">{matchingProfile.firmUrl}</a></p>
              <p><strong>Notes:</strong> {matchingProfile.notes}</p>
              <p><strong>Data Updated As On:</strong> {matchingProfile.dataUpdatedAsOn}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IndivisualProfilesUpdated;
