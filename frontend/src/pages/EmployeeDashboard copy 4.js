import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../style/pages/EmployeeDashboard.css";

const UserTable = ({
  handleEdit,
  handleCheckboxChange,
  updating,
  loading,
  handleUpdateAll,
  showNMessage
}) => {
  const location = useLocation();
  const userIdFromLocation = location.state?.userId;
  const [userId, setUserId] = useState(userIdFromLocation || localStorage.getItem('userId'));
  const [users, setUsers] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 500;
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (userIdFromLocation) {
      localStorage.setItem('userId', userIdFromLocation);
      setUserId(userIdFromLocation);
    }
  }, [userIdFromLocation]);

  useEffect(() => {
    if (userId) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/fetch-users?userId=${userId}`);
          setUsers(response.data.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }
  }, [userId]);
  

  const headers = [
    "S. No.", "Name", "Organization", "Address Line 1", "Address Line 2", "City", "State", "Country", "Zipcode",
    "Phone Number", "Reg Code", "Attorney", "Date of Patent", "Agent Licensed", "Firm or Organization",
    "Updated Phone Number", "Email Address", "Updated Organization/Law Firm Name", "Firm/Organization URL",
    "Updated Address", "Updated City", "Updated State", "Updated Country", "Updated Zipcode",
    "LinkedIn Profile URL", "Notes", "Initials", "Data Updated as on", "Select", "Actions"
  ];

  const fieldMap = [
    'name', 'organization', 'addressLine1', 'addressLine2', 'city', 'state', 'country', 'zipcode', 'phoneNumber',
    'regCode', 'agentAttorney', 'dateOfPatent', 'agentLicensed', 'firmOrOrganization', 'updatedPhoneNumber',
    'emailAddress', 'updatedOrganization', 'firmUrl', 'updatedAddress', 'updatedCity', 'updatedState',
    'updatedCountry', 'updatedZipcode', 'linkedInProfile', 'notes', 'initials', 'dataUpdatedAsOn'
  ];

  const totalPages = Math.ceil(users.length / usersPerPage);
  const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handleKeyDown = (e) => {
    const cell = e.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    let nextCell = null;

    if (e.key === 'ArrowRight') {
      nextCell = document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`);
    } else if (e.key === 'ArrowLeft') {
      nextCell = document.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`);
    } else if (e.key === 'ArrowDown') {
      nextCell = document.querySelector(`[data-row="${row + 1}"][data-col="${col}"]`);
    } else if (e.key === 'ArrowUp') {
      nextCell = document.querySelector(`[data-row="${row - 1}"][data-col="${col}"]`);
    }

    if (nextCell) {
      e.preventDefault();
      nextCell.focus();
    }
  };

  const renderEditableCell = (user, fieldName, rowIndex, colIndex) => {
    const slNo = user?.slNo;
    const defaultValue = user ? (user[fieldName] || "") : "";

    const handleBlur = (e) => {
      const newValue = e.target.textContent;
      if (slNo !== undefined && fieldName) {
        handleEdit(slNo, fieldName, newValue);
      }
    };

    return (
      <td
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        data-row={rowIndex}
        data-col={colIndex}
        className="editable-input"
        tabIndex={0}
      >
        {defaultValue}
      </td>
    );
  };

  const handleFilter = (field) => {
    const currentFilter = filters[field] || "";
    const newFilter = prompt(`Enter a filter value for ${field}`, currentFilter);
    if (newFilter !== null) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [field]: newFilter
      }));
    }
  };

  const removeFilter = (field) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[field];
      return newFilters;
    });
  };

  return (
    <div>
      <main>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx} className={idx === 0 ? "user-table-head1" : ""}>
                    {header}
                    {idx !== 0 && (
                      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <FontAwesomeIcon
                          icon={faFilter}
                          className="filter-icon"
                          onClick={() => handleFilter(fieldMap[idx - 1])}
                        />
                        {filters[fieldMap[idx - 1]] && (
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="remove-filter-icon"
                            onClick={() => removeFilter(fieldMap[idx - 1])}
                            style={{ marginLeft: '5px', cursor: 'pointer' }}
                          />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers
                  .filter((user) => {
                    return Object.keys(filters).every((filterKey) => {
                      if (!filters[filterKey]) return true;
                      return user[filterKey]?.toString().toLowerCase().includes(filters[filterKey].toLowerCase());
                    });
                  })
                  .map((user, index) => (
                    <tr key={index}>
                      <td className="user-table-row-data-SlNo">{(currentPage - 1) * usersPerPage + index + 1}</td>
                      {fieldMap.map((field, colIdx) => renderEditableCell(user, field, index, colIdx + 1))}
                      <td style={{ textAlign: "center", width:"100px" }}>
                        <input
                          style={{ textAlign: "center", width:"50px" }}
                          type="checkbox"
                          checked={user.isChecked || false}
                          onChange={(e) => handleCheckboxChange(user.slNo, e.target.checked)}
                        />
                      </td>

                      <td>
                        {/* <button className="editsavedeletebtnforempdashboard" onClick={updating}>
                          {loading ? 'Editing...' : 'Edit'}
                        </button> */}
                        <button className="editsavedeletebtnforempdashboard" onClick={handleUpdateAll}>
                          Save
                        </button>
                        <button
                          className="deletebtnforempdashboard"
                          onClick={showNMessage}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={headers.length} style={{ textAlign: 'center' }}>
                    No users available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-control">
          <div>
              <h4 style={{ color: 'white' }}>Total records for {userId}: {users.length}</h4>
          </div>
          <div className="pagination-controls">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Previous
              </button>
              <span style={{ color: 'white', margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                Next
              </button>
          </div>
        </div>

        
      </main>
    </div>
  );
};

export default UserTable;
