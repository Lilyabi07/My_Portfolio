import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { setAuthToken } from './api';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PageTransition } from './components/common/PageTransition';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import ProjectsPage from './components/ProjectsPage';
import TestimonialsPage from './components/TestimonialsPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ResumePage from './components/ResumePage';
import EducationPage from './components/EducationPage';
import HobbiesPage from './components/HobbiesPage';

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
        <Route path="/admin/login" element={<PageTransition><Login onLoginSuccess={handleLoginSuccess} /></PageTransition>} />
        <Route
          path="/admin/dashboard"
          element={
            <PageTransition>
              {isLoggedIn ? (
                <Dashboard 
                  adminUsername={adminUsername}
                  onLogout={handleLogout}
                />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )}
            </PageTransition>
          }
        />

        {/* Guest Routes */}
        <Route path="/" element={<PageTransition><HomePage onAdminClick={handleAdminClick} /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><ProjectsPage onAdminClick={handleAdminClick} /></PageTransition>} />
        <Route path="/testimonials" element={<PageTransition><TestimonialsPage onAdminClick={handleAdminClick} /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage onAdminClick={handleAdminClick} /></PageTransition>} />
        <Route path="/resume" element={<PageTransition><ResumePage onAdminClick={handleAdminClick} /></PageTransition>} />
        <Route path="/education" element={<PageTransition><EducationPage onAdminClick={handleAdminClick} /></PageTransition>} />
        <Route path="/hobbies" element={<PageTransition><HobbiesPage onAdminClick={handleAdminClick} /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage onAdminClick={handleAdminClick} /></PageTransition>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<PageTransition><HomePage onAdminClick={handleAdminClick} /></PageTransition>} />
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
