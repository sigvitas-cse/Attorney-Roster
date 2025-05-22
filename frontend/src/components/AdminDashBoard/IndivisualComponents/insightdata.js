import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../style/Components/AdminDashboard/IndivisualComponents/Insights.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const InsightsData = ({ onClick }) => {
  const [insights, setInsights] = useState(null);
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    document.title = "Data Insights - Patent Analyst Dashboard";
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/insights`);
    //   const response = await axios.get("http://localhost:3001/api/insights");
      
      setInsights(response.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch insights';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const insightPages = [
    {
      id: 'overview-chart',
      title: 'Overview Chart',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Change Distribution</h2>
          {insights && (
            <Pie
              data={{
                labels: ['Name Changes', 'Address Changes', 'Organization Changes'],
                datasets: [{
                  label: 'Change Types',
                  data: [
                    insights.nameChanges,
                    insights.addressChanges,
                    insights.organizationChanges
                  ],
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                  borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                  borderWidth: 1
                }]
              }}
              options={{
                plugins: {
                  legend: { display: true, position: 'top' },
                  title: {
                    display: true,
                    text: 'Distribution of Name, Address, and Organization Changes'
                  }
                }
              }}
            />
          )}
        </div>
      )
    },
    {
      id: 'organization-changes',
      title: 'Organization Changes',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Number of Organization Changes</h2>
          <p className="insight-text">Total: {insights?.organizationChanges || 0}</p>
        </div>
      )
    },
    {
      id: 'organization-movers',
      title: 'Who Moved Organizations or Changed Names',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">People Who Changed Organizations or Names</h2>
          {insights?.organizationMovers?.length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>Reg Code</th>
                  <th>Old Name</th>
                  <th>New Name</th>
                  <th>Old Organization</th>
                  <th>New Organization</th>
                </tr>
              </thead>
              <tbody>
                {insights.organizationMovers.map((mover, index) => (
                  <tr key={index} className="table-row">
                    <td>{mover.regCode}</td>
                    <td>{mover.changes.Name ? mover.changes.Name.oldValue : mover.name}</td>
                    <td>{mover.changes.Name ? mover.changes.Name.newValue : mover.name}</td>
                    <td>{mover.changes['Organization/Law Firm Name']?.oldValue || 'N/A'}</td>
                    <td>{mover.changes['Organization/Law Firm Name']?.newValue || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="insight-text">No organization or name changes found.</p>
          )}
        </div>
      )
    },
    {
      id: 'agent-to-attorney',
      title: 'Agent to Attorney Transitions',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Agents Who Became Attorneys</h2>
          <p className="insight-text">Total: {insights?.agentToAttorneyCount || 0}</p>
        </div>
      )
    },
    {
      id: 'company-leavers',
      title: 'Company Leavers',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">People Who Left Companies</h2>
          {insights?.companyLeavers?.length > 0 ? (
            insights.companyLeavers.map((company, index) => (
              <div key={index} className="company-section">
                <h3 className="company-title">Company: {company.company}</h3>
                <p className="insight-text">Number of leavers: {company.count}</p>
                <table className="insight-table">
                  <thead>
                    <tr className="table-header">
                      <th>Reg Code</th>
                      <th>Old Name</th>
                      <th>New Name</th>
                      <th>New Organization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.people.map((person, i) => (
                      <tr key={i} className="table-row">
                        <td>{person.regCode}</td>
                        <td>{person.nameChanged ? person.nameChanged.oldValue : person.name}</td>
                        <td>{person.nameChanged ? person.nameChanged.newValue : person.name}</td>
                        <td>{person.newOrganization}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p className="insight-text">No company leavers found.</p>
          )}
        </div>
      )
    },
    {
      id: 'address-changes',
      title: 'Address Changes',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Number of Address Changes</h2>
          <p className="insight-text">Total: {insights?.addressChanges || 0}</p>
        </div>
      )
    },
    {
      id: 'name-changes',
      title: 'Name Changes',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Number of Name Changes</h2>
          <p className="insight-text">Total: {insights?.nameChanges || 0}</p>
        </div>
      )
    }
  ];

  const handleSelectInsight = (index) => {
    setSelectedInsightIndex(index);
  };

  if (loading) return <div className="status-text">Loading...</div>;
  if (error) return <div className="status-text error-text">Error: {error}</div>;
  if (!insights) return <div className="status-text">No data available</div>;

  return (
    <div className="insights-modal">
      <div className="insights-center">
        <button className="close-btn" onClick={onClick}>X</button>
        <h2>Data Insights [{insightPages.length}]</h2>
        <div className="insights-content-container">
          <div className="insights-content">
            <div className="notes-sidebar">
              <h2 className="notes-sidebar-title">All Insights</h2>
              {insightPages.length === 0 ? (
                <p className="notes-empty">No insights available.</p>
              ) : (
                <ol className="notes-list">
                  {insightPages.map((insight, index) => (
                    <li
                      key={insight.id}
                      className={`notes-item ${selectedInsightIndex === index ? "notes-item-selected" : ""}`}
                      onClick={() => handleSelectInsight(index)}
                    >
                      <div className="notes-item-content">
                        <span className="notes-item-title">{insight.title}</span>
                      </div>
                      <p className="notes-item-date">
                        {new Date().toLocaleString()} {/* Static date for consistency */}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <div className="notes-editor">
              <h3 className="notes-title-input">{insightPages[selectedInsightIndex].title}</h3>
              <div className="insight-content-area">
                {insightPages[selectedInsightIndex].render()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default InsightsData;