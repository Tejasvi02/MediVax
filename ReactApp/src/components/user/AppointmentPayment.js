// src/components/AppointmentPayment.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }       from 'react-router-dom';
import axios                             from 'axios';

const AppointmentPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load appointment details
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/appointments/${id}`);
        setAppt(data);
      } catch (err) {
        console.error(err);
        alert('Error loading appointment');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Handle manual payment
  const handlePay = async () => {
    try {
      const { data } = await axios.put(`/api/appointments/${id}/pay`);
      alert(`Payment successful! Total cost: $${data.cost}`);
      navigate('/user/upcoming');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Payment failed');
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!appt)   return <p>Appointment not found</p>;

  const cost =
    appt.cost != null
      ? appt.cost
      : appt.hospital.charges + appt.vaccine.price;

  // QR code points at the pay endpoint for demo
  const qrData = `${window.location.origin}/api/appointments/${id}/pay`;
  const qrUrl  =
    'https://api.qrserver.com/v1/create-qr-code/' +
    `?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="container mt-4">
      <h2>Confirm & Pay</h2>
      <div className="mb-2">
        <strong>Hospital:</strong> {appt.hospital.name}
      </div>
      <div className="mb-2">
        <strong>Vaccine:</strong> {appt.vaccine.name}
      </div>
      <div className="mb-2">
        <strong>Date:</strong>{' '}
        {new Date(appt.appointmentDate).toLocaleDateString()}
      </div>
      <div className="mb-4">
        <strong>Estimated Cost:</strong> ${cost}
      </div>

      <div className="text-center mb-4">
        <p>Scan this QR code to pay:</p>
        <img
          src={qrUrl}
          alt="Payment QR Code"
          style={{ width: 200, height: 200 }}
        />
      </div>

      <div className="text-center">
        <button
          className="btn btn-success btn-lg"
          onClick={handlePay}
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default AppointmentPayment;
