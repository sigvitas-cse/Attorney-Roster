import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; // Import delete icon
import "../../style/Components/AdminDashboard/UsersPage.css"; // Create a CSS file for styling

const Users = () => {
  const [users, setUsers] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users
  const fetchUsers = async () => {
    try {

      // const response = await axios.get(`${API_URL}/api/all-users`);

      const response = await axios.get(`http://localhost:3001/api/all-users`);

      if (response.status === 200) {
        setUsers(response.data.data);
      } else {
        alert("Failed to fetch users.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("An error occurred while fetching users. Please try again later.");
    }
  };

  // Function to delete a user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.delete(`${API_URL}/api/delete-user/${userId}`);

      // const response = await axios.delete(`http://localhost:3001/api/delete-user/${userId}`);
      if (response.status === 200) {
        alert("User deleted successfully.");
        setUsers(users.filter((user) => user.userId !== userId)); // Remove from UI
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("An error occurred while deleting the user.");
    }
  };

  return (
    <section className="usersSection cardOneHeight">
      <h2>All Users</h2>
      <table className="user-table2" style={{ background: "white" }}>
        <thead>
          <tr>
            <th className="makeAuto">S. No.</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.userId}</td>
              <td>{user.name}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(user.userId)}>
                  <FaTrash style={{ color: "red", cursor: "pointer" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Users;
