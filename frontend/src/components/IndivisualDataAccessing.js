import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import "./../style/Components/AdminDashboard/IndivisualComponents/IndivisualProfilesUpdate.css";
import * as XLSX from "xlsx"; // For Excel download
import jsPDF from "jspdf"; // For PDF download
import "jspdf-autotable"; // For table formatting in PDF

function IndivisualProfilesUpdated({ onClick }) {
  const [regCodeInput, setRegCodeInput] = useState("");
  const [matchingProfile, setMatchingProfile] = useState([]);
  const [error, setError] = useState("");
  const [searchField, setSearchField] = useState("regCode");
  const [selectedRows, setSelectedRows] = useState([]); // Track selected profiles
  const [showOptions, setShowOptions] = useState(false); // Show preview/download options
  const [showPreview, setShowPreview] = useState(false); // Preview modal
  const [showFormatModal, setShowFormatModal] = useState(false); // Format selection modal
  const [downloadFormat, setDownloadFormat] = useState(null); // Selected format (excel/pdf)
  const [showLimitWarning, setShowLimitWarning] = useState(false); // Limit warning modal

  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";
  const downloadLimit = 5; // Maximum profiles that can be downloaded at once

  // Mapping of table headers to data keys (similar to AttorneyRoster.jsx)
  const headerMap = {
    "Sl.No": "slNo",
    "Name": "name",
    "Organization": "organization",
    "Address Line 1": "addressLine1",
    "Address Line 2": "addressLine2",
    "City": "city",
    "State": "state",
    "Country": "country",
    "Zipcode": "zipcode",
    "Phone": "phoneNumber",
    "Reg Code": "regCode",
    "Attorney": "agentAttorney",
    "Date of Patent": "dateOfPatent",
    "Agent Licensed": "agentLicensed",
    "Firm": "firmOrOrganization",
    "Updated Phone": "updatedPhoneNumber",
    "Email": "emailAddress",
    "Updated Org": "updatedOrganization",
    "Website": "firmUrl",
    "Updated Address": "updatedAddress",
    "Updated City": "updatedCity",
    "Updated State": "updatedState",
    "Updated Country": "updatedCountry",
    "Updated Zipcode": "updatedZipcode",
    "LinkedIn": "linkedInProfile",
    "Notes": "notes",
    "Data Updated As On": "dataUpdatedAsOn",
    "Download": "download", // New column for checkboxes
  };

  const handleSearch = async () => {
    if (!regCodeInput.trim()) {
      setError("Please enter a register number.");
      setMatchingProfile([]);
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
        setSelectedRows([]); // Reset selected rows on new search
        setShowOptions(false); // Hide options until rows are selected
      } else {
        setMatchingProfile([]);
        setError("No matching profiles found.");
        setSelectedRows([]);
        setShowOptions(false);
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setMatchingProfile(null);
      setError("Server error occurred.");
      setSelectedRows([]);
      setShowOptions(false);
    }
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (regCode) => {
    setSelectedRows((prev) => {
      if (prev.includes(regCode)) {
        const newSelection = prev.filter((id) => id !== regCode);
        setShowOptions(newSelection.length > 0);
        return newSelection;
      } else {
        const newSelection = [...prev, regCode];
        setShowOptions(true);
        return newSelection;
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedRows.length === matchingProfile.length) {
      setSelectedRows([]);
      setShowOptions(false);
    } else {
      const allRegCodes = matchingProfile.map((profile) => profile.regCode);
      setSelectedRows(allRegCodes);
      setShowOptions(true);
    }
  };

  // Handle Preview button click
  const handlePreview = () => {
    // Debug: Log the selected profiles to ensure data is available
    const selectedProfiles = matchingProfile.filter((profile) =>
      selectedRows.includes(profile.regCode)
    );
    console.log("Selected Profiles for Preview:", selectedProfiles);
    setShowPreview(true);
  };

  // Handle Download button click
  const handleDownload = () => {
    if (selectedRows.length > downloadLimit) {
      setShowLimitWarning(true);
    } else {
      setShowFormatModal(true);
    }
  };

  // Download as Excel
  const downloadExcel = (dataToDownload) => {
    const worksheet = XLSX.utils.json_to_sheet(
      dataToDownload.map((row) =>
        Object.keys(headerMap)
          .filter((key) => key !== "Download" && key !== "Sl.No")
          .reduce((obj, key) => {
            obj[key] = row[headerMap[key]] || "";
            return obj;
          }, {})
      )
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IndivisualProfiles");
    XLSX.writeFile(workbook, "IndivisualProfiles.xlsx");
  };

  // Download as PDF
  const downloadPDF = (dataToDownload) => {
    const doc = new jsPDF();
    const tableColumn = Object.keys(headerMap).filter((key) => key !== "Download" && key !== "Sl.No");
    const tableRows = dataToDownload.map((row) =>
      Object.keys(headerMap)
        .filter((key) => key !== "Download" && key !== "Sl.No")
        .map((key) => row[headerMap[key]] || "")
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      margin: { top: 10 },
    });
    doc.save("IndivisualProfiles.pdf");
  };

  // Handle format selection (Excel/PDF)
  const handleFormatSelection = (format) => {
    setDownloadFormat(format);
    setShowFormatModal(false);

    const dataToDownload = matchingProfile
      .filter((profile) => selectedRows.includes(profile.regCode))
      .slice(0, downloadLimit);

    if (format === "excel") {
      downloadExcel(dataToDownload);
    } else if (format === "pdf") {
      downloadPDF(dataToDownload);
    }

    setShowLimitWarning(false);
  };

  // Handle limit warning download
  const handleLimitDownload = () => {
    setShowLimitWarning(false);
    setShowFormatModal(true);
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
          <>
            {/* Download/Preview Options */}
            {showOptions && (
              <div className="indiv-download-options">
                <p>
                  If you want to download more than 5 profiles data then you can contact at{" "}
                  <a href="mailto:support@triangleip.com">support@triangleip.com</a>
                </p>
                <button onClick={handlePreview}>Preview</button>
                <button onClick={handleDownload}>Download</button>
              </div>
            )}

            {/* Preview Modal */}
            {showPreview && (
              <div className="indiv-modal">
                <div className="indiv-modal-content">
                  <FaTimes
                    className="indiv-modal-close-icon"
                    onClick={() => setShowPreview(false)}
                  />
                  <h3>Preview Selected Data (Showing up to {downloadLimit} rows)</h3>
                  <div className="indiv-preview-table-container">
                    <table className="indiv-preview-table">
                      <thead>
                        <tr>
                          {Object.keys(headerMap)
                            .filter((key) => key !== "Download" && key !== "Sl.No")
                            .map((header, index) => (
                              <th key={index}>{header}</th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {matchingProfile
                          .filter((profile) => selectedRows.includes(profile.regCode))
                          .slice(0, downloadLimit)
                          .map((profile, index) => (
                            <tr key={index}>
                              {Object.keys(headerMap)
                                .filter((key) => key !== "Download" && key !== "Sl.No")
                                .map((key, colIndex) => (
                                  <td key={colIndex}>
                                    {["Website", "LinkedIn"].includes(key) && profile[headerMap[key]] ? (
                                      <a
                                        href={profile[headerMap[key]]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {profile[headerMap[key]]}
                                      </a>
                                    ) : (
                                      <span>{profile[headerMap[key]] ?? ""}</span> // Ensure all text is wrapped in a span
                                    )}
                                  </td>
                                ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => setShowPreview(false)}>Close</button>
                </div>
              </div>
            )}

            {/* Format Selection Modal */}
            {showFormatModal && (
              <div className="indiv-modal">
                <div className="indiv-modal-content">
                  <h3>Select Download Format</h3>
                  <button onClick={() => handleFormatSelection("excel")}>Excel</button>
                  <button onClick={() => handleFormatSelection("pdf")}>PDF</button>
                  <button onClick={() => setShowFormatModal(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* Limit Warning Modal */}
            {showLimitWarning && (
              <div className="indiv-modal">
                <div className="indiv-modal-content">
                  <h3>Download Limit Exceeded</h3>
                  <p>
                    You can download only {downloadLimit} rows at a time. If you need to download more, please contact{" "}
                    <a href="mailto:support@triangleip.com">support@triangleip.com</a>.
                  </p>
                  <button onClick={handleLimitDownload}>Download (First {downloadLimit} Rows)</button>
                  <button onClick={() => setShowLimitWarning(false)}>Cancel</button>
                </div>
              </div>
            )}

            <div className="indiv-profile-table-wrapper">
              <table className="indiv-profile-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedRows.length === matchingProfile.length && matchingProfile.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {Object.keys(headerMap)
                      .filter((key) => key !== "Download")
                      .map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {matchingProfile.map((profile, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(profile.regCode)}
                          onChange={() => handleCheckboxChange(profile.regCode)}
                        />
                      </td>
                      <td>{index + 1}</td>
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
          </>
        )}
      </div>
    </div>
  );
}

export default IndivisualProfilesUpdated;