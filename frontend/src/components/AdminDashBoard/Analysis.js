import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for API calls
import "../../style/pages/Analysis.css";
import LineChartComponent from "../Analysis/LineChartComponent";
import BarChartComponent from "../Analysis/BarChartComponent";
import PieChartComponent from "../Analysis/PieChartComponent";

function Analysis() {
  const [weeklyData, setWeeklyData] = useState([]); // State to store analysis data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/analysis"); // Change URL in production
        const formattedData = response.data.map((item) => ({
          week: new Date(item.timestamp).toLocaleDateString(), // Convert timestamp to readable date
          totalProfiles: item.total,
          revisedProfiles: item.updated,
          removedProfiles: item.removed,
          newProfiles: item.new,
        }));
        // setWeeklyData(formattedData); //this gives all records
        setWeeklyData(formattedData.slice(-4));
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

  return (
    <div className="analysis-page">
      <div className="App">
        <div className="dataCard1">
          <h3>Profile Updates Over Weeks</h3>
          <LineChartComponent data={weeklyData} />
        </div>

        <div className="dataContainer">
          <div className="chart-container">
            <h3>Profile Changes Per Week</h3>
            <BarChartComponent data={weeklyData} />
          </div>

          <div className="dataCard3">
            <h3>Total Changes Distribution</h3>
            <PieChartComponent data={getPieData(weeklyData)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
