import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UpcomingAppointments = () => {
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

  const today = new Date().setHours(0, 0, 0, 0);
  const upcoming = appointments.filter((a) => {
    if (a.rejected) return false;
    const apptDay = new Date(a.appointmentDate).setHours(0, 0, 0, 0);
    return apptDay >= today;
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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map((a) => {
              let status;
              let action = null;

              if (a.paid) {
                status = 'Confirmed';
              } else if (a.approved) {
                status = 'Approved';
                action = (
                  <Link
                    to={`/user/appointments/${a._id}/pay`}
                    className="btn btn-sm btn-success"
                  >
                    Pay
                  </Link>
                );
              } else {
                status = 'Pending';
              }

              return (
                <tr key={a._id}>
                  <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                  <td>{a.hospital.name}</td>
                  <td>{a.vaccine.name}</td>
                  <td>{status}</td>
                  <td>{action || <span className="text-muted">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UpcomingAppointments;
