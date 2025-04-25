import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const DentistList = () => {
  const [dentists, setDentists] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDentists = async () => {
      try {
        const res = await axios.get('https://dental-checkup-app.onrender.com/api/dentists', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDentists(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dentists');
      }
    };

    fetchDentists();
  }, [navigate]);

  return (
    <>
      <section className="py-10 px-4 bg-gray-50 min-h-[calc(100vh-64px)]">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Available Dentists</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {dentists.length === 0 && !error ? (
          <p className="text-gray-600 text-center">No dentists available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {dentists.map((dentist) => (
              <div key={dentist._id} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-blue-600">{dentist.name}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Specialization:</strong> {dentist.specialization}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Availability:</strong> {dentist.availability.join(', ')}
                </p>
                <button
            onClick={() => navigate(`/application-form/${dentist._id}`, { state: { doctor: dentist } })}
            className="btn-primary mt-4"
          >
            Book Appointment
          </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default DentistList;