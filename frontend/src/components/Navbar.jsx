import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isDoctor, logout } = useAuth(); // Ensure useAuth is called within AuthProvider

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">OralVis</Link>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        {!user && <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>}
        {!user && <Link to="/register" className="text-gray-700 hover:text-blue-500">Register</Link>}
        {user && <Link to="/appointments" className="text-gray-700 hover:text-blue-500">appointments</Link>}
        {user && !isDoctor && <Link to="/dentists" className="text-gray-700 hover:text-blue-500">book</Link>}
        {user && <button onClick={onLogout} className="text-gray-700 hover:text-blue-500">Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
