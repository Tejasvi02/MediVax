import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [vaccines, setVaccines]   = useState([]);
  const [form, setForm]           = useState({
    hospitalId: '',
    vaccineId: '',
    appointmentDate: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const [hRes, vRes] = await Promise.all([
        axios.get('/api/hospitals'),
        axios.get('/api/vaccines')
      ]);
      console.log('hospitals→', hRes.data);
      console.log('vaccines→', vRes.data);
      setHospitals(hRes.data);
      setVaccines(vRes.data);
    };
    fetch().catch(console.error);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.hospitalId || !form.vaccineId || !form.appointmentDate) {
      return alert('Please fill all fields');
    }
    try {
      await axios.post('/api/appointments', {
        hospitalId: form.hospitalId,
        vaccineId: form.vaccineId,
        appointmentDate: form.appointmentDate
      });
      navigate('/user/schedule');
    } catch (err) {
      console.error(err);
      alert('Booking failed');
    }
  };

  return (
    <div>
      <h2>Book Vaccination Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Hospital</label>
          <select
            className="form-select"
            name="hospitalId"
            value={form.hospitalId}
            onChange={handleChange}
            required
          >
            <option value="">Select Hospital</option>
            {hospitals.map(h => (
              <option key={h._id} value={h._id}>
                {h.name} ({h.type}) – ₹{h.charges}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Vaccine</label>
          <select
            className="form-select"
            name="vaccineId"
            value={form.vaccineId}
            onChange={handleChange}
            required
          >
            <option value="">Select Vaccine</option>
            {vaccines.map(v => (
              <option key={v._id} value={v._id}>
                {v.name} – ₹{v.price}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Appointment Date</label>
          <input
            type="date"
            className="form-control"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-success">Pay & Schedule</button>
      </form>
    </div>
  );
};

export default UserHospitals;
