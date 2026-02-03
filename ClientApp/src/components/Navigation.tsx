import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  isLoggedIn?: boolean;
  onAdminClick?: () => void;
  onLogout?: () => void;
}

function Navigation({ isLoggedIn = false, onAdminClick, onLogout }: NavigationProps) {
  const location = useLocation();

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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
                to="/projects"
              >
                Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/testimonials') ? 'active' : ''}`}
                to="/testimonials"
              >
                Testimonials
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                to="/about"
              >
                About Me
              </Link>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <button
                  className="nav-link btn btn-link"
                  onClick={onLogout}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="nav-link btn btn-link"
                  onClick={onAdminClick}
                >
                  Login
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
