import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for API calls
import "../../style/pages/Analysis.css";
import LineChartComponent from "../Analysis/LineChartComponent";
import BarChartComponent from "../Analysis/BarChartComponent";
import PieChartComponent from "../Analysis/PieChartComponent";

function Analysis() {
  const [weeklyData, setWeeklyData] = useState([]); // State to store analysis data
  const [monthlyData, setMonthlyData] = useState([]);
  const [displayMode, setDisplayMode] = useState("weekly"); // Track weekly or monthly
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "https://roster1.sigvitas.com";

  // Fetch data from the backend
  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/analysis`);
        // const response = await axios.get("http://localhost:3001/api/analysis"); // Change URL in production
        const formattedData = response.data.map((item) => ({
          week: new Date(item.timestamp).toLocaleDateString(), // Convert timestamp to readable date
          totalProfiles: item.total,
          revisedProfiles: item.updated,
          removedProfiles: item.removed,
          newProfiles: item.new,
          month: new Date(item.timestamp).toLocaleString("default", { month: "short", year: "numeric" }),
        }));
        // setWeeklyData(formattedData); //this gives all records
        setWeeklyData(formattedData.slice(-4));

        // Group data by month for monthly analysis
        // const groupedMonthlyData = formattedData.reduce((acc, item) => {
        //   const existingMonth = acc.find((data) => data.month === item.month);
        //   if (existingMonth) {
        //     existingMonth.totalProfiles = item.total;
        //     existingMonth.revisedProfiles += item.revisedProfiles;
        //     existingMonth.removedProfiles += item.removedProfiles;
        //     existingMonth.newProfiles += item.newProfiles;
        //   } else {
        //     acc.push({ ...item });
        //   }
        //   return acc;
        // }, []);

        const groupedMonthlyData = formattedData.reduce((acc, item) => {
          const existingMonth = acc.find((data) => data.month === item.month);
        
          if (existingMonth) {
            // Sum up the updates, removed, and new profiles
            existingMonth.revisedProfiles += item.revisedProfiles;
            existingMonth.removedProfiles += item.removedProfiles;
            existingMonth.newProfiles += item.newProfiles;
        
            // Ensure totalProfiles is from the last recorded week of the month
            if (new Date(item.timestamp) > new Date(existingMonth.latestTimestamp)) {
              existingMonth.totalProfiles = item.total; // Update only if this is the latest week
              existingMonth.latestTimestamp = item.timestamp;
            }
          } else {
            // Store the first occurrence with its timestamp
            acc.push({ 
              ...item, 
              latestTimestamp: item.timestamp 
            });
          }
          return acc;
        }, []).map(({ latestTimestamp, ...rest }) => rest); // Remove latestTimestamp before storing
        

        setMonthlyData(groupedMonthlyData);

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch analysis data");
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  // Prepare data for Pie Chart
  const getPieData = (data) => [
    { name: "Revised", value: data.reduce((acc, d) => acc + d.revisedProfiles, 0) },
    { name: "Removed", value: data.reduce((acc, d) => acc + d.removedProfiles, 0) },
    { name: "New", value: data.reduce((acc, d) => acc + d.newProfiles, 0) },
  ];

  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const displayedData = displayMode === "weekly" ? weeklyData : monthlyData;

  return (
    <div className="analysis-page">
      <div>
      <button
        className={`weeklyData ${displayMode === "weekly" ? "active" : ""}`}
        onClick={() => setDisplayMode("weekly")}
        data-tooltip="View weekly analysis"
      >
        Weekly Data
      </button>

      <button
        className={`weeklyData ${displayMode === "monthly" ? "active" : ""}`}
        onClick={() => setDisplayMode("monthly")}
        data-tooltip="View monthly analysis"
      >
        Monthly Data
      </button>
      </div>
      <div className="App">
        <div className="dataCard1">
        <h3>Profile Updates Over {displayMode === "weekly" ? "Weeks" : "Months"}</h3>
          <LineChartComponent data={displayedData} />
        </div>

        <div className="dataContainer">
          <div className="chart-container">
          <h3>Profile Changes Per {displayMode === "weekly" ? "Week" : "Month"}</h3>
            <BarChartComponent data={displayedData} />
          </div>

          <div className="dataCard3">
            <h3>Total Changes Distribution</h3>
            <PieChartComponent data={getPieData(displayedData)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
