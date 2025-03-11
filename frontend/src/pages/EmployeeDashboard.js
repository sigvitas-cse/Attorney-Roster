import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import "../style/pages/EmployeeDashboard.css"; 
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const userId = location.state?.userId;
  const admin = users.length > 0 ? users[0].admin : false;
  const [filter, setFilter] = useState("");
  const [editedUsers, setEditedUsers] = useState({});
  const [newUser, setNewUser] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
      document.title = "Paytent Analyst Dashboard"; 
    }, []);

  const updating = () => {
    setLoading(!loading);
    if(loading){
      alert('Data edited succesfully')
    }
  };

  const updatingSaveButton = () => {

      alert('Data saved succesfully')

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
      // .get(`http://localhost:3001/api/fetch-users?userId=${userId}`)
      .get(`${API_URL}/api/fetch-users?userId=${userId}`)
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

  const handleNewUserChange = (field, value) => {
  setNewUser({
  ...newUser,
  [field]: value,
  });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.organization || !newUser.initials) {
        alert("Please fill all required fields.");
        return;
    }

    const dataToSend = { ...newUser, userId, admin};
      console.log('userId:',userId);
      console.log('admin:',admin);

    // console.log("Adding user:", dataToSend);

    axios
        .post(`${API_URL}/api/add-user`, dataToSend)
        // .post('http://localhost:3001/api/add-user', dataToSend)
        .then((response) => {
            console.log(response.data.message);
            // fetchAllUsers();
            setNewUser({
                slNo: "",
                name: "",
                organization:"",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                country: "",
                zipcode: "",
                phoneNumber: "",
                regCode: "",
                agentAttorney: "",
                dateOfPatent: "",
                agentLicensed: "",
                firmOrOrganization: "",
                updatedPhoneNumber: "",
                emailAddress: "",
                updatedOrganization: "",
                firmUrl: "",
                updatedAddress: "",
                updatedCity: "",
                updatedState: "",
                updatedCountry: "",
                updatedZipcode: "",
                linkedInProfile: "",
                notes: "",
                initials: "",
                dataUpdatedAsOn: ""
            });
            alert('Data adedd succesfully')
        })
        .catch((error) => {
            console.error("Error adding user:", error);
            alert("Failed to add user. Please try again.");
        });
};
// Function to fetch all users
const fetchAllUsers = () => {
    axios
   
        .get(`${API_URL}/api/fetch-users`)
        // .get('http://localhost:3001/api/fetch-users') // Assuming the endpoint fetches the latest users
        .then((response) => {
            console.log("Fetched users:", response.data);
            setUsers(response.data.data); // Assuming 'data' is the array of users
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
            alert("Failed to fetch users. Please try again.");
        });
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

   const handleDownload = () => {
    if (downloadFormat === "xlsx") {
      downloadAsExcel();
    } else if (downloadFormat === "pdf") {
      downloadAsPDF();
    } else {
      alert("Please select a format to download!");
    }
  };

  const downloadAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };
//in A3 it's looks good
  const downloadAsPDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a3');

    // Extract table columns and rows
    const tableColumn = Object.keys(users[0]);
    const tableRows = users.map(user => Object.values(user));

    // AutoTable configuration
    doc.autoTable({
      margin: { top: 3, right: 3, bottom: 3, left: 3 }, // Reduce the outer margin
      head: [tableColumn],
      body: tableRows,
      theme: 'grid', // Ensures a grid layout with borders
      styles: {
        fontSize: 4,
        cellPadding: 0.5,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: 255, // Header text color
        fontSize: 5,
        lineWidth: 0.1, // Enforces border line width
        lineColor: [200, 200, 200], // Light gray borders
      },
      drawCell: (data) => {
        // Custom logic for rendering header borders
        if (data.section === 'head') {
          doc.setDrawColor(200, 200, 200); // Light gray border color
          doc.setLineWidth(0.1); // Border thickness
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        }
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Reduce width for _id
        1: { cellWidth: 6 },
        2: { cellWidth: 12 },
        3: { cellWidth: 12 }, // Reduce width for slNo
        4: { cellWidth: 13 },
        5: { cellWidth: 13 },
        6: { cellWidth: 10 }, //city
        7: { cellWidth: 8 },
        8: { cellWidth: 10 }, //country
        10: { cellWidth: 15 },
        11: { cellWidth: 10 }, //reg Cod
        12: { cellWidth: 15 },
        13: { cellWidth: 15 },
        14: { cellWidth: 15 },//agentLicensed       
        15: { cellWidth: 10 },
        16: { cellWidth: 11 },//updated phone number
        17: { cellWidth: 12 }, //email
        18: { cellWidth: 10 }, //updated organization
        18: { cellWidth: 10 },//firmUrl
        19: { cellWidth: 12 },//updatedAddress        
        20: { cellWidth: 11 },
        21: { cellWidth: 12 },
        22: { cellWidth: 12 },
        23: { cellWidth: 10 },
        24: { cellWidth: 10 },
        25: { cellWidth: 15 },//linkdin
        26: { cellWidth: 10 },//notes
        27: { cellWidth: 10 },//initials
        28: { cellWidth: 15 },//dateUpdatedAsOn
        29: { cellWidth: 15 },
        // Adjust or add more columns if needed
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });

    doc.save("users.pdf");
  };

const showNMessage = () => {
  alert('Not Permited');
  // return showNMessage;
}

const navigate = useNavigate();
function gohome() {
  const userConfirmed = window.confirm('Do you want to exit?');
  if (userConfirmed) {
        navigate('/');
  } else {
    console.log('User chose to stay on the page.');
  }
}
function goBack() {
  const userConfirmed = window.confirm('Do you want to Login Page?');
  if (userConfirmed) {
        navigate('/EmployeeLoginPage');
  } else {
    console.log('User chose to stay on the page.');
  }
}


const fetchAllAllData = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/AllData");
    const usersData = response.data.data;

    if (!usersData || usersData.length === 0) {
      console.warn("No data found");
      alert("No data available to download.");
      return;
    }

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(usersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Create and trigger the Excel file download
    XLSX.writeFile(workbook, "Attorney-Roster-Data.xlsx");
  } catch (error) {
    console.error("Error fetching users:", error);
    alert("Failed to fetch users. Please try again.");
  }
};


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
        {/* <div>
      <select
        value={downloadFormat}
        onChange={(e) => setDownloadFormat(e.target.value)}
        className="download-format-dropdown"
      >
        <option value="" disabled>
          Select Format
        </option>
        <option value="xlsx">Excel</option>
        <option value="pdf">PDF</option>
      </select>
      <button onClick={handleDownload} className="Download-button" style={{cursor:'pointer'}}>  //This is only only specific data regarding userId[current displyaing data]
        Download
      </button>

    </div> */}
    <button onClick={handleUpdateAll} className="saveBtnForAllOne" >
    Save
  </button>
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
    <h3 className="add-user-form-h3" style={{color:'white'}}>Add New User</h3>
      <div className="add-user-form">
        
        <table className='user-table2'>
        <tr>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("slNo", e.target.textContent)}
            className="editable-cell"
            data-placeholder="S. No."
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("name", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Name"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("organization", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Organization"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("addressLine1", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Address Line 1"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("addressLine2", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Address Line 2"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("city", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="City"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("state", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="State"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("country", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Country"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("zipcode", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Zipcode"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("phoneNumber", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Phone Number"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("regCode", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Reg Code"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("agentAttorney", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Agent/Attorney"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("dateOfPatent", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Date of Patent"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("agentLicensed", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Agent Licensed"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("firmOrOrganization", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Firm or Organization"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("updatedPhoneNumber", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Updated Phone Number"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("emailAddress", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Email Address"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("updatedOrganization", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Updated Organization"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("firmUrl", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Firm/Organization URL"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("updatedAddress", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Updated Address"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("updatedCity", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Updated City"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("updatedState", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Updated State"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("updatedCountry", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Updated Country"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("updatedZipcode", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Updated Zipcode"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("linkedInProfile", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="LinkedIn Profile"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("notes", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Notes"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("initials", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Initials"
          ></td>
          <td
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleNewUserChange("dataUpdatedAsOn", e.target.textContent)}
            className="add-user-input editable-cell"
            data-placeholder="Data Updated As On"
          ></td>
          
          <td className="AddSave12">
          <button
              onClick={handleAddUser}
              className="add-user-button add-user-button-Add"
            >
              Add User
            </button>
            <button
              onClick={handleUpdateAll}
              className="Save-button add-user-button-Save"
            >
              Save
            </button>
          </td>
        </tr>

        </table>

      </div>


    </div>
     </main>
    </div>


  );
};

export default UserTable;