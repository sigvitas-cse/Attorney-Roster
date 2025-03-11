import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { BarChart, Bar } from "recharts";
import "../style/Components/Analysis/analysisCopy.css";

// Function to generate new random data
const generateData = () => [
  { name: "A", Country: Math.floor(Math.random() * 500), State: Math.floor(Math.random() * 200), Data: Math.floor(Math.random() * 400)},
  { name: "B", Country: Math.floor(Math.random() * 500), State: Math.floor(Math.random() * 200), Data: Math.floor(Math.random() * 400) },
  { name: "C", Country: Math.floor(Math.random() * 500), State: Math.floor(Math.random() * 200), Data: Math.floor(Math.random() * 400) },
  { name: "D", Country: Math.floor(Math.random() * 500), State: Math.floor(Math.random() * 200), Data: Math.floor(Math.random() * 400) },
  { name: "E", Country: Math.floor(Math.random() * 500), State: Math.floor(Math.random() * 200), Data: Math.floor(Math.random() * 400) },
  { name: "F", Country: Math.floor(Math.random() * 500), State: Math.floor(Math.random() * 200), Data: Math.floor(Math.random() * 400) },
  { name: "G", Country: Math.floor(Math.random() * 500), State: Math.floor(Math.random() * 200), Data: Math.floor(Math.random() * 400) },
];

const COLORS = ["#8884d8", "#82ca9d", "hsl(200, 100%, 50%)"];

function AnalysisCopy() {
  const [data, setData] = useState(generateData());

  // Refresh graph completely every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData()); // Generates new dataset
    }, 2000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const pieData = [
    { name: "Country", value: data.reduce((acc, item) => acc + item.Country, 0)},
    { name: "State", value: data.reduce((acc, item) => acc + item.State, 0)},
    { name: "Data", value: data.reduce((acc, item) => acc + item.State, 0)},
];

  return (
    <div className="homeBody">
    <div className="App">
      
      {/* Line Chart (Full Width) */}
      <div className="dataCard1">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Country" stroke="#8884d8" strokeWidth={3} />
            <Line type="monotone" dataKey="State" stroke="#82ca9d" strokeWidth={3} />
            {/* <Line type="monotone" dataKey="Data" stroke="#FF5733" strokeWidth={3} />
            <Line type="monotone" dataKey="Data" stroke="rgb(0, 128, 255)" strokeWidth={3} /> */}
            <Line type="monotone" dataKey="Data" stroke="hsl(200, 100%, 50%)" strokeWidth={3} />



          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart and Pie Chart in 2:1 Ratio */}
      <div className="dataContainer">
        
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Country" fill="#8884d8" />
              <Bar dataKey="State" fill="#82ca9d" />
              <Bar dataKey="Data" fill="hsl(200, 100%, 50%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dataCard3">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
    </div>
  );
}

export default AnalysisCopy;
