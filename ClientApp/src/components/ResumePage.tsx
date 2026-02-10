import React, { useEffect, useState } from 'react';
import api from '../api';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatMonthYear, sortByDisplayOrder } from '../utils/formatters';
import './ResumePage.css';

interface WorkExperience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  location?: string;
  displayOrder: number;
}

interface ResumePageProps {
  onAdminClick?: () => void;
}

function ResumePage({ onAdminClick }: ResumePageProps) {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const { theme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    fetchExperiences();
    fetchCvUrl();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/work-experience');
      if (Array.isArray(response.data)) {
        setExperiences(sortByDisplayOrder(response.data));
      } else {
        setError(t('resume.invalidData'));
      }
    } catch (err) {
      setError(t('resume.loadError'));
      console.error('Error fetching work experience:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCvUrl = async () => {
    try {
      const response = await api.get('/resume/cv-url');
      if (response.data.cvUrl) {
        setCvUrl(response.data.cvUrl);
      }
    } catch (err) {
      console.error('Error fetching CV URL:', err);
    }
  };

  const formatDate = (dateString: string) => formatMonthYear(dateString, t('resume.locale'));

  return (
    <div className={`resume-page theme-${theme}`}>
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="resume-hero">
        <div className="resume-hero-content">
          <h1>{t('resume.title')}</h1>
          <p>{t('resume.subtitle')}</p>
        </div>
      </section>

      {/* CV Download Section */}
      <section className="cv-section">
        <div className="container py-5">
          {cvUrl ? (
            <div className="cv-card">
              <div className="cv-icon">
                <i className="fas fa-file-pdf"></i>
              </div>
              <div className="cv-content">
                <h3>{t('resume.downloadCV')}</h3>
                <p>{t('resume.cvDescription')}</p>
                <div className="cv-actions">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      // The GetCvUrl endpoint returns the latest resume ID in the FileUrl
                      // We need to extract the ID from the latest resume
                      window.open(`/api/resume/download-latest`, '_blank');
                    }}
                  >
                    <i className="fas fa-eye me-2"></i>
                    {t('resume.viewCV')}
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      const link = document.createElement('a');
                      link.href = `/api/resume/download-latest`;
                      link.download = 'Bianca B. - CV.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <i className="fas fa-download me-2"></i>
                    {t('resume.downloadButton')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="cv-card no-cv">
              <div className="cv-icon">
                <i className="fas fa-file-excel"></i>
              </div>
              <div className="cv-content">
                <h3>{t('resume.noCVAvailable')}</h3>
                <p className="text-muted">The CV will be available soon. Please check back later.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Work Experience Timeline */}
      <section className="experience-section">
        <div className="container py-5">
          <h2 className="section-title">{t('resume.experienceTitle')}</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
              </div>
              <p>{t('resume.loadingExperience')}</p>
            </div>
          ) : error ? (
            <div className="alert alert-info" role="alert">
              {error}
            </div>
          ) : experiences.length === 0 ? (
            <div className="alert alert-info" role="alert">
              {t('resume.noExperience')}
            </div>
          ) : (
            <div className="timeline">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="experience-card">
                      <div className="experience-header">
                        <h3 className="position">{exp.position}</h3>
                        <span className="date-range">
                          {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : t('resume.present')}
                        </span>
                      </div>
                      <div className="company-info">
                        <h4 className="company">{exp.company}</h4>
                        {exp.location && (
                          <span className="location">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {exp.location}
                          </span>
                        )}
                      </div>
                      <p className="description">{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ResumePage;
