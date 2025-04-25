import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange}
          className="input" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange}
          className="input" required />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4">
          Log In
        </button>
  
      </form>
    </div>
  );
};

export default Login;
