import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/api/appointments/mine');
      setAppointments(data);
    };
    fetch().catch(console.error);
  }, []);

  const today = new Date().setHours(0,0,0,0);
  const upcoming = appointments.filter(a => {
    const d = new Date(a.appointmentDate).setHours(0,0,0,0);
    return d >= today;
  });

  return (
    <div>
      <h2>Upcoming Appointments</h2>
      {upcoming.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Hospital</th>
              <th>Vaccine</th>
              <th>Approved?</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map(a => (
              <tr key={a._id}>
                <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                <td>{a.hospital.name}</td>
                <td>{a.vaccine.name}</td>
                <td>{a.approved ? 'Yes' : 'No'}</td>
                <td>
                  {!a.approved && <span className="text-muted">—</span>}
                  {a.approved && !a.paid && (
                    <Link
                      to={`/user/appointments/${a._id}/pay`}
                      className="btn btn-sm btn-success"
                    >
                      Pay
                    </Link>
                  )}
                  {a.paid && <span className="text-success">Confirmed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UpcomingAppointments;
