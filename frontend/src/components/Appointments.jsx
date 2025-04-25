import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const { user, token, isDoctor } = useAuth(); // Use user, token, and isDoctor from AuthContext
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !token) {
        navigate('/login', { replace: true }); // Redirect to login if not authenticated
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const endpoint = isDoctor
          ? `/api/appointments/doctor/${user._id}`
          : `/api/appointments/patient/${user._id}`;

        const response = await axios.get(`http://localhost:5000${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch appointments.';
        setError(errorMessage);
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, token, isDoctor, navigate]);

  const handleShowResults = async (appointmentId) => {
    if (isDoctor) {
      // Doctor: Upload descriptions
      const description = prompt('Enter the description for this appointment:');
      if (!description) return;

      try {
        await axios.post(
          `http://localhost:5000/api/appointments/${appointmentId}/results`,
          { description },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert('Description uploaded successfully!');
      } catch (err) {
        console.error('Error uploading description:', err);
        alert('Failed to upload description.');
      }
    } else {
      // Patient: Fetch checkup results
      try {
        const response = await axios.get(
          `http://localhost:5000/api/appointments/${appointmentId}/results`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert(`Checkup Results: ${response.data.description}`);
      } catch (err) {
        console.error('Error fetching results:', err);
        alert('Failed to fetch checkup results.');
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading appointments...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isDoctor ? 'Your Patients' : 'Your Appointments'}
      </h2>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="p-4 bg-white shadow-md rounded">
              {isDoctor ? (
                <>
                  <p>
                    <strong>Patient Name:</strong> {appointment.patientName}
                  </p>
                  <p>
                    <strong>Email:</strong> {appointment.patientEmail}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Doctor Name:</strong> {appointment.doctorName}
                  </p>
                </>
              )}
              <p>
                <strong>Date:</strong>{' '}
                {new Date(appointment.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p>
                <strong>Time:</strong> {appointment.time}
              </p>
              <p>
                <strong>Message:</strong> {appointment.message || 'N/A'}
              </p>
              <p>
                <strong>Result:</strong> {appointment.description || 'N/A'}
              </p>
              <button
                onClick={() => handleShowResults(appointment._id)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Show Results
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Appointments;