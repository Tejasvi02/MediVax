import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from '../redux/actions/userActions';

// Predefined disease suggestions
const diseaseList = [
  'Diabetes', 'Hypertension', 'Asthma', 'Cancer', 'Heart Disease',
  'Thyroid', 'Arthritis', 'COVID-19', 'Tuberculosis', 'HIV'
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    profession: '',
    contact: '',
    address: '',
    gender: '',
    medicalCertificate: null,
    email: '',
    password: '',
  });

  const [diseaseInput, setDiseaseInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDiseaseChange = (e) => {
    const value = e.target.value;
    setDiseaseInput(value);

    if (value.length > 0) {
      const filtered = diseaseList.filter(
        (d) =>
          d.toLowerCase().includes(value.toLowerCase()) &&
          !selectedDiseases.includes(d)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addDisease = (disease) => {
    setSelectedDiseases([...selectedDiseases, disease]);
    setDiseaseInput('');
    setSuggestions([]);
  };

  const removeDisease = (disease) => {
    setSelectedDiseases(selectedDiseases.filter((d) => d !== disease));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: USER_REGISTER_REQUEST });

    try {
      const dataToSend = new FormData();
      for (let key in formData) {
        dataToSend.append(key, formData[key]);
      }
      dataToSend.append('disease', JSON.stringify(selectedDiseases));

      const { data } = await axios.post('/api/users/register', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });

      // Optionally store token/user if returned
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }

      navigate('/');
    } catch (err) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload: err.response?.data?.message || err.message,
      });
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h2 className="text-primary">User Registration</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Input fields */}
        <div className="mb-3">
          <label>Name</label>
          <input className="form-control" name="name" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Age</label>
          <input type="number" className="form-control" name="age" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Profession</label>
          <input className="form-control" name="profession" onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Contact</label>
          <input type="tel" className="form-control" name="contact" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" name="password" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Address</label>
          <textarea className="form-control" name="address" rows="2" onChange={handleChange}></textarea>
        </div>

        <div className="mb-3">
          <label>Gender</label>
          <div className="form-check">
            <input type="radio" name="gender" value="Male" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label">Male</label>
          </div>
          <div className="form-check">
            <input type="radio" name="gender" value="Female" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label">Female</label>
          </div>
          <div className="form-check">
            <input type="radio" name="gender" value="Other" className="form-check-input" onChange={handleChange} />
            <label className="form-check-label">Other</label>
          </div>
        </div>

        {/* Disease selection */}
        <div className="mb-3">
          <label>Medical Condition (if any)</label>
          <input
            className="form-control"
            value={diseaseInput}
            onChange={handleDiseaseChange}
            placeholder="Start typing ..."
          />

          {suggestions.length > 0 && (
            <ul className="list-group mt-1" style={{ maxHeight: '120px', overflowY: 'auto' }}>
              {suggestions.map((disease) => (
                <li
                  key={disease}
                  className="list-group-item list-group-item-action"
                  onClick={() => addDisease(disease)}
                  style={{ cursor: 'pointer' }}
                >
                  {disease}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2">
            {selectedDiseases.map((disease) => (
              <span key={disease} className="badge bg-info text-dark me-2">
                {disease}
                <button
                  type="button"
                  className="btn-close btn-close-white btn-sm ms-2"
                  onClick={() => removeDisease(disease)}
                  style={{ fontSize: '0.6rem' }}
                ></button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label>Medical Certificate</label>
          <input
            type="file"
            name="medicalCertificate"
            className="form-control"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">Register</button>
      </form>
    </div>
  );
};

export default Register;
