import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HospitalList = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    type: 'Govt',
    charges: ''
  });
  const [hospitals, setHospitals] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchHospitals = async () => {
    try {
      const { data } = await axios.get('/api/hospitals');
      setHospitals(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchHospitals(); }, []);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        charges: parseFloat(form.charges || 0)
      };
      if (editingId) {
        await axios.put(`/api/hospitals/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post('/api/hospitals', payload);
      }
      setForm({ name:'', address:'', type:'Govt', charges:'' });
      fetchHospitals();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = h => {
    setForm({
      name: h.name,
      address: h.address,
      type: h.type,
      charges: h.charges
    });
    setEditingId(h._id);
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this hospital?')) {
      await axios.delete(`/api/hospitals/${id}`);
      fetchHospitals();
    }
  };

  return (
    <div>
      <h2>{editingId ? 'Edit Hospital' : 'Add Hospital'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Address</label>
          <textarea
            className="form-control"
            name="address"
            rows="2"
            value={form.address}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Type</label>
          <select
            className="form-select"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="Govt">Govt</option>
            <option value="Private">Private</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Charges</label>
          <input
            type="number"
            className="form-control"
            name="charges"
            value={form.charges}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-success">
          {editingId ? 'Update Hospital' : 'Add Hospital'}
        </button>
      </form>

      <hr />

      <h3>Existing Hospitals</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Address</th><th>Type</th><th>Charges</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map(h => (
            <tr key={h._id}>
              <td>{h.name}</td>
              <td>{h.address}</td>
              <td>{h.type}</td>
              <td>{h.charges}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => startEdit(h)}
                >Edit</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(h._id)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HospitalList;
