import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../style/Components/AdminDashboard/IndivisualComponents/Insights.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const InsightsData = ({ onClick }) => {
  const [insights, setInsights] = useState(null);
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // Manage body scroll lock
  useEffect(() => {
    document.body.classList.add('modal-open');
    document.title = "Data Insights - Patent Analyst Dashboard";
    fetchInsights();

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/insights`);
      // const response = await axios.get("http://localhost:3001/api/insights");

      setInsights(response.data);
      setLoading(false);
      console.log('API Response:', response.data);
      console.log('organizationMovers:', response.data.organizationMovers);
      console.log('nameChanges:', response.data.nameChanges);
      console.log('organizationChanges:', response.data.organizationChanges);
      console.log('addressChanges:', response.data.addressChanges);
      console.log('phoneChanges:', response.data.phoneChanges);
      console.log('statusChanges:', response.data.statusChangeDetails);
      console.log('changesByState:', response.data.changesByState);
      if (response.data.statusChanges > 0 && (!response.data.statusChangeDetails || response.data.statusChangeDetails.length === 0)) {
        console.warn(`Mismatch: statusChanges is ${response.data.statusChanges}, but statusChangeDetails is empty or missing`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch insights';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  // Derive Top Movers (people with multiple changes)
  const topMovers = insights?.organizationMovers?.filter(mover => 
    Object.keys(mover.changes).length > 1
  ) || [];

  // Derive All Organizations
  const allOrganizations = () => {
    const orgSet = new Set();
    const normalizeName = (name) => {
      if (!name || typeof name !== 'string') return null;
      return name.trim().toLowerCase()
        .replace(/[,;&]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/llp/g, 'llp')
        .replace(/p\.c\./g, 'pc');
    };

    insights?.topOrganizations?.forEach(org => {
      const normalized = normalizeName(org.organization);
      if (normalized && normalized !== 'none-retired' && !/attorney at law|consulting|pllc|llc$/.test(normalized)) {
        orgSet.add(org.organization);
      }
    });

    insights?.companyLeavers?.forEach(company => {
      const normalized = normalizeName(company.company);
      if (normalized && normalized !== 'none-retired' && !/attorney at law|consulting|pllc|llc$/.test(normalized)) {
        orgSet.add(company.company);
      }
    });

    insights?.organizationMovers?.forEach(mover => {
      const oldOrg = mover.changes['Organization/Law Firm Name']?.oldValue;
      const newOrg = mover.changes['Organization/Law Firm Name']?.newValue;
      [oldOrg, newOrg].forEach(org => {
        const normalized = normalizeName(org);
        if (normalized && normalized !== 'none-retired' && !/attorney at law|consulting|pllc|llc$/.test(normalized)) {
          orgSet.add(org);
        }
      });
    });

    return Array.from(orgSet).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  };

  // Derive Change Counts for Summary using backend counts
  const getChangeCounts = () => ({
    Name: insights?.nameChanges || 0,
    Organization: insights?.organizationChanges || 0,
    Address: insights?.addressChanges || 0,
    'Phone Number': insights?.phoneChanges || 0,
    Status: insights?.statusChanges || 0
  });

  // Derive Specific Changes
  const nameChanges = insights?.organizationMovers?.filter(mover => mover.changes.Name) || [];
  const orgChanges = insights?.organizationMovers?.filter(mover => mover.changes['Organization/Law Firm Name']) || [];
  const addressChanges = insights?.organizationMovers?.filter(mover => 
    mover.changes['Address Line 1'] || mover.changes['Address Line 2'] || 
    mover.changes.City || mover.changes.State || 
    mover.changes.Country || mover.changes.Zipcode
  ) || [];
  const phoneChanges = insights?.organizationMovers?.filter(mover => mover.changes['Phone Number']) || [];

  const insightPages = [
    {
      id: 'summary-totals',
      title: 'Summary of Totals',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Summary of Changes</h2>
          {Object.keys(getChangeCounts()).length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>Field</th>
                  <th>Number of Changes</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(getChangeCounts()).map(([field, count], index) => (
                  <tr key={index} className="table-row">
                    <td>{field}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="insight-text">No changes found.</h3>
          )}
        </div>
      )
    },
    {
      id: 'overview-chart',
      title: 'Change Distribution',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Change Distribution</h2>
          {insights ? (
            <div className="pie-chart-container" style={{ width: '550px', height: '550px', margin: '0 auto' }}>
              <Pie
                data={{
                  labels: Object.keys(getChangeCounts()),
                  datasets: [{
                    label: 'Change Types',
                    data: Object.values(getChangeCounts()),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: true, position: 'top' },
                    title: {
                      display: true,
                      text: 'Distribution of Changes',
                      font: { size: 14 }
                    }
                  }
                }}
                width={300}
                height={300}
              />
            </div>
          ) : (
            <h3 className="insight-text">No change distribution data available.</h3>
          )}
        </div>
      )
    },
    {
      id: 'changes-by-state',
      title: 'Changes by State',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Changes by State</h2>
          {insights?.changesByState?.length > 0 ? (
            <div className="bar-chart-container" style={{ width: '400px', height: '300px', margin: '0 auto' }}>
              <Bar
                data={{
                  labels: insights.changesByState.map(item => item.state || 'Unknown'),
                  datasets: [{
                    label: 'Number of Changes',
                    data: insights.changesByState.map(item => item.count),
                    backgroundColor: '#FFCE56',
                    borderColor: '#FFCE56',
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Number of Changes' }
                    },
                    x: {
                      title: { display: true, text: 'State' }
                    }
                  },
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: 'Changes by State',
                      font: { size: 14 }
                    }
                  }
                }}
                width={400}
                height={300}
              />
            </div>
          ) : (
            <h3 className="insight-text">No changes by state found.</h3>
          )}
        </div>
      )
    },
    {
      id: 'top-organizations',
      title: 'Top Organizations with Changes',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Top Organizations with Changes</h2>
          {insights?.topOrganizations?.length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>Organization</th>
                  <th>Number of Changes</th>
                </tr>
              </thead>
              <tbody>
                {insights.topOrganizations.map((org, index) => (
                  <tr key={index} className="table-row">
                    <td>{org.organization}</td>
                    <td>{org.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="insight-text">No organization changes found.</h3>
          )}
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
                <h3 className="insight-text">Total Leavers: {company.count}</h3>
                <table className="insight-table">
                  <thead>
                    <tr className="table-header">
                      <th>Reg Code</th>
                      <th>Name</th>
                      <th>Name Change</th>
                      <th>New Organization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.people.map((person, i) => (
                      <tr key={i} className="table-row">
                        <td>{person.regCode}</td>
                        <td>{person.name}</td>
                        <td>
                          {person.nameChanged
                            ? `${person.nameChanged.oldValue} → ${person.nameChanged.newValue}`
                            : 'No change'}
                        </td>
                        <td>{person.newOrganization || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <h3 className="insight-text">No company leavers found.</h3>
          )}
        </div>
      )
    },
    {
      id: 'top-movers',
      title: 'Top Movers',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">People with Multiple Changes</h2>
          {topMovers.length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>Reg Code</th>
                  <th>Name</th>
                  <th>Changed Fields</th>
                </tr>
              </thead>
              <tbody>
                {topMovers.map((mover, index) => (
                  <tr key={index} className="table-row">
                    <td>{mover.regCode}</td>
                    <td>{mover.name}</td>
                    <td>
                      {Object.keys(mover.changes)
                        .map(field => 
                          field === 'Organization/Law Firm Name' ? 'Organization' :
                          field === 'Phone Number' ? 'Phone Number' :
                          ['Address Line 1', 'Address Line 2', 'City', 'State', 'Country', 'Zipcode'].includes(field) ? 'Address' :
                          field
                        )
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="insight-text">No individuals with multiple changes found.</h3>
          )}
        </div>
      )
    },
    {
      id: 'name-changes',
      title: 'Name Changes',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Name Changes</h2>
          <h3 className="insight-text">Total: {nameChanges.length}</h3>
          {nameChanges.length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>Reg Code</th>
                  <th>Old Name</th>
                  <th>New Name</th>
                </tr>
              </thead>
              <tbody>
                {nameChanges.map((mover, index) => (
                  <tr key={index} className="table-row">
                    <td>{mover.regCode}</td>
                    <td>{mover.changes.Name.oldValue || 'N/A'}</td>
                    <td>{mover.changes.Name.newValue || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="insight-text">No name changes found.</h3>
          )}
        </div>
      )
    },
    {
      id: 'organization-changes',
      title: 'Organization Changes',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Organization Changes</h2>
          <h3 className="insight-text">Total: {orgChanges.length}</h3>
          {orgChanges.length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>Reg Code</th>
                  <th>Name</th>
                  <th>Old Organization</th>
                  <th>New Organization</th>
                </tr>
              </thead>
              <tbody>
                {orgChanges.map((mover, index) => (
                  <tr key={index} className="table-row">
                    <td>{mover.regCode}</td>
                    <td>{mover.name}</td>
                    <td>{mover.changes['Organization/Law Firm Name'].oldValue || 'N/A'}</td>
                    <td>{mover.changes['Organization/Law Firm Name'].newValue || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="insight-text">No organization changes found.</h3>
          )}
        </div>
      )
    },
    {
      id: 'address-changes',
      title: 'Address Changes',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Address Changes</h2>
          <h3 className="insight-text">Total: {addressChanges.length}</h3>
          {addressChanges.length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>Reg Code</th>
                  <th>Name</th>
                  <th>Old Address</th>
                  <th>New Address</th>
                </tr>
              </thead>
              <tbody>
                {addressChanges.map((mover, index) => (
                  <tr key={index} className="table-row">
                    <td>{mover.regCode}</td>
                    <td>{mover.name}</td>
                    <td>
                      {[
                        mover.changes['Address Line 1']?.oldValue,
                        mover.changes['Address Line 2']?.oldValue,
                        mover.changes.City?.oldValue,
                        mover.changes.State?.oldValue,
                        mover.changes.Country?.oldValue,
                        mover.changes.Zipcode?.oldValue
                      ].filter(Boolean).join(', ') || 'N/A'}
                    </td>
                    <td>
                      {[
                        mover.changes['Address Line 1']?.newValue,
                        mover.changes['Address Line 2']?.newValue,
                        mover.changes.City?.newValue,
                        mover.changes.State?.newValue,
                        mover.changes.Country?.newValue,
                        mover.changes.Zipcode?.newValue
                      ].filter(Boolean).join(', ') || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="insight-text">No address changes found.</h3>
          )}
        </div>
      )
    },
    {
      id: 'phone-changes',
      title: 'Phone Number Changes',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Phone Number Changes</h2>
          <h3 className="insight-text">Total: {phoneChanges.length}</h3>
          {phoneChanges.length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>Reg Code</th>
                  <th>Name</th>
                  <th>Old Phone Number</th>
                  <th>New Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {phoneChanges.map((mover, index) => (
                  <tr key={index} className="table-row">
                    <td>{mover.regCode}</td>
                    <td>{mover.name}</td>
                    <td>{mover.changes['Phone Number'].oldValue || 'N/A'}</td>
                    <td>{mover.changes['Phone Number'].newValue || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="insight-text">No phone number changes found.</h3>
          )}
        </div>
      )
    },
    {
      id: 'status-changes',
      title: 'Status Changes',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">Status Changes (e.g., Agent to Attorney)</h2>
          <h3 className="insight-text">Total: {insights?.statusChangeDetails?.length || 0}</h3>
          {insights?.statusChangeDetails?.length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>Reg Code</th>
                  <th>Name</th>
                  <th>Old Status</th>
                  <th>New Status</th>
                </tr>
              </thead>
              <tbody>
                {insights.statusChangeDetails.map((mover, index) => (
                  <tr key={index} className="table-row">
                    <td>{mover.regCode}</td>
                    <td>{mover.name}</td>
                    <td>{mover.oldValue || 'N/A'}</td>
                    <td>{mover.newValue || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="insight-text">No status changes found. Please contact support if transitions are expected.</h3>
          )}
        </div>
      )
    },
    {
      id: 'organization-movers',
      title: 'All Movers',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">All Profiles with Changes</h2>
          {insights?.organizationMovers?.length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>Reg Code</th>
                  <th>Name</th>
                  <th>Name Change</th>
                  <th>Organization Change</th>
                  <th>Address Change</th>
                  <th>Phone Number Change</th>
                  <th>Status Change</th>
                </tr>
              </thead>
              <tbody>
                {insights.organizationMovers.map((mover, index) => (
                  <tr key={index} className="table-row">
                    <td>{mover.regCode}</td>
                    <td>{mover.name}</td>
                    <td>
                      {mover.changes.Name
                        ? `${mover.changes.Name.oldValue} → ${mover.changes.Name.newValue}`
                        : 'No change'}
                    </td>
                    <td>
                      {mover.changes['Organization/Law Firm Name']
                        ? `${mover.changes['Organization/Law Firm Name'].oldValue} → ${mover.changes['Organization/Law Firm Name'].newValue}`
                        : 'No change'}
                    </td>
                    <td>
                      {[
                        mover.changes['Address Line 1']?.newValue,
                        mover.changes['Address Line 2']?.newValue,
                        mover.changes.City?.newValue,
                        mover.changes.State?.newValue,
                        mover.changes.Country?.newValue,
                        mover.changes.Zipcode?.newValue
                      ].some(Boolean)
                        ? [
                            mover.changes['Address Line 1']?.oldValue,
                            mover.changes['Address Line 2']?.oldValue,
                            mover.changes.City?.oldValue,
                            mover.changes.State?.oldValue,
                            mover.changes.Country?.oldValue,
                            mover.changes.Zipcode?.oldValue
                          ].filter(Boolean).join(', ') + 
                          ' → ' +
                          [
                            mover.changes['Address Line 1']?.newValue,
                            mover.changes['Address Line 2']?.newValue,
                            mover.changes.City?.newValue,
                            mover.changes.State?.newValue,
                            mover.changes.Country?.newValue,
                            mover.changes.Zipcode?.newValue
                          ].filter(Boolean).join(', ')
                        : 'No change'}
                    </td>
                    <td>
                      {mover.changes['Phone Number']
                        ? `${mover.changes['Phone Number'].oldValue} → ${mover.changes['Phone Number'].newValue}`
                        : 'No change'}
                    </td>
                    <td>
                      {mover.changes.Status
                        ? `${mover.changes.Status.oldValue} → ${mover.changes.Status.newValue}`
                        : 'No change'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="insight-text">No changes found.</h3>
          )}
        </div>
      )
    },
    {
      id: 'all-organizations',
      title: 'All Organizations',
      render: () => (
        <div className="insight-section">
          <h2 className="insight-title">All Organizations</h2>
          {allOrganizations().length > 0 ? (
            <table className="insight-table">
              <thead>
                <tr className="table-header">
                  <th>No.</th>
                  <th>Organization</th>
                </tr>
              </thead>
              <tbody>
                {allOrganizations().map((org, index) => (
                  <tr key={index} className="table-row">
                    <td>{index + 1}</td>
                    <td>{org}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3 className="insight-text">No organizations found.</h3>
          )}
        </div>
      )
    }
  ];

  const handleSelectInsight = (index) => {
    console.log('Selected Insight Index:', index, 'Title:', insightPages[index].title);
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
                        {new Date().toLocaleString()}
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