import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterVaccine = () => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    price: '',
    sideEffects: '',
    origin: '',
    dosesRequired: '',
    otherInfo: '',
  });
  const [vaccines, setVaccines] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchVaccines = async () => {
    try {
      const { data } = await axios.get('/api/vaccines');
      setVaccines(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchVaccines(); }, []);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/vaccines/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post('/api/vaccines', form);
      }
      setForm({
        name: '', type: '', price: '',
        sideEffects: '', origin: '',
        dosesRequired: '', otherInfo: '',
      });
      fetchVaccines();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = v => {
    setForm({
      name: v.name,
      type: v.type,
      price: v.price,
      sideEffects: v.sideEffects,
      origin: v.origin,
      dosesRequired: v.dosesRequired,
      otherInfo: v.otherInfo,
    });
    setEditingId(v._id);
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this vaccine?')) {
      await axios.delete(`/api/vaccines/${id}`);
      fetchVaccines();
    }
  };

  return (
    <div>
      <h2>{editingId ? 'Edit Vaccine' : 'Register Vaccine'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {['name','type'].map(field => (
            <div className="col-md-6 mb-3" key={field}>
              <label className="form-label">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
              <input
                className="form-control"
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Doses Required</label>
            <input
              type="number"
              className="form-control"
              name="dosesRequired"
              value={form.dosesRequired}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Origin</label>
            <input
              className="form-control"
              name="origin"
              value={form.origin}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <label>Side Effects</label>
          <input
            className="form-control"
            name="sideEffects"
            value={form.sideEffects}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Other Info</label>
          <textarea
            className="form-control"
            name="otherInfo"
            rows="2"
            value={form.otherInfo}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-success">
          {editingId ? 'Update Vaccine' : 'Add Vaccine'}
        </button>
      </form>

      <hr />

      <h3>Existing Vaccines</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Type</th><th>Price</th><th>Doses</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vaccines.map(v => (
            <tr key={v._id}>
              <td>{v.name}</td>
              <td>{v.type}</td>
              <td>{v.price}</td>
              <td>{v.dosesRequired}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => startEdit(v)}
                >Edit</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(v._id)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisterVaccine;
