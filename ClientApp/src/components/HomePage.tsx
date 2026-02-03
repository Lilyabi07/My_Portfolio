import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import './HomePage.css';

interface HomePageProps {
  onAdminClick?: () => void;
}

function HomePage({ onAdminClick }: HomePageProps) {
  return (
    <div className="home-page">
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to My Portfolio</h1>
          <p className="hero-subtitle">
            Showcasing projects, achievements, and professional experiences
          </p>
          <div className="hero-buttons">
            <Link to="/projects" className="btn btn-primary btn-lg">
              View Projects
            </Link>
            <Link to="/about" className="btn btn-outline-primary btn-lg">
              Learn About Me
            </Link>
          </div>
        </div>
      </section>

      <section className="highlights-section">
        <div className="container py-5">
          <h2 className="section-title">Featured Highlights</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="highlight-card">
                {/* <div className="highlight-icon">📁</div> */}
                <h3>Projects</h3>
                <p>Explore my latest projects and technical achievements</p>
                <Link to="/projects" className="highlight-link">
                  Browse Projects →
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="highlight-card">
                {/* <div className="highlight-icon">💬</div> */}
                <h3>Testimonials</h3>
                <p>See what clients and colleagues have to say</p>
                <Link to="/testimonials" className="highlight-link">
                  Read Testimonials →
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="highlight-card">
                {/* <div className="highlight-icon">👤</div> */}
                <h3>About Me</h3>
                <p>Discover my background, skills, and experience</p>
                <Link to="/about" className="highlight-link">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
