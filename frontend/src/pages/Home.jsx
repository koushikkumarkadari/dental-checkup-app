import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login page if token is not found
    }
  }, [navigate]);

  return (
    <>
      <section className="text-center py-10 px-4 bg-gray-50 min-h-[calc(100vh-64px)]">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to OralVis Dental Checkup</h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Your one-stop solution for virtual dental diagnostics and expert consultations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: 'Online Dentist Booking', desc: 'Find and book dentists based on specialization and availability.' },
            { title: 'Upload Dental Images', desc: 'Submit teeth photos for review using secure image uploads.' },
            { title: 'Get Digital Reports', desc: 'Receive PDF reports with expert comments and treatment suggestions.' },
            { title: 'Fast Consultations', desc: 'Get checkup results quickly through our optimized backend system.' },
            { title: 'Secure Records', desc: 'All your checkup data is encrypted and stored securely.' },
            { title: 'Mobile Friendly', desc: 'Access your dental reports from anywhere, anytime.' },
          ].map((service, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-600">{service.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
