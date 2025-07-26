import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserHistory = () => {
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

  const todayMs = new Date().setHours(0, 0, 0, 0);
  const history = appointments.filter((a) => {
    const apptMs = new Date(a.appointmentDate).setHours(0, 0, 0, 0);
    return a.paid && apptMs < todayMs;
  });

  return (
    <div>
      <h2>My Vaccination History</h2>
      {history.length === 0 ? (
        <p>You have no past vaccinations yet.</p>
      ) : (
        history.map((a) => (
          <div key={a._id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{a.vaccine.name}</h5>
              <p className="card-text">
                Hospital: {a.hospital.name}
                <br />
                Date: {new Date(a.appointmentDate).toLocaleDateString()}
              </p>
              <p className="text-success">Successfully Vaccinated</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserHistory;
