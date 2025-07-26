import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get('/api/appointments/mine');
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div>
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>You have no appointments yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Hospital</th>
              <th>Vaccine</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => {
              let status;
              if (a.rejected)      status = 'Rejected';
              else if (a.paid)     status = 'Confirmed';
              else if (a.approved) status = 'Approved';
              else                  status = 'Pending Approval';

              return (
                <tr key={a._id} className={a.rejected ? 'table-danger' : ''}>
                  <td>{a.hospital.name}</td>
                  <td>{a.vaccine.name}</td>
                  <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                  <td>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserAppointments;
