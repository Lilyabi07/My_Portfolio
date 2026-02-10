import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Navigation.css';

interface NavigationProps {
  isLoggedIn?: boolean;
  onAdminClick?: () => void;
  onLogout?: () => void;
}

function Navigation({ isLoggedIn = false, onAdminClick, onLogout }: NavigationProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <span className="brand-icon">PORTFOLIO</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-left-controls">
            <button
              className="nav-link language-toggle"
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              title={t('common.language')}
              aria-label={t('common.language')}
            >
              <i className="fas fa-globe"></i> {language.toUpperCase()}
            </button>
            <button
              className="nav-link theme-toggle"
              onClick={toggleTheme}
              title={theme === 'dark' ? t('common.switchToLight') : t('common.switchToDark')}
              aria-label={theme === 'dark' ? t('common.switchToLight') : t('common.switchToDark')}
            >
              {theme === 'dark' ? (
                <i className="fas fa-sun"></i>
              ) : (
                <i className="fas fa-moon"></i>
              )}
            </button>
          </div>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                to="/"
              >
                {t('nav.home')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
                to="/projects"
              >
                {t('nav.projects')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/testimonials') ? 'active' : ''}`}
                to="/testimonials"
              >
                {t('nav.testimonials')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                to="/about"
              >
                {t('nav.about')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/education') ? 'active' : ''}`}
                to="/education"
              >
                {t('nav.education')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/resume') ? 'active' : ''}`}
                to="/resume"
              >
                {t('nav.resume')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/hobbies') ? 'active' : ''}`}
                to="/hobbies"
              >
                {t('nav.hobbies')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                to="/contact"
              >
                {t('nav.contact')}
              </Link>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <button
                  className="nav-link btn btn-link"
                  onClick={onLogout}
                >
                  {t('nav.logout')}
                </button>
              ) : (
                <button
                  className="nav-link btn btn-link"
                  onClick={onAdminClick}
                >
                  {t('nav.login')}
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
