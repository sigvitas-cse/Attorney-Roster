import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../style/Components/AdminDashboard/UsersPage.css"; // Create a CSS file for styling


const Users = () => {
  const [users, setUsers] = useState([]);
  // const API_URL = process.env.REACT_APP_API_URL;
  const API_URL = process.env.REACT_APP_API_URL || 'https://roster1.sigvitas.com';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/all-users`);

        // const response = await axios.get(`http://localhost:3001/api/all-users`);
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

    fetchUsers();
  }, []);

  return (
    <section className="usersSection cardOneHeight">
      <h2>All Users</h2>
      <table className="user-table2" style={{ background: "white" }}>
        <thead>
          <tr>
            <th className="makeAuto">S. No.</th>
            <th>User ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.userId}</td>
              <td>{user.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Users;
