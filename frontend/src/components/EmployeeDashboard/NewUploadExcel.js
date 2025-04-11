import React, { useState } from "react";
import axios from "axios";
import "../../style/Components/EmployeeDashboard/NewUploadExcel.css";
import { useLocation } from "react-router-dom";

function NewUploadExcel({ onClose, userId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";
  const location = useLocation();
  const userId2 = location.state?.userId;
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", file);

    formData.append("userId", userId2); // ✅ from props only
    

    console.log("Sending userName:", userId2);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/upload-excel-dynamic`, formData, {
      // const res = await axios.post(`http://localhost:3001/api/upload-excel-dynamic`, formData, {
        
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "✅ Upload successful.");
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploadExcelModalOverlay">
      <div className="uploadExcelModal">
        <button className="uploadExcelCloseBtn" onClick={onClose}>X</button>
        <h2>Upload Excel File</h2>

        <div className="uploadExcelForm">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="uploadExcelInput"
          />
          <button onClick={handleUpload} className="uploadExcelBtn">
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {message && <p className="uploadExcelMessage">{message}</p>}
      </div>
    </div>
  );
}

export default NewUploadExcel;
