import React from 'react';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import DentistList from './components/DentistList';
import ApplicationForm from './components/ApplicationForm';
import Appointments from './components/Appointments';


function App() {
  return (
       <AuthProvider>
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dentists" element={<DentistList />} />
        <Route path="/application-form/:doctorId" element={<ApplicationForm />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;


