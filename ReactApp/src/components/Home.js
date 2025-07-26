import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user?.role === 'user') {
      const fetchAppointments = async () => {
        try {
          const { data } = await axios.get('/api/appointments/mine');
          setAppointments(data);
        } catch (err) {
          console.error('Error loading appointments:', err);
        }
      };
      fetchAppointments();
    }
  }, [user]);

  // Only compute pending dosages for regular users
  const pendingDosages = React.useMemo(() => {
    if (user?.role !== 'user') return [];
    // count all bookings per vaccine
    const counts = appointments.reduce((acc, a) => {
      const vid = a.vaccine._id;
      acc[vid] = (acc[vid] || 0) + 1;
      return acc;
    }, {});
    // compare to dosesRequired
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
    <div className="container mt-4">
      {user ? (
        <>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>

          {user.role === 'user' && pendingDosages.length > 0 && (
            <div className="my-4">
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
                    Book next dose
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <h2>Welcome to MediVax</h2>
      )}
    </div>
  );
};

export default Home;
