import React, { useState, useEffect } from "react";
import "jspdf-autotable";
import axios from "axios";
import "../style/pages/EmployeeDashboard.css"; 
import { useLocation } from "react-router-dom";
import NewProfilesUpdated from "../components/AdminDashBoard/IndivisualComponents/newProfiles";
import RemovedProfiles from "../components/AdminDashBoard/IndivisualComponents/removedProfiles";
import NewProfilesUpdated2 from "../components/AdminDashBoard/IndivisualComponents/updatedProfiles";

import NewUploadExcel from "../components/EmployeeDashboard/NewUploadExcel";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const userId = location.state?.userId;
  const [filter, setFilter] = useState("");
  const [editedUsers, setEditedUsers] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newProfilesUpdate, setNewProfilesUpdate] = useState(false);
  const [removedProfilesUpdate, setremovedProfilesUpdate] = useState(false);
  const [updatedProfiles, setUpdatedProfiles] = useState(false)

  const [newUploadExcel, setNewUploadExcel] = useState(false)
  
  useEffect(() => {
      document.title = "Patent Analyst Dashboard"; 
    }, []);

  const updating = () => {
    setLoading(!loading);
    if(loading){
      alert('Data edited succesfully')
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  // const API_URL = process.env.REACT_APP_API_URL;
  const API_URL = process.env.REACT_APP_API_URL || 'https://roster1.sigvitas.com';


  const fetchUsers = () => {
    const userId = location.state.userId; // Assuming you're using React Router's location.state
    console.log("UserId being sent to backend:", userId);

    axios
    .get(`${API_URL}/api/fetch-users?userId=${userId}`)
      // .get(`http://localhost:3001/api/fetch-users?userId=${userId}`)
      .then((response) => {
        console.log("Response from backend:", response.data);
        // console.log("Total data:", response.data.data.length);

        setUsers(response.data.data); // Assuming 'data' contains the fetched data
        // console.log('admin:',response.data.admin);
        // setAdmin(response.data.admin)
        
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
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

  const handleUpdateAll = () => {
    const updates = users.map((user, index) => ({
      slNo: user.slNo, // Assuming slNo is unique for each user
      ...editedUsers[user.slNo] || {}, // Spread the edited fields
    }));

    console.log("Sending updates to backend:", updates); // Add this line to verify the updates

    axios
      .put(`${API_URL}/api/update-users`, updates)
      // .put('http://localhost:3001/api/update-users', updates)
      .then((response) => {
        console.log(response.data.message);
        fetchUsers(); // Refresh users after update
        setEditedUsers({});
        alert('Data saved succesfully')
      })
      .catch((error) => console.error("Error updating users:", error));
      
  };



  // console.log('updatedPhoneNumber:',users.updatedPhoneNumber);
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked); 
    setUsers(users.map((user) => ({ ...user, isChecked }))); 
  };

  const handleCheckboxChange = (id, isChecked) => {
    setUsers(users.map((user) => (user.slNo === id ? { ...user, isChecked } : user)));

    const allSelected = users.every((user) => user.slNo === id ? isChecked : user.isChecked);
    setSelectAll(allSelected);
  };




const showNMessage = () => {
  alert('Not Permited');
  // return showNMessage;
}


  return (
    <div>
     <main className="main3">
     <div className="user-table-container">

      <div className='Filter-Block'>
        <div className="Filter-Block1"> 
          <h2 className="title">User Management</h2>
        </div>
        <div className="Filter-Block2">
        {/* <i class="fa-solid fa-magnifying-glass"></i> */}
        <input
          type="text"
          placeholder="Filter by name/regCode"
          value={filter}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
       
    <button onClick={handleUpdateAll} className="saveBtnForAllOne" >
    Save
  </button>
  <button className="saveBtnForAllOne" onClick={()=>setNewUploadExcel(true)}>Upload</button>
              {
                newUploadExcel && (
                  <NewUploadExcel userId={userId._id} onClose={()=>setNewUploadExcel(false)}/>
                )
              }

  <div className="datasections">
              <p> <button className="newprofiles indivisualbuttons" onClick={()=>setNewProfilesUpdate(true)}>New Profiles</button></p>
              {
                newProfilesUpdate && (
                  <NewProfilesUpdated onClick={()=>setNewProfilesUpdate(false)}/>
                )
              }
              <p><button className="removedprofiles indivisualbuttons" onClick={()=>setremovedProfilesUpdate(true)}>Removed Profiles</button></p>
              {
                removedProfilesUpdate && (
                  <RemovedProfiles onClick={()=>setremovedProfilesUpdate(false)}/>
                )
              }
              <p> <button className="updatedrofiles indivisualbuttons" onClick={()=>setUpdatedProfiles(true)}>Updated Profiles</button></p>
              {
                updatedProfiles && (
                  <NewProfilesUpdated2 onClick={()=>setUpdatedProfiles(false)}/>
                )
              }
            </div>
        </div> 
         {/* <button onClick={fetchAllAllData}>Download</button> This is for all data */}
      </div>
  
    <div className="table-container2">
      <table className="user-table">
      <thead>
          <tr>
            <th className="user-table-head1">
              S. No.
            </th>
            <th>Name</th>
            <th>Organization</th>
            <th>Address Line 1</th>
            <th>Address Line 2</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Zipcode</th>
            <th>Phone Number</th>
            <th>Reg Code </th>
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
            <th style={{whiteSpace: 'wrap', width:"70px", textAlign:"center"}}>
             All{" "}
              <input
                style={{ width: "auto" }}
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>

            <th>EditSaveDelete</th>

          </tr>
        </thead>
        <tbody>
          {users
            // .filter((user) => user.name.toLowerCase().includes(filter.toLowerCase()))
            // .filter((user) => user && (user.name || user.regCode).toLowerCase().includes((filter).toLowerCase()))
            .filter((user) => {
              if (!user) return false; // Skip undefined or null users
              const { name = "", regCode = "" } = user; // Destructure with default values to avoid undefined
              return (
                name.toLowerCase().includes(filter.toLowerCase()) ||
                regCode.toLowerCase().includes(filter.toLowerCase())
              );
            })
            .map((user, index) => (
              <tr key={index}>
                {/* <td>{user.slNo}</td> */}
                <td className="user-table-row-data-SlNo">
                    {index+1}
                </td>
                
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "name", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.name || user.name) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "organization", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.organization || user.organization) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "addressLine1", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.addressLine1 || user.addressLine1) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "addressLine2", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.addressLine2 || user.addressLine2) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "city", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.city || user.city) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "state", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.state || user.state) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "country", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.country || user.country) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "zipcode", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.zipcode || user.zipcode) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "phoneNumber", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.phoneNumber || user.phoneNumber) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "regCode", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.regCode || user.regCode) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "agentAttorney", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.agentAttorney || user.agentAttorney) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "dateOfPatent", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.dateOfPatent || user.dateOfPatent) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "agentLicensed", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.agentLicensed || user.agentLicensed) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "firmOrOrganization", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.firmOrOrganization || user.firmOrOrganization) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "updatedPhoneNumber", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.updatedPhoneNumber || user.updatedPhoneNumber) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "emailAddress", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.emailAddress || user.emailAddress) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "updatedOrganization", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.updatedOrganization || user.updatedOrganization) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "firmUrl", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.firmUrl || user.firmUrl) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "updatedAddress", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.updatedAddress || user.updatedAddress) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "updatedCity", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.updatedCity || user.updatedCity) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "updatedState", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.updatedState || user.updatedState) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "updatedCountry", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.updatedCountry || user.updatedCountry) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "updatedZipcode", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.updatedZipcode || user.updatedZipcode) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "linkedInProfile", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.linkedInProfile || user.linkedInProfile) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "notes", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.notes || user.notes) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "initials", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.initials || user.initials) : ""}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onBlur={(e) => handleEdit(user.slNo, "dataUpdatedAsOn", e.target.textContent)}
                  className="editable-input"
                >
                  {user ? (editedUsers[user.slNo]?.dataUpdatedAsOn || user.dataUpdatedAsOn) : ""}
                </td>
                <td style={{width:"auto", textAlign:"center"}}>
                  <input
                    type="checkbox"
                    checked={user.isChecked || false} 
                    onChange={(e) => handleCheckboxChange(user.slNo, e.target.checked)}
                    style={{width:"auto"}}
                  />
                </td>

                <td style={{width:'auto'}}>
                  <button className="editsavedeletebtnforempdashboard" onClick={updating}>{loading ? 'edited?' : 'edit'}</button>
                  <button className="editsavedeletebtnforempdashboard"  onClick={handleUpdateAll}>save</button>
                  <button className="deletebtnforempdashboard" onClick={showNMessage}                  
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  >delete</button>
                </td>

              </tr>
            ))}
        </tbody>
      </table>
    </div>
    <h4 style={{color:'white'}}>Total data's of {userId} : {users.length}</h4>
  


    </div>
     </main>
    </div>


  );
};

export default UserTable;