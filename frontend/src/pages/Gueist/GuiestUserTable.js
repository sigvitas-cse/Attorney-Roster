import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/pages/GUIEST/GuiestUserTable.css';

function DataPage() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(null);
  const [maxPageReached, setMaxPageReached] = useState(1);
  const [error, setError] = useState('');
  const [isBlurred, setIsBlurred] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'https://roster1.sigvitas.com';
  // const API_URL = 'http://localhost:3001';


  const headerMap = {
    "Sl.No": "slNo",
    "Name": "name",
    "Organization": "organization",
    "Address Line 1": "addressLine1",
    "Address Line 2": "addressLine2",
    "City": "city",
    "State": "state",
    "Country": "country",
    "Zipcode": "zipcode",
    "Phone": "phoneNumber",
    "Reg Code": "regCode",
    "Attorney": "agentAttorney",
    "Date of Patent": "dateOfPatent",
    "Agent Licensed": "agentLicensed",
    "Firm": "firmOrOrganization",
    "Updated Phone": "updatedPhoneNumber",
    "Email": "emailAddress",
    "Updated Org": "updatedOrganization",
    "Website": "firmUrl",
    "Updated Address": "updatedAddress",
    "Updated City": "updatedCity",
    "Updated State": "updatedState",
    "Updated Country": "updatedCountry",
    "Updated Zipcode": "updatedZipcode",
    "LinkedIn": "linkedInProfile",
    "Notes": "notes",
    "Data Updated As On": "dataUpdatedAsOn",
  };

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('GuiestUserTable: No token, redirecting to /guistlogin');
      navigate('/guistlogin', { replace: true });
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/verify-token`, {
      // const response = await fetch('http://localhost:3001/api/verify-token', {
        method: 'GET',
        headers: { 'x-auth-token': token },
      });
      const data = await response.json();
      console.log('GuiestUserTable: Verify response', data);
      if (response.ok && data.message === 'Token valid') {
        return true;
      } else {
        console.log('GuiestUserTable: Invalid token, redirecting');
        localStorage.removeItem('token');
        navigate('/guistlogin', { replace: true });
        return false;
      }
    } catch (err) {
      console.error('GuiestUserTable: Token verification error', err);
      localStorage.removeItem('token');
      navigate('/guistlogin', { replace: true });
      return false;
    }
  };

  const fetchCurrentPage = async () => {
    try {
      const response = await fetch(`${API_URL}/api/current-page`, {
      // const response = await fetch('http://localhost:3001/api/current-page', {
        method: 'GET',
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('GuiestUserTable: Fetched currentPage', data.currentPage, 'maxPageReached', data.maxPageReached);
        setMaxPageReached(data.maxPageReached);
        return data.currentPage;
      } else {
        throw new Error(data.message || 'Failed to fetch current page');
      }
    } catch (err) {
      console.error('Fetch current page error:', err);
      return 1;
    }
  };

  useEffect(() => {
    console.log('GuiestUserTable: Mounting, checking token');
    verifyToken().then(async (isValid) => {
      if (isValid) {
        const serverPage = await fetchCurrentPage();
        setCurrentPage(serverPage);
        fetchData(serverPage);
      }
    });

    const handlePopstate = () => {
      console.log('GuiestUserTable: Popstate event, re-verifying token');
      verifyToken().then((isValid) => {
        if (!isValid) {
          navigate('/guistlogin', { replace: true });
        }
      });
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [navigate]);

  useEffect(() => {
    if (currentPage !== null) {
      fetchData(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    const handleBlur = () => {
      console.log('GuiestUserTable: Window blurred, applying blur effect');
      setIsBlurred(true);
    };

    const handleFocus = () => {
      console.log('GuiestUserTable: Window focused, removing blur effect');
      setIsBlurred(false);
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchData = async (page) => {
    try {
      console.log('GuiestUserTable: Fetching data for page', page);
      
      const response = await fetch(`${API_URL}/api/guiestdata`, {
      // const response = await fetch('http://localhost:3001/api/guiestdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ page }),
      });
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setTotalCount(result.totalCount);
        setCurrentPage(page);
        setError('');
      } else {
        setError(result.message || 'Failed to fetch data');
        if (response.status === 401 || response.status === 403) {
          if (result.message === 'Previous page access restricted. Please log in again.') {
            console.log('GuiestUserTable: Previous page restricted, redirecting to /guistlogin');
            localStorage.removeItem('token');
            navigate('/guistlogin', { replace: true });
          } else if (result.message === 'Page limit exceeded. Please contact admin.') {
            console.log('GuiestUserTable: Page limit exceeded, staying on page', currentPage);
            setMaxPageReached(Math.max(maxPageReached, currentPage));
          } else {
            console.log('GuiestUserTable: Unauthorized, redirecting to /guistlogin');
            localStorage.removeItem('token');
            navigate('/guistlogin', { replace: true });
          }
        }
      }
    } catch (err) {
      console.error('Fetch data error:', err);
      setError('Network error. Please check your connection or server status.');
    }
  };

  const handleNext = () => {
    if (maxPageReached >= 3 || currentPage >= 3) {
      setError('Please contact admin to access more pages.');
      console.log('GuiestUserTable: Page limit reached, staying on page', currentPage);
      return;
    }
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setError('Access to previous data is restricted. Logging out.');
    localStorage.removeItem('token');
    navigate('/guistlogin', { replace: true });
  };

  const handleLogout = async () => {
    try {
      console.log('GuiestUserTable: Logging out');

      await fetch(`${API_URL}/api/guiestlogout`, {
      // await fetch('http://localhost:3001/api/guiestlogout', {
        method: 'POST',
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      localStorage.removeItem('token');
      navigate('/guistlogin', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
      localStorage.removeItem('token');
      navigate('/guistlogin', { replace: true });
    }
  };

  const disableCopyPaste = (e) => {
    e.preventDefault();
    console.log('GuiestUserTable: Copy/paste attempt blocked');
    return false;
  };

  const disableRightClick = (e) => {
    e.preventDefault();
    console.log('GuiestUserTable: Right-click attempt blocked');
    return false;
  };

  if (currentPage === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="data-page73">
      <div className="data-container73">
        <div className="header73">
          <h2>Data Records</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <p className="total-records73">Total Records: {totalCount}</p>
        {error && <p className="error73">{error}</p>}
        <div
          className={`table-wrapper73 ${isBlurred ? 'blurred73' : ''}`}
          onCopy={disableCopyPaste}
          onCut={disableCopyPaste}
          onPaste={disableCopyPaste}
          onContextMenu={disableRightClick}
        >
          <table>
            <thead>
              <tr>
                {Object.keys(headerMap).map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((profile, index) => (
                <tr key={profile._id}>
                  <td>{index + 1}</td>
                  <td>{profile.name}</td>
                  <td>{profile.organization}</td>
                  <td>{profile.addressLine1}</td>
                  <td>{profile.addressLine2}</td>
                  <td>{profile.city}</td>
                  <td>{profile.state}</td>
                  <td>{profile.country}</td>
                  <td>{profile.zipcode}</td>
                  <td>{profile.phoneNumber}</td>
                  <td>{profile.regCode}</td>
                  <td>{profile.agentAttorney}</td>
                  <td>{profile.dateOfPatent}</td>
                  <td>{profile.agentLicensed}</td>
                  <td>{profile.firmOrOrganization}</td>
                  <td>{profile.updatedPhoneNumber}</td>
                  <td>{profile.emailAddress}</td>
                  <td>{profile.updatedOrganization}</td>
                  <td>
                    <a href={profile.firmUrl} target="_blank" rel="noopener noreferrer">
                      {profile.firmUrl}
                    </a>
                  </td>
                  <td>{profile.updatedAddress}</td>
                  <td>{profile.updatedCity}</td>
                  <td>{profile.updatedState}</td>
                  <td>{profile.updatedCountry}</td>
                  <td>{profile.updatedZipcode}</td>
                  <td>
                    <a href={profile.linkedInProfile} target="_blank" rel="noopener noreferrer">
                      {profile.linkedInProfile}
                    </a>
                  </td>
                  <td>{profile.notes}</td>
                  <td>{profile.dataUpdatedAsOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="watermark73">
            Confidential - Do Not Copy
          </div>
        </div>
        <div className="pagination73">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button onClick={handleNext} disabled={currentPage >= 3 || maxPageReached >= 3}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataPage;