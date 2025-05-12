import React, { useState, useEffect } from "react";
import "jspdf-autotable";
import axios from "axios";
import "../style/pages/EmployeeDashboard.css";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewProfilesUpdated from "../components/AdminDashBoard/IndivisualComponents/newProfiles";
import RemovedProfiles from "../components/AdminDashBoard/IndivisualComponents/removedProfiles";
import NewProfilesUpdated2 from "../components/AdminDashBoard/IndivisualComponents/updatedProfiles";
import NewUploadExcel from "../components/EmployeeDashboard/NewUploadExcel";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const rowsPerPage = 500;
  const location = useLocation();
  const userId = location.state?.userId;
  const admin = users.length > 0 ? users[0].admin : false;
  const [filter, setFilter] = useState("");
  const [editedUsers, setEditedUsers] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newUploadExcel, setNewUploadExcel] = useState(false);

  useEffect(() => {
    document.title = "Patent Analyst Dashboard";
  }, []);

  const updating = () => {
    setLoading(!loading);
    if (loading) {
      toast.success("Data edited successfully");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";

  const fetchUsers = () => {
    const userId = location.state.userId;
    console.log("UserId being sent to backend:", userId);

    axios
          .get(`${API_URL}/api/fetch-users?userId=${userId}`)
      // .get(`http://localhost:3001/api/fetch-users?userId=${userId}`)
      .then((response) => {
        console.log("Response from backend:", response.data);
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
    setPageInput("");
  };

  const handleEdit = (id, field, value) => {
    setEditedUsers({
      ...editedUsers,
      [id]: {
        ...editedUsers[id],
        [field]: value,
      },
    });
  };

  const handleUpdateAll = async () => {
    const updates = Object.keys(editedUsers)
      .filter((regCode) => Object.keys(editedUsers[regCode]).length > 0)
      .map((regCode) => ({
        regCode,
        ...editedUsers[regCode],
      }));

    if (updates.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    console.log("Sending updates to backend:", updates);

    const batchSize = 500;
    const batches = [];
    for (let i = 0; i < updates.length; i += batchSize) {
      batches.push(updates.slice(i, i + batchSize));
    }

    try {
      for (const batch of batches) {
        await axios.put(`${API_URL}/api/update-users`,batch)
        // await axios.put("http://localhost:3001/api/update-users", batch);
        console.log(`Batch of ${batch.length} users updated successfully`);
      }
      fetchUsers();
      setEditedUsers({});
      toast.success("Data saved successfully");
    } catch (error) {
      console.error("Error updating users:", error);
      toast.error(`Failed to save data: ${error.message || "Unknown error"}`);
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setUsers(users.map((user) => ({ ...user, isChecked })));
  };

  const handleCheckboxChange = (id, isChecked) => {
    setUsers(users.map((user) => (user.regCode === id ? { ...user, isChecked } : user)));
    const allSelected = users.every((user) => (user.regCode === id ? isChecked : user.isChecked));
    setSelectAll(allSelected);
  };

  const showNMessage = () => {
    toast.warn("Not Permitted");
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      const table = e.target.closest("table");
      const rows = table.querySelectorAll("tbody tr");
      const cols = rows[rowIndex].querySelectorAll("td");
      let newRowIndex = rowIndex;
      let newColIndex = colIndex;

      if (e.key === "ArrowUp" && rowIndex > 0) {
        newRowIndex = rowIndex - 1;
      } else if (e.key === "ArrowDown" && rowIndex < rows.length - 1) {
        newRowIndex = rowIndex + 1;
      } else if (e.key === "ArrowLeft" && colIndex > 1) {
        newColIndex = colIndex - 1;
      } else if (e.key === "ArrowRight" && colIndex < cols.length - 2) {
        newColIndex = colIndex + 1;
      }

      const newCell = rows[newRowIndex].querySelectorAll("td")[newColIndex];
      if (newCell && newCell.hasAttribute("contentEditable")) {
        newCell.focus();
      }
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownSelect = (component) => {
    setActiveComponent(component);
    setShowDropdown(false);
  };

  const filteredUsers = users.filter((user) => {
    if (!user) return false;
    const searchableFields = [
      user.name,
      user.organization,
      user.addressLine1,
      user.addressLine2,
      user.city,
      user.state,
      user.country,
      user.zipcode,
      user.phoneNumber,
      user.regCode,
      user.agentAttorney,
      user.dateOfPatent,
      user.agentLicensed,
      user.firmOrOrganization,
      user.updatedPhoneNumber,
      user.emailAddress,
      user.updatedOrganization,
      user.firmUrl,
      user.updatedAddress,
      user.updatedCity,
      user.updatedState,
      user.updatedCountry,
      user.updatedZipcode,
      user.linkedInProfile,
      user.notes,
      user.initials,
      user.dataUpdatedAsOn,
    ];
    return searchableFields.some((field) =>
      field?.toString().toLowerCase().includes(filter.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageInput(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageInput(currentPage + 1);
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageJump = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setPageInput(pageNumber);
    } else {
      toast.error("Invalid page number");
      setPageInput(currentPage);
    }
  };

  const handlePageInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handlePageJump();
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <main className="main3">
        <div className="user-table-container">
          {activeComponent === "newProfiles" && (
            <NewProfilesUpdated onClick={() => setActiveComponent(null)} />
          )}
          {activeComponent === "removedProfiles" && (
            <RemovedProfiles onClick={() => setActiveComponent(null)} />
          )}
          {activeComponent === "updatedProfiles" && (
            <NewProfilesUpdated2 onClick={() => setActiveComponent(null)} />
          )}

          <div className="filter-block">
            <div className="filter-block1">
              <h2 className="title">User Management</h2>
            </div>
            <div className="filter-block2">
              <div className="filter-input-wrapper">
                <input
                  type="text"
                  placeholder="Filter by any field"
                  value={filter}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
              </div>
              <button onClick={handleUpdateAll} className="action-button save-button">
                Save
              </button>
              <button
                className="action-button upload-button"
                onClick={() => setNewUploadExcel(true)}
              >
                Upload
              </button>
              <div className="dropdown-container">
                <button
                  className="action-button updates-button"
                  onClick={toggleDropdown}
                >
                  Updates
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <div
                      className="dropdown-item"
                      onClick={() => handleDropdownSelect("newProfiles")}
                    >
                      New Profiles
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => handleDropdownSelect("removedProfiles")}
                    >
                      Removed Profiles
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => handleDropdownSelect("updatedProfiles")}
                    >
                      Updated Profiles
                    </div>
                  </div>
                  
                )}
              </div>
              {/* <div className="action-button upload-button">Add</div> */}
              <button
                className="action-button upload-button"
              >
                Insights
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th className="user-table-head">S. No.</th>
                  <th>Name</th>
                  <th>Organization</th>
                  <th>Address Line 1</th>
                  <th>Address Line 2</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
                  <th>Zipcode</th>
                  <th>Phone Number</th>
                  <th>Reg Code</th>
                  <th>Attorney</th>
                  <th>Date of Patent</th>
                  <th>Agent Licensed</th>
                  <th>Firm or Organization</th>
                  <th>Updated Phone Number</th>
                  <th>Email Address</th>
                  <th>Updated Organization/Law Firm Name</th>
                  <th>Firm/Organization URL</th>
                  <th>Updated Address</th>
                  <th>Updated City</th>
                  <th>Updated State</th>
                  <th>Updated Country</th>
                  <th>Updated Zipcode</th>
                  <th>LinkedIn Profile URL</th>
                  <th>Notes</th>
                  <th>Initials</th>
                  <th>Data Updated as on</th>
                  <th className="checkbox-header">
                    All <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                  </th>
                  <th>Edit/Save/Delete</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={index} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                    <td className="user-table-row-data">{startIndex + index + 1}</td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "name", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 1)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.name || user.name}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "organization", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 2)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.organization || user.organization}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "addressLine1", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 3)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.addressLine1 || user.addressLine1}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "addressLine2", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 4)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.addressLine2 || user.addressLine2}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "city", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 5)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.city || user.city}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "state", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 6)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.state || user.state}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "country", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 7)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.country || user.country}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "zipcode", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 8)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.zipcode || user.zipcode}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "phoneNumber", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 9)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.phoneNumber || user.phoneNumber}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "regCode", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 10)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.regCode || user.regCode}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "agentAttorney", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 11)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.agentAttorney || user.agentAttorney}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "dateOfPatent", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 12)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.dateOfPatent || user.dateOfPatent}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "agentLicensed", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 13)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.agentLicensed || user.agentLicensed}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "firmOrOrganization", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 14)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.firmOrOrganization || user.firmOrOrganization}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "updatedPhoneNumber", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 15)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.updatedPhoneNumber || user.updatedPhoneNumber}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "emailAddress", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 16)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.emailAddress || user.emailAddress}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "updatedOrganization", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 17)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.updatedOrganization || user.updatedOrganization}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "firmUrl", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 18)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.firmUrl || user.firmUrl}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "updatedAddress", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 19)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.updatedAddress || user.updatedAddress}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "updatedCity", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 20)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.updatedCity || user.updatedCity}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "updatedState", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 21)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.updatedState || user.updatedState}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "updatedCountry", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 22)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.updatedCountry || user.updatedCountry}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "updatedZipcode", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 23)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.updatedZipcode || user.updatedZipcode}
                    </td>

                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "linkedInProfile", e.target.textContent)}
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, 24);
                        // Handle Ctrl+Enter to open the link
                        if (e.ctrlKey && e.key === "Enter") {
                          const url = editedUsers[user.regCode]?.linkedInProfile || user.linkedInProfile;
                          if (url) {
                            window.open(url, "_blank", "noopener,noreferrer");
                          }
                        }
                      }}
                      className="editable-cell"
                    >
                      <a
                        href={editedUsers[user.regCode]?.linkedInProfile || user.linkedInProfile}
                        title="Double click to follow this link" // Tooltip on hover
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default single-click link behavior
                          e.stopPropagation(); // Prevent triggering cell edit
                        }}
                        onDoubleClick={(e) => {
                          e.preventDefault(); // Prevent default link behavior
                          e.stopPropagation(); // Prevent triggering cell edit
                          const url = editedUsers[user.regCode]?.linkedInProfile || user.linkedInProfile;
                          if (url) {
                            window.open(url, "_blank", "noopener,noreferrer"); // Open link on double-click
                          }
                        }}
                        style={{ cursor: "pointer", textDecoration: "underline" }} // Visual cue for link
                      >
                        {editedUsers[user.regCode]?.linkedInProfile || user.linkedInProfile || "No LinkedIn Profile"}
                      </a>
                    </td>
                    
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "notes", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 25)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.notes || user.notes}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "initials", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 26)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.initials || user.initials}
                    </td>
                    <td
                      contentEditable
                      suppressContentEditableWarning
                      spellCheck={false}
                      onBlur={(e) => handleEdit(user.regCode, "dataUpdatedAsOn", e.target.textContent)}
                      onKeyDown={(e) => handleKeyDown(e, index, 27)}
                      className="editable-cell"
                    >
                      {editedUsers[user.regCode]?.dataUpdatedAsOn || user.dataUpdatedAsOn}
                    </td>
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={user.isChecked || false}
                        onChange={(e) => handleCheckboxChange(user.regCode, e.target.checked)}
                      />
                    </td>
                    <td className="action-cell">
                      <button className="action-button edit-button" onClick={updating}>
                        {loading ? "Edited" : "Edit"}
                      </button>
                      <button className="action-button save-button" onClick={handleUpdateAll}>
                        Save
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={showNMessage}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page{" "}
              <input
                type="number"
                value={pageInput}
                onChange={handlePageInputChange}
                onKeyPress={handlePageInputKeyPress}
                onBlur={handlePageJump}
                className="page-input"
                placeholder={currentPage}
                min="1"
                max={totalPages}
              />{" "}
              of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>

          <h4 className="total-data">
            Total data's of {userId} : {users.length}
          </h4>

          {newUploadExcel && (
            <NewUploadExcel userId={userId._id} onClose={() => setNewUploadExcel(false)} />
          )}
        </div>
      </main>
    </div>
  );
};

export default UserTable;