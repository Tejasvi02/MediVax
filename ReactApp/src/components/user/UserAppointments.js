import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/api/appointments/mine');
      setAppointments(data);
    };
    fetch().catch(console.error);
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
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a._id}>
                <td>{a.hospital.name}</td>
                <td>{a.vaccine.name}</td>
                <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserAppointments;
