import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApproverScreen = () => {
  const [requests, setRequests] = useState([]);

  // fetch with error handling
  const fetchRequests = async () => {
    try {
      const { data } = await axios.get('/api/appointments/pending');
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err.response?.data || err.message);
      alert('Could not load appointment requests.');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // approve handler
  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/appointments/${id}/approve`);
      alert('Appointment approved.');
      fetchRequests();
    } catch (err) {
      console.error('Approve failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Approve failed.');
    }
  };

  // reject handler
  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this appointment?')) return;
    try {
      await axios.put(`/api/appointments/${id}/reject`);
      alert('Appointment request has been rejected.');
      fetchRequests();
    } catch (err) {
      console.error('Reject failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Reject failed.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Appointment Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>User</th><th>Hospital</th><th>Vaccine</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((a) => (
              <tr key={a._id}>
                <td>{a.user.name} ({a.user.email})</td>
                <td>{a.hospital.name}</td>
                <td>{a.vaccine.name}</td>
                <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => handleApprove(a._id)}
                  >Approve</button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleReject(a._id)}
                  >Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApproverScreen;
