import React, { useState, useEffect } from 'react';
import SkillsManager from './admin/SkillsManager';
import ProjectsManager from './admin/ProjectsManager';
import WorkExperienceManager from './admin/WorkExperienceManager';
import TestimonialsManager from './admin/TestimonialsManager';
import './Dashboard.css';

interface DashboardProps {
  adminUsername: string;
  onLogout: () => void;
}

type AdminTab = 'skills' | 'projects' | 'experience' | 'testimonials';

function Dashboard({ adminUsername, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('skills');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    onLogout();
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="fas fa-cube"></i> Portfolio Admin
          </span>
          <div className="navbar-text text-white">
            <span className="me-3">Welcome, {adminUsername}!</span>
            <button className="btn btn-sm btn-danger" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-3">
            <div className="nav flex-column nav-pills">
              <button
                className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                <i className="fas fa-star"></i> Skills
              </button>
              <button
                className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <i className="fas fa-folder"></i> Projects
              </button>
              <button
                className={`nav-link ${activeTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                <i className="fas fa-briefcase"></i> Experience
              </button>
              <button
                className={`nav-link ${activeTab === 'testimonials' ? 'active' : ''}`}
                onClick={() => setActiveTab('testimonials')}
              >
                <i className="fas fa-comments"></i> Testimonials
              </button>
            </div>
          </div>

          <div className="col-md-9">
            <div className="tab-content">
              {activeTab === 'skills' && <SkillsManager />}
              {activeTab === 'projects' && <ProjectsManager />}
              {activeTab === 'experience' && <WorkExperienceManager />}
              {activeTab === 'testimonials' && <TestimonialsManager />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
