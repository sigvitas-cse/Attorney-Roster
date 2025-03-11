// Analysis.jsx
import React from "react";
import "../../style/pages/Analysis.css";
import LineChartComponent from "../Analysis/LineChartComponent";
import BarChartComponent from "../Analysis/BarChartComponent";
import PieChartComponent from "../Analysis/PieChartComponent";

const weeklyData = [
  // {
  //   week: "1st - 2nd Feb",
  //   totalProfiles: 52372,
  //   revisedProfiles: 834,
  //   removedProfiles: 2,
  //   newProfiles: 17,
  // },
  {
    week: "2nd - 3rd Feb",
    totalProfiles: 52384,
    revisedProfiles: 28,
    removedProfiles: 3,
    newProfiles: 15,
  },
  {
    week: "3rd - 4th Feb",
    totalProfiles: 52383,
    revisedProfiles: 28,
    removedProfiles: 2,
    newProfiles: 1,
  },
  {
    week: "4th Feb - 1st March",
    totalProfiles: 52420,
    revisedProfiles: 59,
    removedProfiles: 4,
    newProfiles: 41,
  },
  {
    week: "1st March - 2nd March",
    totalProfiles: 52447,
    revisedProfiles: 98,
    removedProfiles: 1,
    newProfiles: 28,
  },
];

// Prepare data for the Pie Chart by aggregating values across weeks
const getPieData = (data) => [
  { name: "Revised", value: data.reduce((acc, d) => acc + d.revisedProfiles, 0) },
  { name: "Removed", value: data.reduce((acc, d) => acc + d.removedProfiles, 0) },
  { name: "New", value: data.reduce((acc, d) => acc + d.newProfiles, 0) },
];

function Analysis() {
  const pieData = getPieData(weeklyData);

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
            <PieChartComponent data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
