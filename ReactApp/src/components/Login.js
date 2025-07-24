import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/userActions';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
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
