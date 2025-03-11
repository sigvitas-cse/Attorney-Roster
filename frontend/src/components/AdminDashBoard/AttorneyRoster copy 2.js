import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaFilter } from "react-icons/fa";
import "../../style/Components/AdminDashboard/AttorneyRoster.css";

const AttorneyRoster = () => {
  const [allData, setAllData] = useState([]); // Stores fetched data
  const [totalRecords, setTotalRecords] = useState(52384); // Corrected total count
  const [apiPage, setApiPage] = useState(1); // API page tracking
  const [hasMoreData, setHasMoreData] = useState(true); // Stop API calls when all data is loaded
  const [currentPage, setCurrentPage] = useState(1); // UI pagination

  const initialLimit = 5000; // First API call fetches 5000 records
  const batchLimit = 1000; // Subsequent API calls fetch 1000 records each
  const rowsPerPage = 500; // Number of rows displayed per page

  // Total number of pages in frontend pagination
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  /** 🔹 Fetch Data from Backend */
  // const fetchAllData = async (pageNumber, limit) => {
  //   try {
  //     const response = await axios.get("http://localhost:3001/api/all-users-data", {
  //       params: { page: pageNumber, limit },
  //     });
  
  //     if (response.status === 200) {
  //       let fetchedData = response.data.data;
  //       const correctTotal = 51948; // Set the correct total
  
  //       // Prevent exceeding total records
  //       const newTotal = allData.length + fetchedData.length;
  //       if (newTotal > correctTotal) {
  //         const extraRecords = newTotal - correctTotal;
  //         fetchedData = fetchedData.slice(0, fetchedData.length - extraRecords); // Remove extra records
  //       }
  
  //       setAllData((prevData) => [...prevData, ...fetchedData]); // Append valid data
  //       setTotalRecords(correctTotal); // Set correct total
  //       setApiPage(pageNumber + 1); // Move to next API page
  
  //       console.log(`Fetched batch: ${fetchedData.length} records. Total loaded: ${allData.length + fetchedData.length}`);
  
  //       if (allData.length + fetchedData.length >= correctTotal) {
  //         setHasMoreData(false); // Stop further API calls
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //     setHasMoreData(false);
  //   }
  // };
  
  const fetchAllData = async (pageNumber, limit) => {
    try {
      const response = await axios.get("http://localhost:3001/api/all-users-data", {
        params: { page: pageNumber, limit },
      });
  
      if (response.status === 200) {
        setTotalRecords(response.data.totalUsers); // Always get correct total from API
  
        setAllData((prevData) => {
          const newData = [...prevData, ...response.data.data];
  
          // Stop fetching when we reach the exact total count
          if (newData.length >= response.data.totalUsers) {
            setHasMoreData(false);
            return newData.slice(0, response.data.totalUsers); // Ensure no extra records
          }
  
          return newData;
        });
  
        setApiPage(pageNumber + 1); // Move to next API page
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setHasMoreData(false);
    }
  };
  
  // 🚀 Fetch initial records on mount
  useEffect(() => {
    fetchAllData(1, initialLimit);
  }, []);
  
  // 🚀 Fetch remaining records in 1000-record batches until done
  useEffect(() => {
    if (hasMoreData) {
      const interval = setInterval(() => {
        fetchAllData(apiPage, batchLimit);
      }, 1500);
  
      return () => clearInterval(interval);
    }
  }, [hasMoreData, apiPage]);
  
  

  // /** 🔹 Fetch initial 5000 records on mount */
  // useEffect(() => {
  //   fetchAllData(1, initialLimit);
  // }, []);

  // /** 🔹 Fetch remaining records in 1000-record batches */
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (hasMoreData) {
  //       fetchAllData(apiPage, batchLimit);
  //     }
  //   }, 1500); // Fetch every 1.5 seconds

  //   return () => clearInterval(interval); // Cleanup interval
  // }, [hasMoreData, apiPage]);

  /** 🔹 Get visible rows for pagination */
  const visibleData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return allData.slice(startIndex, startIndex + rowsPerPage);
  }, [allData, currentPage]);

  return (
    <section className="patentDataSection">
      <h2 style={{ color: "black" }}>
        All Patent Data ({totalRecords}) | Page {currentPage} of {totalPages}
      </h2>

      {/* Table Display */}
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
                <th key={index}>
                  {header}
                  {index !== 0 && (
                    <FaFilter
                      style={{ color: "white", cursor: "pointer" }}
                      className="filter-icon"
                      onClick={() => prompt(`Filter by ${header}:`)}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.map((data, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
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

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>{"<<"}</button>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>{">"}</button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>{">>"}</button>
      </div>

      {hasMoreData ? <p>Loading more data...</p> : <p>All data loaded.</p>}
    </section>
  );
};

export default AttorneyRoster;
