import React, { useState, useEffect } from 'react';
import SkillsManager from './admin/SkillsManager';
import ProjectsManager from './admin/ProjectsManager';
import WorkExperienceManager from './admin/WorkExperienceManager';
import EducationManager from './admin/EducationManager';
import TestimonialsManager from './admin/TestimonialsManager';
import ResumeManager from './admin/ResumeManager';
import HobbiesManager from './admin/HobbiesManager';
import ContactMessagesManager from './admin/ContactMessagesManager';
import { useLanguage } from '../contexts/LanguageContext';
import './Dashboard.css';

interface DashboardProps {
  adminUsername: string;
  onLogout: () => void;
}

type AdminTab = 'skills' | 'projects' | 'experience' | 'education' | 'resume' | 'hobbies' | 'testimonials' | 'messages';

function Dashboard({ adminUsername, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('skills');
  const { t } = useLanguage();

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
            <i className="fas fa-cube"></i> {t('admin.title')}
          </span>
          <div className="navbar-text text-white">
            <span className="me-3">{t('admin.welcome')} {adminUsername}!</span>
            <button className="btn btn-sm btn-danger" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> {t('nav.logout')}
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
                <i className="fas fa-star"></i> {t('admin.tabs.skills')}
              </button>
              <button
                className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <i className="fas fa-folder"></i> {t('admin.tabs.projects')}
              </button>
              <button
                className={`nav-link ${activeTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                <i className="fas fa-briefcase"></i> {t('admin.tabs.experience')}
              </button>
              <button
                className={`nav-link ${activeTab === 'education' ? 'active' : ''}`}
                onClick={() => setActiveTab('education')}
              >
                <i className="fas fa-graduation-cap"></i> {t('admin.tabs.education')}
              </button>
              <button
                className={`nav-link ${activeTab === 'resume' ? 'active' : ''}`}
                onClick={() => setActiveTab('resume')}
              >
                <i className="fas fa-file-pdf"></i> {t('admin.tabs.resume')}
              </button>
              <button
                className={`nav-link ${activeTab === 'hobbies' ? 'active' : ''}`}
                onClick={() => setActiveTab('hobbies')}
              >
                <i className="fas fa-heart"></i> {t('admin.tabs.hobbies')}
              </button>
              <button
                className={`nav-link ${activeTab === 'testimonials' ? 'active' : ''}`}
                onClick={() => setActiveTab('testimonials')}
              >
                <i className="fas fa-comments"></i> {t('admin.tabs.testimonials')}
              </button>
              <button
                className={`nav-link ${activeTab === 'messages' ? 'active' : ''}`}
                onClick={() => setActiveTab('messages')}
              >
                <i className="fas fa-envelope"></i> {t('admin.tabs.messages')}
              </button>
            </div>
          </div>

          <div className="col-md-9">
            <div className="tab-content">
              {activeTab === 'skills' && <SkillsManager />}
              {activeTab === 'projects' && <ProjectsManager />}
              {activeTab === 'experience' && <WorkExperienceManager />}
              {activeTab === 'education' && <EducationManager />}
              {activeTab === 'resume' && <ResumeManager />}
              {activeTab === 'hobbies' && <HobbiesManager />}
              {activeTab === 'testimonials' && <TestimonialsManager />}
              {activeTab === 'messages' && <ContactMessagesManager />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
