import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestAppointment = () => {
  const [hospitals, setHospitals] = useState([]);
  const [vaccines, setVaccines]   = useState([]);
  const [form, setForm]           = useState({
    hospitalId: '',
    vaccineId: '',
    appointmentDate: ''
  });
  const navigate = useNavigate();

  // 1) Grab the lists
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [hRes, vRes] = await Promise.all([
          axios.get('/api/hospitals'),
          axios.get('/api/vaccines')
        ]);
        console.log('Hospitals:', hRes.data);
        console.log('Vaccines:', vRes.data);
        setHospitals(hRes.data);
        setVaccines(vRes.data);
      } catch (err) {
        console.error('Fetch lists failed:', err.response?.data || err.message);
        alert('Could not load hospitals/vaccines. Check console.');
      }
    };
    fetchLists();
  }, []);

  // 2) Handle field changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3) Submit the request
  const handleSubmit = async e => {
    e.preventDefault();
    // basic validation
    if (!form.hospitalId || !form.vaccineId || !form.appointmentDate) {
      return alert('All fields are required');
    }

    try {
      console.log('Requesting appointment:', form);
      await axios.post('/api/appointments', form);
      navigate('/user/upcoming');
    } catch (err) {
      console.error('Request failed:', err.response || err.message);
      alert(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Request Appointment</h2>
      <form onSubmit={handleSubmit}>
        {/* Hospital selector */}
        <div className="mb-3">
          <label className="form-label">Hospital</label>
          <select
            className="form-select"
            name="hospitalId"
            value={form.hospitalId}
            onChange={handleChange}
            required
          >
            <option value="">— Select Hospital —</option>
            {hospitals.map(h => (
              <option key={h._id} value={h._id}>
                {h.name} ({h.type}) — ₹{h.charges}
              </option>
            ))}
          </select>
        </div>

        {/* Vaccine selector */}
        <div className="mb-3">
          <label className="form-label">Vaccine</label>
          <select
            className="form-select"
            name="vaccineId"
            value={form.vaccineId}
            onChange={handleChange}
            required
          >
            <option value="">— Select Vaccine —</option>
            {vaccines.map(v => (
              <option key={v._id} value={v._id}>
                {v.name} — ₹{v.price}
              </option>
            ))}
          </select>
        </div>

        {/* Date picker */}
        <div className="mb-3">
          <label className="form-label">Appointment Date</label>
          <input
            type="date"
            className="form-control"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Request Appointment
        </button>
      </form>
    </div>
  );
};

export default RequestAppointment;
