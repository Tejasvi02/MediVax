import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSchedule = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/api/appointments/mine');
      setAppointments(data);
    };
    fetch().catch(console.error);
  }, []);

  const today = new Date().setHours(0, 0, 0, 0);

  return (
    <div>
      <h2>My Schedule</h2>
      {appointments.length === 0 ? (
        <p>No scheduled vaccinations.</p>
      ) : (
        appointments.map(a => {
          const apptDay = new Date(a.appointmentDate).setHours(0, 0, 0, 0);
          const upcoming = apptDay > today;
          return (
            <div key={a._id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{a.vaccine.name}</h5>
                <p className="card-text">
                  Hospital: {a.hospital.name}<br/>
                  Date: {new Date(a.appointmentDate).toLocaleDateString()}
                </p>
                <p className={upcoming ? 'text-info' : 'text-success'}>
                  {upcoming
                    ? 'Upcoming Appointment'
                    : 'Successfully Vaccinated'}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserSchedule;
