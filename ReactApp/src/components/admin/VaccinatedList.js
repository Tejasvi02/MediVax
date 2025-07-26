import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VaccinatedList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await axios.get('/api/appointments/vaccinated');
        setRecords(data);
      } catch (err) {
        console.error('Error fetching vaccinated records:', err.response?.data || err.message);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div>
      <h2>Vaccinated Persons</h2>
      {records.length === 0 ? (
        <p>No vaccinated records found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Vaccine</th>
              <th>Hospital</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.user.name}</td>
                <td>{r.vaccine.name}</td>
                <td>{r.hospital.name}</td>
                <td>{new Date(r.appointmentDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VaccinatedList;

