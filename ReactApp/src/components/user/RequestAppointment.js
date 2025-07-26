import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const RequestAppointment = () => {
  const [hospitals, setHospitals] = useState([]);
  const [vaccines, setVaccines]   = useState([]);
  const [form, setForm]           = useState({
    hospitalId: '',
    vaccineId: '',
    appointmentDate: ''
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // if a vaccineId query param is present, prefill it
    const preVaccine = searchParams.get('vaccineId');
    if (preVaccine) {
      setForm((f) => ({ ...f, vaccineId: preVaccine }));
    }

    // fetch lists
    const fetchLists = async () => {
      try {
        const [hRes, vRes] = await Promise.all([
          axios.get('/api/hospitals'),
          axios.get('/api/vaccines')
        ]);
        setHospitals(hRes.data);
        setVaccines(vRes.data);
      } catch (error) {
        console.error('Error loading lists:', error);
        alert('Could not load hospitals or vaccines.');
      }
    };
    fetchLists();
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.hospitalId || !form.vaccineId || !form.appointmentDate) {
      return alert('All fields are required');
    }
    try {
      await axios.post('/api/appointments', form);
      navigate('/user/upcoming');
    } catch (error) {
      console.error('Request failed:', error.response || error.message);
      alert(error.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Request Appointment</h2>
      <form onSubmit={handleSubmit}>
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
            {hospitals.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name} ({h.type}) — ${h.charges}
              </option>
            ))}
          </select>
        </div>

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
            {vaccines.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name} — ${v.price}
              </option>
            ))}
          </select>
        </div>

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
