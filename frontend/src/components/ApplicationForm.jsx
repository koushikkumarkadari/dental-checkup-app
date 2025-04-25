import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ApplicationForm = () => {
  const [form, setForm] = useState({
    patientName: '',
    patientEmail: '',
    date: '',
    time: '',
    message: '',
  });
  const { user } = useAuth(); // Use token and user from AuthContext
  const token=localStorage.getItem("token")
  const navigate = useNavigate();
  const location = useLocation();
  const doctor = location.state?.doctor; // Get doctor data from navigation state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in to submit an appointment.');
      navigate('/login');
      return;
    }
    if (!doctor || !doctor._id) {
      alert('Doctor information is missing.');
      return;
    }

    try {
      await axios.post(
        'https://dental-checkup-app.onrender.com/api/appointments',
        {
          ...form,
          doctorId: doctor._id,
          doctorName: doctor.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Appointment submitted successfully!');
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit appointment';
      console.error('Appointment submission error:', err);
      alert(errorMessage);
    }
  };

  // If doctor information is missing, show an error message
  if (!doctor) {
    return (
      <div className="p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>Doctor information is missing. Please go back and select a doctor.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Book Appointment with {doctor.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patientName" className="block text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            placeholder="Your Name"
            value={form.patientName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="patientEmail" className="block text-gray-700 mb-1">Your Email</label>
          <input
            type="email"
            id="patientEmail"
            name="patientEmail"
            placeholder="Your Email"
            value={form.patientEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-700 mb-1">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-gray-700 mb-1">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700 mb-1">Message (Optional)</label>
          <textarea
            id="message"
            name="message"
            placeholder="Message (optional)"
            value={form.message}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4"
        >
          Submit Appointment
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;