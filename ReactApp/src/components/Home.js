import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate }           from 'react-router-dom';
import axios                     from 'axios';
import Carousel                  from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [summary, setSummary] = useState({
    ageDistribution: [],
    genderDistribution: [],
    coveragePercent: 0
  });

  // load user appointments
  useEffect(() => {
    if (user?.role === 'user') {
      axios.get('/api/appointments/mine')
        .then(r => setAppointments(r.data))
        .catch(console.error);
    }
  }, [user]);

  // load summary data
  useEffect(() => {
    axios.get('/api/reports/summary')
      .then(r => setSummary(r.data))
      .catch(console.error);
  }, []);

  // pending doses for normal users
  const pendingDosages = useMemo(() => {
    if (user?.role !== 'user') return [];
    const counts = appointments.reduce((acc, a) => {
      acc[a.vaccine._id] = (acc[a.vaccine._id] || 0) + 1;
      return acc;
    }, {});
    return appointments
      .map(a => a.vaccine)
      .reduce((uniq, v) => {
        if (uniq.find(x => x.vaccine._id === v._id)) return uniq;
        const taken = counts[v._id] || 0;
        const remaining = v.dosesRequired - taken;
        return remaining > 0
          ? [...uniq, { vaccine: v, remaining }]
          : uniq;
      }, []);
  }, [appointments, user]);

  return (
    <>
      {/* Hero Banner */}
      <div className="hero-banner d-flex align-items-center">
        <div className="container text-center hero-content">
          <h1 className="fw-bold">
            {user ? `Welcome, ${user.name}!` : 'Welcome to MediVax'}
          </h1>
        </div>
      </div>

      <div className="container mt-4">
        {/* Pending Dose Alerts */}
        {user?.role === 'user' && pendingDosages.length > 0 && (
          <div className="mb-4">
            {pendingDosages.map(({ vaccine, remaining }) => (
              <div
                key={vaccine._id}
                className="alert alert-info d-flex justify-content-between align-items-center"
              >
                <div>
                  You have <strong>{remaining}</strong> dose
                  {remaining > 1 && 's'} remaining for{' '}
                  <strong>{vaccine.name}</strong>.
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/user/request?vaccineId=${vaccine._id}`)
                  }
                >
                  Book Next Dose
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stat Cards */}
        <div className="row text-center mb-5 align-items-stretch">
          <div className="col-md-4 mb-3 d-flex">
            <div className="card stat-card shadow-sm p-3 w-100 h-100">
              <h5>Age Distribution</h5>
              <ul className="list-unstyled mb-0">
                {summary.ageDistribution.map(({ group, percent }) => (
                  <li key={group}>
                    {group}: <strong>{percent}%</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-4 mb-3 d-flex">
            <div className="card stat-card shadow-sm p-3 w-100 h-100">
              <h5>Gender Distribution</h5>
              <ul className="list-unstyled mb-0">
                {summary.genderDistribution.map(({ gender, percent }) => (
                  <li key={gender}>
                    {gender}: <strong>{percent}%</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-4 mb-3 d-flex">
            <div className="card stat-card shadow-sm p-3 w-100 h-100">
              <h5>Population Coverage</h5>
              <p className="mb-0 display-6">
                {summary.coveragePercent}%
              </p>
            </div>
          </div>
        </div>

        {/* WatchList Carousel */}
        <section className="mb-5">
          <Carousel
            controls={false}
            indicators
            interval={1500}
            fade
          >
            <Carousel.Item
              style={{ height: '240px' }}
              className="bg-primary text-white rounded"
            >
              <div className="d-flex h-100 align-items-center justify-content-center w-100 px-4">
                <div>
                  <h4 className="mb-3">Age Distribution</h4>
                  <ul className="list-unstyled mb-0">
                    {summary.ageDistribution.map(({ group, percent }) => (
                      <li key={group}>
                        <strong>{group}:</strong> {percent}%
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Carousel.Item>

            <Carousel.Item
              style={{ height: '240px' }}
              className="bg-success text-white rounded"
            >
              <div className="d-flex h-100 align-items-center justify-content-center w-100 px-4">
                <div>
                  <h4 className="mb-3">Gender Distribution</h4>
                  <ul className="list-unstyled mb-0">
                    {summary.genderDistribution.map(({ gender, percent }) => (
                      <li key={gender}>
                        <strong>{gender}:</strong> {percent}%
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Carousel.Item>

            <Carousel.Item
              style={{ height: '240px' }}
              className="bg-info text-white rounded"
            >
              <div className="d-flex h-100 align-items-center justify-content-center w-100 px-4">
                <div className="text-center">
                  <h4 className="mb-3">Population Coverage</h4>
                  <p className="lead mb-0">
                    <strong>{summary.coveragePercent}%</strong> of users have received at least one dose.
                  </p>
                </div>
              </div>
            </Carousel.Item>
          </Carousel>
</section>

      </div>
    </>
  );
};

export default Home;
