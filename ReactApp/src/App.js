import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import RegisterVaccine from './components/admin/RegisterVaccine';
import HospitalList from './components/admin/HospitalList';
import ApproverScreen from './components/admin/ApproverScreen';
import VaccinatedList from './components/admin/VaccinatedList';
import UserHospitals from './components/user/UserHospitals';
import UserAppointments from './components/user/UserAppointments';
import UserSchedule from './components/user/UserSchedule';

const App = () => (
  <Router>
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-fill container mt-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin/register-vaccine" element={<RegisterVaccine />} />
          <Route path="/admin/hospitals" element={<HospitalList />} />
          <Route path="/admin/approvals" element={<ApproverScreen />} />
          <Route path="/admin/vaccinated-list" element={<VaccinatedList />} />
          <Route path="/user/hospitals" element={<UserHospitals />} />
          <Route path="/user/appointments" element={<UserAppointments />} />
          <Route path="/user/schedule" element={<UserSchedule />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </Router>
);
export default App;