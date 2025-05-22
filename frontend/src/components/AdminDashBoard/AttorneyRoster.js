import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "../../style/Components/AdminDashboard/AttorneyRoster.css";
import NewProfilesUpdated from "./IndivisualComponents/newProfiles";
import RemovedProfiles from "./IndivisualComponents/removedProfiles";
import NewProfilesUpdated2 from "./IndivisualComponents/updatedProfiles";
import AdminInsights from "./IndivisualComponents/AdminInsights";

import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // For Excel download
import jsPDF from "jspdf"; // For PDF download
import "jspdf-autotable"; // For table formatting in PDF

const AttorneyRoster = () => {
  const [allData, setAllData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [totalRecords, setTotalRecords] = useState(0);
  const [apiPage, setApiPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [filters, setFilters] = useState({});
  const [globalSearch, setGlobalSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [newProfilesUpdate, setNewProfilesUpdate] = useState(false);
  const [removedProfilesUpdate, setremovedProfilesUpdate] = useState(false);
  const [updatedProfiles, setUpdatedProfiles] = useState(false);
  const [adminInsights, setAdminInsights] = useState(false);

  const [searchField, setSearchField] = useState("name");
  // New states for checkbox functionality
  const [selectedRows, setSelectedRows] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

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
    "Download": "download", // New column for checkboxes
  };

  /** 🔹 Searchable Fields */
  const searchableFields = [
    { key: "name", label: "Name" },
    { key: "organization", label: "Organization" },
    { key: "city", label: "City" },
    { key: "regCode", label: "Reg Code" },
  ];

  /** 🔹 Handle Filter Change */
  const handleFilterChange = (columnHeader) => {
    const columnKey = headerMap[columnHeader];
    if (!columnKey || columnKey === "download") return;

    if (filters[columnKey]) {
      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        delete newFilters[columnKey];
        return newFilters;
      });

      setActiveFilters((prevActiveFilters) => {
        const newActiveFilters = { ...prevActiveFilters };
        delete newActiveFilters[columnKey];
        return newActiveFilters;
      });

      return;
    }

    const value = prompt(`Filter by ${columnHeader}:`);
    if (value !== null) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [columnKey]: value.trim().toLowerCase(),
      }));

      setActiveFilters((prevActiveFilters) => ({
        ...prevActiveFilters,
        [columnKey]: true,
      }));
    }
  };

  /** 🔹 Apply Filters & Field-Specific Search */
  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      const matchesFilters = Object.entries(filters).every(([key, value]) =>
        row[key]?.toString().toLowerCase().includes(value)
      );

      const matchesGlobalSearch = globalSearch
        ? row[searchField]?.toString().toLowerCase().includes(globalSearch.toLowerCase())
        : true;

      return matchesFilters && matchesGlobalSearch;
    });
  }, [allData, filters, globalSearch, searchField]);

  const initialLimit = 5000;
  const batchLimit = 1000;
  const rowsPerPage = 500;
  const downloadLimit = 5; // Enforce a strict limit of 5 rows for download

  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";

  const totalPages = totalRecords ? Math.ceil(totalRecords / rowsPerPage) : 1;

  /** 🔹 Fetch Data from Backend */
  const fetchAllData = async (pageNumber, limit, letter = "") => {
    try {
      const response = await axios.get(`${API_URL}/api/all-users-data`, {
      // const response = await axios.get("http://localhost:3001/api/all-users-data", {
        params: { page: pageNumber, limit, letter },
      });

      const updatedResponse = await axios.get(`${API_URL}/api/updatedprofilescomparisons`);
      // const updatedResponse = await axios.get("http://localhost:3001/api/updatedprofilescomparisons");

      if (response.status === 200 && updatedResponse.status === 200) {
        const updatedProfiles = new Set(
          updatedResponse.data.map((item) => item.regCode?.trim()?.toLowerCase())
        );

        setTotalRecords(response.data.totalUsers);

        setAllData((prevData) => {
          const existingIds = new Set(prevData.map((item) => item._id || item.regCode));
          const newData = response.data.data.filter((item) => !existingIds.has(item._id || item.regCode));

          const updatedAllData = [...prevData, ...newData].map((item) => {
            const isUpdated = updatedProfiles.has(item.regCode?.trim()?.toLowerCase());
            const changes = updatedResponse.data.find((changeItem) => changeItem.regCode === item.regCode)?.changes || {};
            return { ...item, isUpdated, changes };
          });

          return updatedAllData;
        });

        if (response.data.data.length < limit) {
          setHasMoreData(false);
        } else {
          setApiPage(pageNumber + 1);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
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
    setFilters({});
    setHasMoreData(true);
    setSelectedRows([]); // Reset selected rows
    setShowOptions(false); // Hide options
    fetchAllData(1, selected === "" ? 5000 : initialLimit, selected);
  };

  /** 🔹 Get visible rows for pagination */
  const visibleData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage]);

  /** 🔹 Function to Highlight Matching Text */
  const highlightMatch = (text, search) => {
    if (!text || !search) return text;
    const lowerText = text.toString().toLowerCase();
    const lowerSearch = search.toLowerCase();

    if (!lowerText.includes(lowerSearch)) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === lowerSearch ? (
        <span key={index} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  /** 🔹 Handle Checkbox Change */
  const handleCheckboxChange = (regCode) => {
    setSelectedRows((prev) => {
      if (prev.includes(regCode)) {
        const newSelection = prev.filter((id) => id !== regCode);
        setShowOptions(newSelection.length > 0);
        return newSelection;
      } else {
        const newSelection = [...prev, regCode];
        setShowOptions(true);
        return newSelection;
      }
    });
  };

  /** 🔹 Handle Select All Checkbox */
  const handleSelectAll = () => {
    if (selectedRows.length === visibleData.length) {
      setSelectedRows([]);
      setShowOptions(false);
    } else {
      const allRegCodes = visibleData.map((data) => data.regCode);
      setSelectedRows(allRegCodes);
      setShowOptions(true);
    }
  };

  /** 🔹 Handle Preview */
  const handlePreview = () => {
    setShowPreview(true);
  };

  /** 🔹 Handle Download */
  const handleDownload = () => {
    // Always check if selectedRows exceed the download limit
    if (selectedRows.length > downloadLimit) {
      setShowLimitWarning(true);
    } else {
      setShowFormatModal(true);
    }
  };

  /** 🔹 Download Excel */
  const downloadExcel = (dataToDownload) => {
    const worksheet = XLSX.utils.json_to_sheet(
      dataToDownload.map((row) =>
        Object.keys(headerMap)
          .filter((key) => key !== "download" && key !== "S. No.")
          .reduce((obj, key) => {
            obj[key] = row[headerMap[key]] || "";
            return obj;
          }, {})
      )
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AttorneyRoster");
    XLSX.writeFile(workbook, "AttorneyRoster.xlsx");
  };

  /** 🔹 Download PDF */
  const downloadPDF = (dataToDownload) => {
    const doc = new jsPDF();
    const tableColumn = Object.keys(headerMap).filter((key) => key !== "download" && key !== "S. No.");
    const tableRows = dataToDownload.map((row) =>
      Object.keys(headerMap)
        .filter((key) => key !== "download" && key !== "S. No.")
        .map((key) => row[headerMap[key]] || "")
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      margin: { top: 10 },
    });
    doc.save("AttorneyRoster.pdf");
  };

  /** 🔹 Handle Format Selection */
  const handleFormatSelection = (format) => {
    setDownloadFormat(format);
    setShowFormatModal(false);

    // Always limit to the first 5 selected rows
    const dataToDownload = visibleData
      .filter((data) => selectedRows.includes(data.regCode))
      .slice(0, downloadLimit);

    if (format === "excel") {
      downloadExcel(dataToDownload);
    } else if (format === "pdf") {
      downloadPDF(dataToDownload);
    }

    setShowLimitWarning(false);
  };

  /** 🔹 Handle Limit Warning Download */
  const handleLimitDownload = () => {
    setShowLimitWarning(false);
    setShowFormatModal(true);
  };

  

  // 🔹 Define the keys to exclude from the preview table
  const excludedKeys = ["download", "slNo"];

  return (
    <section className="patentDataSection">
      <div className="header-container">
        <div className="header-container1">
          <h2 style={{ color: "black" }}>
            All Patent Data ({totalRecords}) | Page {currentPage} of {totalPages}
          </h2>
        </div>
        <div className="global-search">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="search-field-select"
            data-tooltip-id="field-tooltip"
            data-tooltip-content="Select field to search"
          >
            {searchableFields.map((field) => (
              <option key={field.key} value={field.key}>
                {field.label}
              </option>
            ))}
          </select>
          <Tooltip id="field-tooltip" place="top" effect="solid" />
          <FaSearch
            data-tooltip-id="search-tooltip"
            className="search-iconn"
          />
          <Tooltip id="search-tooltip" place="top" content="Search the Data" />
          <input
            type="text"
            placeholder={`Search ${searchField}...`}
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
        <div className="datasections13">
          <p>
            <button className="newprofiles13" onClick={() => setNewProfilesUpdate(true)}>
              New Profiles
            </button>
          </p>
          {newProfilesUpdate && (
            <NewProfilesUpdated onClick={() => setNewProfilesUpdate(false)} />
          )}
          <p>
            <button className="removedprofiles13" onClick={() => setremovedProfilesUpdate(true)}>
              Removed Profiles
            </button>
          </p>
          {removedProfilesUpdate && (
            <RemovedProfiles onClick={() => setremovedProfilesUpdate(false)} />
          )}
          <p>
            <button className="updatedrofiles13" onClick={() => setUpdatedProfiles(true)}>
              Updated Profiles
            </button>
          </p>
          {updatedProfiles && (
            <NewProfilesUpdated2 onClick={() => setUpdatedProfiles(false)} />
          )}
          <p>
            <button className="newprofiles13" onClick={() => setAdminInsights(true)}>
              Know Insights
            </button>
          </p>
          {adminInsights && (
            <AdminInsights onClick={() => setAdminInsights(false)} />
          )}
        </div>
      </div>

      {/* 🔹 Download/Preview Options */}
      {showOptions && (
        <div className="download-options">
          <p>
            If you want to download more than 5 profiles data then you can contact at{" "}
            <a href="mailto:support@triangleip.com">support@triangleip.com</a>
          </p>
          <button onClick={handlePreview}>Preview</button>
          <button onClick={handleDownload}>Download</button>
        </div>
      )}

      {/* 🔹 Preview Modal */}
      {showPreview && (
        <div className="modal">
          <div className="modal-content">
            <FaTimes
              className="modal-close-icon"
              onClick={() => setShowPreview(false)}
              data-tooltip-id="close-tooltip"
              data-tooltip-content="Close Preview"
            />
            <Tooltip id="close-tooltip" place="top" effect="solid" />
            <h3>Preview Selected Data (Showing up to {downloadLimit} rows)</h3>
            <div className="preview-table-container">
              <table className="preview-table">
                <thead>
                  <tr>
                    {Object.keys(headerMap)
                      .filter((key) => !excludedKeys.includes(headerMap[key]))
                      .map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleData
                    .filter((data) => selectedRows.includes(data.regCode))
                    .slice(0, downloadLimit) // Limit to first 5 rows in preview
                    .map((data, index) => (
                      <tr key={index}>
                        {Object.keys(headerMap)
                          .filter((key) => !excludedKeys.includes(headerMap[key]))
                          .map((key, colIndex) => (
                            <td key={colIndex}>
                              {headerMap[key] === "linkedInProfile" && data[headerMap[key]] ? (
                                <a href={data[headerMap[key]]} target="_blank" rel="noopener noreferrer">
                                  {data[headerMap[key]]}
                                </a>
                              ) : (
                                data[headerMap[key]] || ""
                              )}
                            </td>
                          ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setShowPreview(false)}>Close</button>
          </div>
        </div>
      )}

      {/* 🔹 Format Selection Modal */}
      {showFormatModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Download Format</h3>
            <button onClick={() => handleFormatSelection("excel")}>Excel</button>
            <button onClick={() => handleFormatSelection("pdf")}>PDF</button>
            <button onClick={() => setShowFormatModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* 🔹 Limit Warning Modal */}
      {showLimitWarning && (
        <div className="modal">
          <div className="modal-content">
            <h3>Download Limit Exceeded</h3>
            <p>
              You can download only {downloadLimit} rows at a time. If you need to download more, please contact{" "}
              <a href="mailto:support@triangleip.com">support@triangleip.com</a>.
            </p>
            <button onClick={handleLimitDownload}>Download (First {downloadLimit} Rows)</button>
            <button onClick={() => setShowLimitWarning(false)}>Cancel</button>
          </div>
        </div>
      )}

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
                <th key={index} className={header === "Download" ? "column-download" : `column-${headerMap[header]}`}>
                  {header === "Download" ? (
                    <input
                      type="checkbox"
                      checked={selectedRows.length === visibleData.length && visibleData.length > 0}
                      onChange={handleSelectAll}
                    />
                  ) : (
                    <>
                      {header}
                      {index !== 0 && header !== "Download" && (
                        activeFilters[headerMap[header]] ? (
                          <FaTimes
                            className="filter-icon active-filter"
                            onClick={() => handleFilterChange(header)}
                            data-tooltip-id="filter-tooltip"
                            data-tooltip-content="Remove Filters"
                          />
                        ) : (
                          <FaFilter
                            className="filter-icon"
                            onClick={() => handleFilterChange(header)}
                            data-tooltip-id="filter-tooltip"
                            data-tooltip-content="Apply Filters"
                          />
                        )
                      )}
                    </>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <Tooltip id="filter-tooltip" place="right" effect="solid" style={{ zIndex: "1000" }} />
          <tbody>
            {visibleData.map((data, index) => (
              <tr
                key={index}
                className={data.isUpdated ? "highlight-updated" : ""}
                onClick={() => console.log("Row Clicked - regCode:", data.regCode, "isUpdated:", data.isUpdated)}
              >
                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                {Object.values(headerMap).slice(1).map((key, colIndex) => (
                  <td
                    key={colIndex}
                    className={key === "download" ? "column-download" : `column-${key}`}
                    data-tooltip-id="data-tooltip"
                    data-tooltip-content={
                      data.isUpdated
                        ? `Name: ${data.name} \n Reg Code: ${data.regCode} \n` +
                          Object.keys(data.changes)
                            .map((field) => {
                              const change = data.changes[field];
                              return `${field}:\n Old: ${change.oldValue}, New: ${change.newValue}`;
                            })
                            .join("\n")
                        : `Name: ${data.name} \n Reg Code: ${data.regCode} \n ${headerMap[key] || key}: ${data[key]}`
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {key === "download" ? (
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(data.regCode)}
                        onChange={() => handleCheckboxChange(data.regCode)}
                        onClick={(e) => e.stopPropagation()} // Prevent row click
                      />
                    ) : key === "linkedInProfile" && data[key] ? (
                      <a
                        href={data[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#007bff", textDecoration: "none" }}
                        onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                        onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                      >
                        {highlightMatch(data[key], globalSearch)}
                      </a>
                    ) : (
                      highlightMatch(data[key], globalSearch)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <Tooltip
            id="data-tooltip"
            place="left"
            effect="solid"
            style={{
              zIndex: "1000",
              backgroundColor: "black",
              color: "yellow",
              border: "1px solid blue",
              padding: "8px",
              fontWeight: "bold",
              fontSize: "18px",
              textAlign: "left",
              whiteSpace: "pre-line",
            }}
          />
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          {"<<"}
        </button>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          {"<"}
        </button>
        <span>
          Page{" "}
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
          {" "}of {totalPages}
        </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          {">"}
        </button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
          {">>"}
        </button>
      </div>
      {hasMoreData ? <p>Loading more data...</p> : <p>All data loaded.</p>}
    </section>
  );
};

export default AttorneyRoster;