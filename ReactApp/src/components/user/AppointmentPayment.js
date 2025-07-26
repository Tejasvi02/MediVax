import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppointmentPayment = () => {
  const { id } = useParams();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get(`/api/appointments/${id}`);
      setAppt(data);
      setLoading(false);
    };
    load().catch(err => {
      console.error(err);
      alert('Error loading appointment');
      setLoading(false);
    });
  }, [id]);

  const handlePay = async () => {
    try {
      const { data } = await axios.put(`/api/appointments/${id}/pay`);
      alert(`Payment successful! Total cost: ₹${data.cost}`);
      navigate('/user/upcoming');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Payment failed');
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!appt)   return <p>Appointment not found</p>;

  const cost = appt.cost != null
    ? appt.cost
    : appt.hospital.charges + appt.vaccine.price;

  return (
    <div>
      <h2>Confirm & Pay</h2>
      <p><strong>Hospital:</strong> {appt.hospital.name}</p>
      <p><strong>Vaccine:</strong> {appt.vaccine.name}</p>
      <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Estimated Cost:</strong> ${cost}</p>
      <button className="btn btn-success" onClick={handlePay}>
        Confirm & Pay
      </button>
    </div>
  );
};

export default AppointmentPayment;
