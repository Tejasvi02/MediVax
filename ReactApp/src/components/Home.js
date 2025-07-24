import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="container mt-4">
      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <h2>Welcome to our site!</h2>
      )}
    </div>
  );
};

export default Home;
