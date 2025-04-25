import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    specialization: '',
    availability: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prevForm) => ({
        ...prevForm,
        availability: checked
          ? [...prevForm.availability, value]
          : prevForm.availability.filter((day) => day !== value),
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registration successful!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="input"
          required
        />
        <select name="role" onChange={handleChange} className="input">
          <option value="patient">Patient</option>
          <option value="dentist">Dentist</option>
        </select>

        {/* Show additional inputs if the role is dentist */}
        {form.role === 'dentist' && (
          <>
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              onChange={handleChange}
              className="input"
              required
            />
            <div className="mt-4">
              <label className="block font-semibold mb-2">Availability:</label>
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                (day) => (
                  <div key={day} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="availability"
                      value={day}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label>{day}</label>
                  </div>
                )
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4"
        >
          Sign Up
        </button>
   
      </form>
    </div>
  );
};

export default Register;
