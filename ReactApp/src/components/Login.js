import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL
} from '../redux/actions/userActions';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: USER_LOGIN_REQUEST });

    try {
      const { data } = await axios.post('/api/users/login', { email, password });

      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      navigate('/home');
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <div className="card p-4">
      <h3 className="mb-3 text-primary">Login</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className="form-control mb-3" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-success w-100" type="submit">Login</button>
      </form>
      <p className="mt-3">New user? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;
