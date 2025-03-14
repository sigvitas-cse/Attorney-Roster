import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "../../style/Components/AdminDashboard/AttorneyRoster.css";

const AttorneyRoster = () => {
  const [allData, setAllData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [apiPage, setApiPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [filters, setFilters] = useState({});
  const [globalSearch, setGlobalSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  /** 🔹 Header-to-Key Mapping for Filters */
  const headerMap = {
    "S. No.": "slNo",
    "Name": "name",
    "Organization": "organization",
    "Address Line 1": "addressLine1",
    "Address Line 2": "addressLine2",
    "City": "city",
    "State": "state",
    "Country": "country",
    "Zipcode": "zipcode",
    "Phone Number": "phoneNumber",
    "Reg Code": "regCode",
    "Attorney": "agentAttorney",
    "Date of Patent": "dateOfPatent",
    "Agent Licensed": "agentLicensed",
    "Firm or Organization": "firmOrOrganization",
    "Updated Phone Number": "updatedPhoneNumber",
    "Email Address": "emailAddress",
    "Updated Organization/Law Firm Name": "updatedOrganization",
    "Firm/Organization URL": "firmUrl",
    "Updated Address": "updatedAddress",
    "Updated City": "updatedCity",
    "Updated State": "updatedState",
    "Updated Country": "updatedCountry",
    "Updated Zipcode": "updatedZipcode",
    "LinkedIn Profile URL": "linkedInProfile",
    "Notes": "notes",
    "Initials": "initials",
    "Data Updated as on": "dataUpdatedAsOn",
  };

  /** 🔹 Handle Filter Change */
/** 🔹 Handle Filter Change */
const handleFilterChange = (columnHeader) => {
  const columnKey = headerMap[columnHeader]; // Map header to actual key
  if (!columnKey) return; // Prevent filtering if key not found

  // If the filter is already applied, remove it on second click
  if (filters[columnKey]) {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[columnKey]; // Remove filter
      return newFilters;
    });

    setActiveFilters((prevActiveFilters) => {
      const newActiveFilters = { ...prevActiveFilters };
      delete newActiveFilters[columnKey]; // Remove active filter
      return newActiveFilters;
    });

    return; // Exit function as we removed the filter
  }

  // Otherwise, prompt for a new filter value
  const value = prompt(`Filter by ${columnHeader}:`);
  if (value !== null) {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnKey]: value.trim().toLowerCase(),
    }));

    setActiveFilters((prevActiveFilters) => ({
      ...prevActiveFilters,
      [columnKey]: true, // Mark this filter as active
    }));
  }
};
  /** 🔹 Apply Filters & Global Search */
  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      const matchesFilters = Object.entries(filters).every(([key, value]) =>
        row[key]?.toString().toLowerCase().includes(value)
      );

      const matchesGlobalSearch = globalSearch
        ? Object.values(row).some(
            (val) =>
              val &&
              val.toString().toLowerCase().includes(globalSearch.toLowerCase()) // ✅ Exact substring match
          )
        : true;

      return matchesFilters && matchesGlobalSearch;
    });
  }, [allData, filters, globalSearch]);

  const initialLimit = 5000;
  const batchLimit = 1000;
  const rowsPerPage = 500;

  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";

  const totalPages = totalRecords ? Math.ceil(totalRecords / rowsPerPage) : 1;

  /** 🔹 Fetch Data from Backend */
  // const fetchAllData = async (pageNumber, limit, letter = "") => {
  //   try {
  //     // const response = await axios.get(`${API_URL}/api/all-users-data`, { 

  //     const response = await axios.get("http://localhost:3001/api/all-users-data", {
  //       params: { page: pageNumber, limit, letter },
  //     });

  //     if (response.status === 200) {
  //       setTotalRecords(response.data.totalUsers);

  //       setAllData((prevData) => {
  //         const newData = [...prevData, ...response.data.data];

  //         if (newData.length >= response.data.totalUsers) {
  //           setHasMoreData(false);
  //           return newData.slice(0, response.data.totalUsers);
  //         }

  //         return newData;
  //       });

  //       setApiPage(pageNumber + 1);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //     setHasMoreData(false);
  //   }
  // };

  const fetchAllData = async (pageNumber, limit, letter = "") => {
    try {
      // const response = await axios.get(`${API_URL}/api/all-users-data`, { 

      const response = await axios.get("http://localhost:3001/api/all-users-data", {
        params: { page: pageNumber, limit, letter },
      });
  
      if (response.status === 200) {
        setTotalRecords(response.data.totalUsers);
  
        setAllData((prevData) => {
          // ✅ Ensure uniqueness using a Set (based on _id or regCode)
          const existingIds = new Set(prevData.map((item) => item._id || item.regCode));
          const newData = response.data.data.filter((item) => !existingIds.has(item._id || item.regCode));
  
          return [...prevData, ...newData];
        });
  
        if (response.data.data.length < limit) {
          setHasMoreData(false);
        } else {
          setApiPage(pageNumber + 1);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setHasMoreData(false);
    }
  };
  
  /** 🔹 Fetch initial records on mount */
  useEffect(() => {
    fetchAllData(1, initialLimit);
  }, []);

  /** 🔹 Fetch remaining records */
  useEffect(() => {
    if (hasMoreData) {
      const interval = setInterval(() => {
        fetchAllData(apiPage, batchLimit, selectedLetter);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [hasMoreData, apiPage, selectedLetter]);

  /** 🔹 Handle Letter Click */
  const handleLetterClick = (letter) => {
    const selected = letter === "#" ? "" : letter;
    setSelectedLetter(selected);
    setCurrentPage(1);
    setApiPage(1);
    setAllData([]);
    setFilters({}); // ✅ Clear filters when switching letters
    setHasMoreData(true); // ✅ Reset to allow continuous fetching

    fetchAllData(1, selected === "" ? 5000 : initialLimit, selected);
  };

  /** 🔹 Get visible rows for pagination */
  const visibleData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage]);

  /** 🔹 Function to Highlight Matching Text (Fixed Undefined Error) */
  const highlightMatch = (text, search) => {
    if (!text || !search) return text; // ✅ Handle undefined values safely
    const lowerText = text.toString().toLowerCase();
    const lowerSearch = search.toLowerCase();

    if (!lowerText.includes(lowerSearch)) return text; // If no match, return normal text

    const parts = text.split(new RegExp(`(${search})`, "gi")); // Split on search term
    return parts.map((part, index) =>
      part.toLowerCase() === lowerSearch ? (
        <span key={index} className="highlight">{part}</span> // Wrap match in span
      ) : (
        part
      )
    );
  };

  return (
    <section className="patentDataSection">
      <div className="header-container">
          <div className="header-container1">
              <h2 style={{ color: "black" }}>
                All Patent Data ({totalRecords}) | Page {currentPage} of {totalPages}
              </h2>
            </div>
            <div className="global-search">
           
            <FaSearch 
              data-tooltip-id="search-tooltip" 
              className="search-icon" 
            />
            <Tooltip id="search-tooltip" place="top" content="Search the Data" />
            
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                />
            </div>
        </div>

      {/* 🔹 A-Z Filter */}
      <div className="alphabet-filter">
        {"#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <button
            key={letter}
            className={`letter-btn ${selectedLetter === letter ? "active" : ""}`}
            onClick={() => handleLetterClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Table Display */}
      <div className="table-container">
        <table className="user-table2">
        <thead>
          <tr>
            {Object.keys(headerMap).map((header, index) => (
              <th key={index}>
                {header}
                {index !== 0 && (
                  activeFilters[headerMap[header]] ? (
                    <FaTimes // Show "X" icon when filter is active
                      className="filter-icon active-filter"
                      onClick={() => handleFilterChange(header)}
                      data-tooltip-id="filter-tooltip"
                      data-tooltip-content="Remove Filters"
                    />
                  ) : (
                    <FaFilter // Show normal filter icon when no filter applied
                      className="filter-icon"
                      onClick={() => handleFilterChange(header)}
                      data-tooltip-id="filter-tooltip"
                      data-tooltip-content="Apply Filters"
                    />
                  )
                )}
              </th>
            ))}
          </tr>
        </thead>
        <Tooltip id="filter-tooltip" place="right" effect="solid" style={{zIndex:"1000", }}/>
        <tbody>
            {visibleData.map((data, index) => (
              <tr key={index} >

                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>

                {Object.values(headerMap).slice(1).map((key, colIndex) => (
                  <td 
                    key={colIndex}
                    data-tooltip-id="data-tooltip"
                    data-tooltip-content={`Name: ${data.name} \n Reg Code: ${data.regCode} \n Organization: ${data.organization}`}
                    style={{cursor:'pointer'}}
                  >
                      {highlightMatch(data[key], globalSearch)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <Tooltip 
            id="data-tooltip" 
            place="top" 
            effect="solid" 
            style={{ 
              zIndex: "1000", 
              backgroundColor: "black", /* Solid blue */
              color: "orange", 
              border: "1px solid blue",
              padding: "8px",
              fontWeight: "bold",
              fontSize: "18px",
              textAlign: "left",
              whiteSpace: "pre-line", /* Ensures line breaks */
            }} 
          />


        </table>
      </div>
      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>{"<<"}</button>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>

        <span>
          Page{"   "}
          <input
            className="paginationInputBox"
            type="number"
            value={currentPage}
            min="1"
            max={totalPages}
            onChange={(e) => setCurrentPage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
            onKeyDown={(e) => { 
              if (e.key === "Enter") {
                const page = Number(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                } else {
                  alert(`Please enter a number between 1 and ${totalPages}`);
                }
              }
            }}
          />
          {"   "}of {totalPages}
        </span>

        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>{">"}</button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>{">>"}</button>
      </div>

      {hasMoreData ? <p>Loading more data...</p> : <p>All data loaded.</p>}
    </section>
  );
};

export default AttorneyRoster;
