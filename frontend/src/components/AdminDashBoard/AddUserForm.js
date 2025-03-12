import React, { useState } from "react";
import "../../style/Components/AdminDashboard/AddUserForm.css";
import axios from "axios";

const AddUserForm = () => {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://roster1.sigvitas.com';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter an email!");
      return;
    }
    setLoading(true);
    try {
      
      console.log("Sending email:", email);  // ✅ Debug log before sending

      // const response = await axios.post(`${API_URL}/api/save-employee-details`, { email });
      
      const response = await axios.post("http://localhost:3001/api/save-employee-details", { email });


      console.log("Response received:", response.data);  // ✅ Debug log for API response

      alert(`${email} added successfully.`);
      setUsers([...users, { email }]);
      setEmail("");
    } catch (err) {
      alert("An error occurred while adding the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-container">
      <h2>Create User</h2>
      <form className="userForm" onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="saveButtondashboard1" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        </div>
        
      </form>

      {/* Display Added Users */}
      {users.length > 0 && (
        <div className="user-list">
          <h3>Added Users</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user.email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddUserForm;
