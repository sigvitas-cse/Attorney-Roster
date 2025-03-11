import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../style/Components/AdminDashboard/AttorneyRoster.css';
import qs from 'qs';
import { FaFilter } from "react-icons/fa";

const AttorneyRoster = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/all-users-data`);
        if (response.status === 200) {
          setAllData(response.data.data);
          setFilteredData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchAllData();
  }, []);

  const handleFilterChange = async (column, value) => {
    if (!value || value.trim() === "") {
      setFilteredData(allData);
      return;
    }

    const newFilters = { ...filters, [column]: value.trim() };
    setFilters(newFilters);

    const queryString = qs.stringify(newFilters);
    try {
      const response = await axios.get(`http://localhost:3001/api/all-users-data-filtering?${queryString}`);
      if (response.status === 200) {
        setFilteredData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching filtered data:", err);
    }
  };

  return (
    <section className="patentDataSection">
      <h2 style={{color:'black'}}>All Patent Data : {allData.length}</h2>
      <div className="table-container">
        <table className="user-table2">
          <thead>
            <tr>
              {[
                "S. No.",
                "Name",
                "Organization",
                "Address Line 1",
                "Address Line 2",
                "City",
                "State",
                "Country",
                "Zipcode",
                "Phone Number",
                "Reg Code",
                "Attorney",
                "Date of Patent",
                "Agent Licensed",
                "Firm or Organization",
                "Updated Phone Number",
                "Email Address",
                "Updated Organization/Law Firm Name",
                "Firm/Organization URL",
                "Updated Address",
                "Updated City",
                "Updated State",
                "Updated Country",
                "Updated Zipcode",
                "LinkedIn Profile URL",
                "Notes",
                "Initials",
                "Data Updated as on",
              ].map((header, index) => (
                <th key={index} className={index === 0 ? "serial-no-header" : "non-serial-no-header"}>
                  {header}
                  {index !== 0 && (
                    <FaFilter
                      className="filter-icon"
                      onClick={() =>
                        handleFilterChange(
                          header.toLowerCase().replace(/ /g, ""),
                          prompt(`Filter by ${header}:`, filters[header] || "")
                        )
                      }
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data.name}</td>
                <td>{data.organization}</td>
                <td>{data.addressLine1}</td>
                <td>{data.addressLine2}</td>
                <td>{data.city}</td>
                <td>{data.state}</td>
                <td>{data.country}</td>
                <td>{data.zipcode}</td>
                <td>{data.phoneNumber}</td>
                <td>{data.regCode}</td>
                <td>{data.agentAttorney}</td>
                <td>{data.dateOfPatent}</td>
                <td>{data.agentLicensed}</td>
                <td>{data.firmOrOrganization}</td>
                <td>{data.updatedPhoneNumber}</td>
                <td>{data.emailAddress}</td>
                <td>{data.updatedOrganization}</td>
                <td>{data.firmUrl}</td>
                <td>{data.updatedAddress}</td>
                <td>{data.updatedCity}</td>
                <td>{data.updatedState}</td>
                <td>{data.updatedCountry}</td>
                <td>{data.updatedZipcode}</td>
                <td>{data.linkedInProfile}</td>
                <td>{data.notes}</td>
                <td>{data.initials}</td>
                <td>{data.dataUpdatedAsOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AttorneyRoster;
