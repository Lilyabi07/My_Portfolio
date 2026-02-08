import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { setAuthToken } from './api';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import ProjectsPage from './components/ProjectsPage';
import TestimonialsPage from './components/TestimonialsPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ResumePage from './components/ResumePage';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleLoginSuccess = (username: string) => {
    setAdminUsername(username);
    setIsLoggedIn(true);
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminUsername('');
    setAuthToken();
    navigate('/');
  };

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  return (
    <div className="App">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/admin/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard 
                adminUsername={adminUsername}
                onLogout={handleLogout}
              />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Guest Routes */}
        <Route path="/" element={<HomePage onAdminClick={handleAdminClick} />} />
        <Route path="/projects" element={<ProjectsPage onAdminClick={handleAdminClick} />} />
        <Route path="/testimonials" element={<TestimonialsPage onAdminClick={handleAdminClick} />} />
        <Route path="/about" element={<AboutPage onAdminClick={handleAdminClick} />} />
        <Route path="/resume" element={<ResumePage onAdminClick={handleAdminClick} />} />
        <Route path="/contact" element={<ContactPage onAdminClick={handleAdminClick} />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<HomePage onAdminClick={handleAdminClick} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
