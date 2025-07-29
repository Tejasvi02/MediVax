// src/components/user/AppointmentPayment.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }       from 'react-router-dom';
import axios                             from 'axios';
import { jsPDF }                         from 'jspdf';

const AppointmentPayment = () => {
  // ◀️ make sure id is pulled from useParams!
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

  const handlePay = async () => {
    try {
      // 1) mark paid
      const { data } = await axios.put(`/api/appointments/${id}/pay`);
      const confirmed = { ...appt, paid: true, cost: data.cost };

      // 2) generate + download PDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Appointment Confirmation', 14, 20);
      doc.setFontSize(12);
      doc.text(`Hospital: ${confirmed.hospital.name}`, 14, 40);
      doc.text(`Vaccine: ${confirmed.vaccine.name}`, 14, 50);
      doc.text(
        `Date: ${new Date(confirmed.appointmentDate).toLocaleDateString()}`,
        14,
        60
      );
      doc.text(`Total Paid: $${confirmed.cost}`, 14, 70);
      doc.text('Your appointment has been confirmed.', 14, 90);
      doc.save('appointment-confirmation.pdf');

      // 3) email notification
      try {
        await axios.post(`/api/appointments/${id}/notify`);
      } catch (notifyErr) {
        console.warn('Email notify failed:', notifyErr);
      }

      alert('Payment successful! PDF downloaded and email sent.');
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

  // QR points at the same pay endpoint (demo)
  const qrData = `${window.location.origin}/api/appointments/${id}/pay`;
  const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="container mt-4">
      <h2>Confirm & Pay</h2>
      <p><strong>Hospital:</strong> {appt.hospital.name}</p>
      <p><strong>Vaccine:</strong> {appt.vaccine.name}</p>
      <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Estimated Cost:</strong> ${cost}</p>

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
