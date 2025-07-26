import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/home">MediVax</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && user.role === 'admin' && (
              <>  
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/register-vaccine">Register Vaccine</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/hospitals">Hospitals</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/approvals">Approvals</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/vaccinated-list">Vaccinated List</Link>
                </li>
              </>
            )}

            {user && user.role === 'user' && (
              <>  
                <li className="nav-item">
                  <Link className="nav-link" to="/user/appointments">Appointments</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/schedule">My Schedule</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/request">Request Appointment</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/upcoming">Upcoming Appointments</Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-outline-primary" to="/register">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary" to="/">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
