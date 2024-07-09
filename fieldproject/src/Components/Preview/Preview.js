import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactToPrint from 'react-to-print';
import './Preview.css';

function Preview() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const { currentUser } = useSelector((state) => state.userAdminLoginReducer);
  const token = localStorage.getItem('token');
  const componentRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/admin-api/userinfo/${currentUser.facultyId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData([response.data.data]); // Since we're fetching for a single user, wrap response.data.data in an array
      } catch (err) {
        setError('No data to show');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser.facultyId) {
      fetchUserData();
    }
  }, [currentUser.facultyId, token]);

  const handleExpandRow = (id) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id]
    }));
  };

  return (
    <div className="user-info-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div ref={componentRef}>
            <table className="user-info-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Faculty ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Date of Joining</th>
                  <th>More Details</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <React.Fragment key={user._id}>
                    <tr>
                      <td>
                        <img src={user.imgUrl} alt="User" className="user-image" />
                      </td>
                      <td>{user.facultyId}</td>
                      <td>{user.name}</td>
                      <td>{user.department}</td>
                      <td>{user.position}</td>
                      <td>{new Date(user.dateOfJoining).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleExpandRow(user._id)}>
                          {expandedRows[user._id] ? 'Hide Details' : 'Show Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedRows[user._id] && (
                      <tr>
                        <td colSpan="7">
                          <div className="expanded-row">
                            <div className="expanded-row-content">
                              <div className="user-info-section column">
                                <p><strong>Aadhar:</strong> {user.aadhar}</p>
                                <p><strong>PAN:</strong> {user.pan}</p>
                                <p><strong>Date of Joining:</strong> {user.dateOfJoining}</p>
                                <p><strong>Department:</strong> {user.department}</p>
                                <p><strong>Position:</strong> {user.position}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Date of Modification:</strong> {new Date(user.dateOfModification).toLocaleDateString()}</p>
                              </div>
                              <div className="user-info-section column">
                                
                                <p><strong>Education:</strong> {user.education}</p>
                                <p><strong>GPA:</strong> {user.gpa}</p>
                                <p><strong>Inter Percentage:</strong> {user.interPercentage}</p>
                                <p><strong>UG Branch:</strong> {user.ugBranch}</p>
                                <p><strong>UG Percentage:</strong> {user.ugPercentage}</p>
                                <p><strong>PG Branch:</strong> {user.pgBranch}</p>
                                <p><strong>PG Percentage:</strong> {user.pgPercentage}</p>
                              </div>
                            </div>
                            <div className="document-container">
                              <div>
                                <p><strong>Aadhar Proof:</strong></p>
                                <img src={user.aadharProofUrl} alt="Aadhar Proof" className="document-image" />
                              </div>
                              <div>
                                <p className='mt-5'><strong>PAN Proof:</strong></p>
                                <img src={user.panProofUrl} alt="PAN Proof" className="document-image" />
                              </div>
                              <div>
                                <p><strong>Joining Order:</strong></p>
                                <img src={user.joiningOrderUrl} alt="Joining Order" className="document-image" />
                              </div>
                              <div>
                                <p><strong>Office Order:</strong></p>
                                <img src={user.officeOrderUrl} alt="Office Order" className="document-image" />
                              </div>
                              <div>
                                <p><strong>10th Certificate:</strong></p>
                                <img src={user.certificate10Url} alt="10th Certificate" className="document-image" />
                              </div>
                              <div>
                                <p><strong>Inter Certificate:</strong></p>
                                <img src={user.certificateInterUrl} alt="Inter Certificate" className="document-image" />
                              </div>
                              <div>
                                <p><strong>UG Certificate:</strong></p>
                                <img src={user.certificateUGUrl} alt="UG Certificate" className="document-image" />
                              </div>
                              <div>
                                <p><strong>PG Certificate:</strong></p>
                                <img src={user.certificatePGUrl} alt="PG Certificate" className="document-image" />
                              </div>
                              {user.certificatePhDUrl && (
                                <div>
                                  <p><strong>PhD Certificate:</strong></p>
                                  <img src={user.certificatePhDUrl} alt="PhD Certificate" className="document-image" />
                                </div>
                              )}
                              <div>
                                <p><strong>CV:</strong></p>
                                <img src={user.cvUrl} alt="CV" className="document-image" />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <ReactToPrint
            trigger={() => <button className="print-button">Print / Save as PDF</button>}
            content={() => componentRef.current}
          />
        </>
      )}
    </div>
  );
}

export default Preview;
